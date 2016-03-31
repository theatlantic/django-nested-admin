'use strict';

import path from 'path';
import autoprefixer from 'autoprefixer';
import gulpif from 'gulp-if';

export default function(gulp, plugins, taskName, config, taskTarget) {
    let dirs = config.directories;
    let entries = config.entries;

    let sassTask = (minified) => {
        gulp.src(path.join(dirs.source, entries.css))
            .pipe(plugins.plumber())
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass({
                outputStyle: 'expanded',
                precision: 10,
                includePaths: [
                    'node_modules/compass-mixins/lib',
                    path.join(dirs.source)
                ]
            }).on('error', plugins.sass.logError))
            .pipe(plugins.postcss([autoprefixer({browsers: ['last 2 version', '> 5%', 'safari 5', 'ios 6', 'android 4']})]))
            .pipe(gulpif(minified, plugins.cssnano({rebase: false, zindex: false})))
            .pipe(gulpif(minified, plugins.rename({ extname: '.min.css' })))
            .pipe(plugins.sourcemaps.write('./'))
            .pipe(gulp.dest(taskTarget));
    }

    // Sass compilation
    gulp.task('sass', () => {
        sassTask();
        sassTask(true);
    });
}
