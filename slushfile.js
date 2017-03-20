/*
 * slush-react-webpack-hmr
 * https://github.com/kevalbhatt/slush-react-webpack-hmr
 *
 * Copyright (c) 2017, keval bhatt
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    exec = require('child_process').exec,
    runSequence = require('run-sequence'),
    path = require('path');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function() {
    var workingDirName = path.basename(process.cwd()),
        homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    } else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        appName: workingDirName,
        userName: osUserName || format(user.name || ''),
        authorName: user.name || '',
        authorEmail: user.email || ''
    };
})();

gulp.task('copy', function(done) {
    var prompts = [];
    //Ask
    inquirer.prompt(prompts,
        function(answers) {
            gulp.src([__dirname + '/templates/**', __dirname + '/templates/.*'])
                .pipe(template(answers))
                .pipe(rename(function(file) {
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .on('finish', function() {
                    return done();
                })
        });
});

gulp.task('default', function(done) {
    runSequence('copy', ['install'], done);
});
gulp.task('install', function(done) {
    exec('npm install', function(err, stdout, stderr) {
        exec('npm start').stdout.pipe(process.stdout);
        done();
        console.log("----------------Server started---------------------");
    }).stdout.pipe(process.stdout);
});
