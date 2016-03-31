'use strict';

import path from 'path';

export default function(gulp, plugins, taskName, config, taskTarget) {
    let dirs = config.directories;
    let entries = config.entries;

    // Watch task
    gulp.task('watchtask', () => {
        console.log('watch task');
        // Styles
        gulp.watch([
            path.join(dirs.source, entries.css)
        ], ['sass']);
    });
}
