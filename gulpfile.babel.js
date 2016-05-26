'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import pjson from './package.json';
import wrench from 'wrench';
import path from 'path';

// Load all gulp plugins based on their names
// EX: gulp-copy -> copy
const plugins = gulpLoadPlugins();

let config = pjson.config;
let taskName = process.argv[2];
let dirs = config.directories;

// This will grab all js in the `gulp` directory
// in order to load all gulp tasks
wrench.readdirSyncRecursive('./gulp').filter((file) => {
    return (/\.(js)$/i).test(file);
}).map(function(file) {
    require('./gulp/' + file)(gulp, plugins, taskName, config, path.resolve(dirs.destination));
});

// Default task
gulp.task('default', [], () => {
    gulp.start('build');
});

// Build production-ready code
gulp.task('build', [
    'sass',
    'browserify'
]);

// Server tasks with watch
gulp.task('watch', [
    'sass',
    'browserify',
    'watchtask'
]);

// Testing
gulp.task('test', ['eslint']);
