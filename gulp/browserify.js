'use strict';

import path from 'path';
import glob from 'glob';
import browserify from 'browserify';
import watchify from 'watchify';
import envify from 'envify';
import babelify from 'babelify';
import _ from 'lodash';
import vsource from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import gulpif from 'gulp-if';
import quotemeta from 'quotemeta';

export default function(gulp, plugins, taskName, config, taskTarget) {
    let dirs = config.directories;
    let entries = config.entries;
    let absSource = path.resolve(dirs.source);
    let absSourceRe = new RegExp(quotemeta(absSource + '/'), 'g');

    let browserifyTask = (files, minified) => {
        return files.map((entry) => {
            var customOpts = {
                    entries: [entry],
                    debug: true,
                    transform: [babelify, envify]
                },
                bundler = browserify(customOpts);

            if (taskName == 'watch') {
                // Setup Watchify for faster builds
                let opts = _.assign({}, watchify.args, customOpts);
                bundler = watchify(browserify(opts));
            }

            let rebundle = function() {
                let startTime = new Date().getTime();
                let log = plugins.util.log;
                let {red, cyan, magenta} = plugins.util.colors;
                bundler
                    .transform('exposify', {
                        expose: {
                            jquery: 'django.jQuery',
                            grappelli: 'grappelli',
                            'django/date-time-shortcuts': 'DateTimeShortcuts',
                            'django/select-filter': 'SelectFilter'
                        }
                    })
                    .bundle()
                    .on('error', function(err) {
                        if (err && err.codeFrame) {
                            log(
                                red('Browserify error: '),
                                cyan(err.filename) + ` [${err.loc.line},${err.loc.column}]`,
                                '\n' + err.message.replace(absSourceRe, ''),
                                '\n' + err.codeFrame);
                        } else {
                            log(red('Browserify error: '), err);
                        }
                        this.emit('end');
                    })
                    .on('error', plugins.notify.onError(function (err) {
                        var msg, filename = err.filename;
                        if (err.loc) {
                            msg = err.message.replace(filename,
                                path.basename(filename) + ` [${err.loc.line},${err.loc.column}]`);                            
                        } else {
                            msg = err.message.replace(absSource, '.');
                        }
                        return {
                            title: 'Browserify error',
                            message: msg.replace(absSourceRe, '')
                        };
                    }))
                    .pipe(vsource(entry))
                    .pipe(buffer())
                    .pipe(plugins.rename(function(filepath) {
                        filepath.dirname = filepath.dirname.replace(dirs.source, '');
                        filepath.extname = (minified) ? '.min.js' : '.js';
                    }))
                    .pipe(plugins.sourcemaps.init({loadMaps: true}))
                    .pipe(gulpif(minified, plugins.uglify()))
                    .on('error', log)
                    .pipe(plugins.sourcemaps.write('.', {
                        includeContent: false,
                        mapSources: function(sourcePath) {
                            if (sourcePath.match(/_prelude\.js/)) {
                                sourcePath = dirs.source + '/vendor/browser-pack/_prelude.js';
                            }
                            return path.relative(dirs.destination, sourcePath);
                        }
                    }))
                    .pipe(gulp.dest(taskTarget))
                    .on('end', function() {
                        let time = ((new Date().getTime() - startTime) / 1000) + 's';
                        let action = 'browserified';
                        action += (minified) ? ' + minified'  : '';
                        log(cyan(entry) + ' was ' + action + ': ', magenta(time));
                    });
            };

            if (taskName == 'watch') {
                bundler.on('update', rebundle); // on any dep update, runs the bundler
                bundler.on('log', plugins.util.log); // output build logs to terminal
            }
            return rebundle();
        });
    };

    // Browserify Task
    gulp.task('browserify', (done) => {
        return glob('./' + path.join(dirs.source, entries.js), function(err, files) {
            if (err) { done(err); }
            var tasks = [
                browserifyTask(files),
                browserifyTask(files, true)
            ];
            return function() {
                return function() {
                    tasks.forEach(function(task) { task(); });
                };
            };
        });
    });
}
