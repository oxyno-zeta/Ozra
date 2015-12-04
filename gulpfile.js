
// Require
var gulp = require('gulp');
var bump = require('gulp-bump');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var gulpSequence = require('gulp-sequence');
var zip = require('gulp-zip');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var del = require('del');

// **************************************************** \\
// ***************** Configuration ******************** \\
// **************************************************** \\
var packageJSON = require('./package.json');

var mochaOptions = {
	reporter: 'spec',
	timeout: 10000,
	color: true,
	bail: false // True : stop after first fail
};

// Nodemon configuration
var nodemonConfig = require('./nodemon.json');
// Remove some parts
delete nodemonConfig.events;

var sources = ["src/**/*", "!src/**/*.spec.js", "package.json", "log4js_Configuration.json"];
var distDirTemp = ".tmp";
var distTempSources = distDirTemp + "/**/*";
var distDir = "dist";


// **************************************************** \\
// *****************    Default    ******************** \\
// **************************************************** \\

gulp.task('default', ['nodemon'], function () {});

// **************************************************** \\
// ******************     Bump    ********************* \\
// **************************************************** \\
// MAJOR ("major") version when you make incompatible API changes
// MINOR ("minor") version when you add functionality in a backwards-compatible manner
// PATCH ("patch") version when you make backwards-compatible bug fixes.
gulp.task('bump', ['bump:patch']);

gulp.task('bump:major', function(){
	gulp.src('package.json')
		.pipe(bump({type:'major'}))
		.pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function(){
	gulp.src('package.json')
		.pipe(bump({type:'minor'}))
		.pipe(gulp.dest('./'));
});

gulp.task('bump:patch', function(){
	gulp.src('package.json')
		.pipe(bump({type:'patch'}))
		.pipe(gulp.dest('./'));
});

// **************************************************** \\
// ****************** Development ********************* \\
// **************************************************** \\

gulp.task('browser-sync', function() {
	return browserSync.init(null, {
		proxy: "http://localhost:2050",
		files: ["src/**/*.*"],
		browser: "google-chrome",
		port: 7000
	});
});

gulp.task('nodemon', function (cb) {

	var started = false;

	nodemon(nodemonConfig).once('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task('dev:env', gulpSequence('nodemon', 'browser-sync'));

// **************************************************** \\
// ********************  Clean  *********************** \\
// **************************************************** \\

gulp.task('clean', ['clean:dist', 'clean:tmp']);

gulp.task('clean:dist', function(){
	del(distDir);
});

gulp.task('clean:tmp', function(){
	del(distDirTemp);
});

// **************************************************** \\
// ******************** Release *********************** \\
// **************************************************** \\

// Prepare
gulp.task('prepare:archive', function(){
	return gulp.src(sources)
		.pipe(gulp.dest(distDirTemp));
});

// Release
gulp.task('release', gulpSequence('prepare:archive', ['tar', 'zip'], 'clean:tmp'));

gulp.task('zip', function(){
	return gulp.src(distTempSources)
		.pipe(zip('archive.zip'))
		.pipe(gulp.dest(distDir + '/' + packageJSON.version));
});

gulp.task('tar', function () {
	return gulp.src(distTempSources)
		.pipe(tar('archive.tar'))
		.pipe(gzip())
		.pipe(gulp.dest(distDir + '/' + packageJSON.version));
});


// **************************************************** \\
// ********************  Tests  *********************** \\
// **************************************************** \\






