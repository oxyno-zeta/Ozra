
// Require
var gulp = require('gulp');
var bump = require('gulp-bump');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var gulpSequence = require('run-sequence');
var zip = require('gulp-zip');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var del = require('del');
var es = require('event-stream');

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

var sources = [
    'src/**/*', '!src/**/*.spec.js', '!src/{views,websiteDev,bower_components}/**/*',
    'package.json', 'bower.json', 'log4jsConf.json', 'README.md'
];
var distDirTemp = '.tmp';
var distTempSources = distDirTemp + '/**/*';
var distDir = 'dist';


// **************************************************** \\
// *****************    Default    ******************** \\
// **************************************************** \\

gulp.task('default', ['dev:env']);

// **************************************************** \\
// ******************     Bump    ********************* \\
// **************************************************** \\
// MAJOR ('major') version when you make incompatible API changes
// MINOR ('minor') version when you add functionality in a backwards-compatible manner
// PATCH ('patch') version when you make backwards-compatible bug fixes.
gulp.task('bump', ['bump:patch']);

gulp.task('bump:major', function(){
    return gulp.src(['package.json', 'bower.json'])
        .pipe(bump({type:'major'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function(){
    return gulp.src(['package.json', 'bower.json'])
        .pipe(bump({type:'minor'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump:patch', function(){
    return gulp.src(['package.json', 'bower.json'])
        .pipe(bump({type:'patch'}))
        .pipe(gulp.dest('./'));
});

// **************************************************** \\
// ****************** Development ********************* \\
// **************************************************** \\

gulp.task('browser-sync', function() {
    return browserSync.init(null, {
        proxy: 'http://localhost:2050',
        files: ['src/**/*.*'],
        browser: 'google-chrome',
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

gulp.task('dev:env', function(cb){
    return gulpSequence('nodemon', 'web:watch', 'browser-sync', cb);
});

// **************************************************** \\
// ********************  Clean  *********************** \\
// **************************************************** \\

gulp.task('clean', ['clean:dist', 'clean:tmp']);

gulp.task('clean:dist', function(){
    return del(distDir);
});

gulp.task('clean:tmp', function(){
    return del(distDirTemp);
});

// **************************************************** \\
// ******************** Release *********************** \\
// **************************************************** \\

// Prepare
gulp.task('prepare:archive', function(){
    function onlyDirs(es) {
        return es.map(function(file, cb) {
            if (file.stat.isFile()) {
                return cb(null, file);
            } else {
                return cb();
            }
        });
    }

    return gulp.src(sources)
        .pipe(onlyDirs(es))
        .pipe(gulp.dest(distDirTemp));
});

// Release
gulp.task('release', function(cb){
    gulpSequence('prepare:archive', 'web:release', ['tar', 'zip'], 'clean:tmp', cb);
});

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



// **************************************************** \\
// *********************  Site  *********************** \\
// **************************************************** \\
var path = require('path');
var minifyHtml = require('gulp-minify-html');
var angularTemplatecache = require('gulp-angular-templatecache');
var wiredep = require('wiredep').stream;
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var csso = require('gulp-csso');
var uglifySaveLicense = require('uglify-save-license');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');

// Variables
var webSourcesDir = 'src/websiteDev';
var webDistDir = 'src/views';
var wiredepConf = {
    directory: 'bower_components'
};

gulp.task('web:partials', function () {
    return gulp.src([
        path.join(webSourcesDir, '/**/*.html'),
        path.join('!' + webSourcesDir, '/index.html')
    ])
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtml.js', {
            module: 'ozra'
        }))
        .pipe(gulp.dest(webDistDir));
});

gulp.task('web:sass', function(){
    var injectFiles = gulp.src([
        path.join(webSourcesDir, '/**/*.scss'),
        path.join('!' + webSourcesDir, '/ozra.scss')
    ], {
        read: false
    });

    var injectOptions = {
        transform: function (filePath) {
            filePath = filePath.replace(webSourcesDir + '/', '');
            return '@import "' + filePath + '";';
        },
        starttag: '// inject',
        endtag: '// endinject',
        addRootSlash: false
    };

    return gulp.src(path.join(webSourcesDir, '/ozra.scss'))
        .pipe(inject(injectFiles, injectOptions))
        .pipe(wiredep({}, wiredepConf))
        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', sass.logError)
        .pipe(autoprefixer()).on('error', console.error)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(webDistDir));
});

gulp.task('web:js', function(){
    return gulp.src([
        path.join(webSourcesDir, '/**/*.js')
    ]).pipe(gulp.dest(webDistDir));
});

gulp.task('web:inject', function(){
    var injectStyles = gulp.src([
        path.join(webDistDir, '/**/*.css')
    ], {
        read: false
    });

    var injectScripts = gulp.src([
        path.join(webDistDir, '/**/*.js')
    ])
        .pipe(angularFilesort()).on('error', console.error);

    var injectOptions = {
        ignorePath: [webDistDir],
        addRootSlash: false
    };

    return gulp.src(path.join(webSourcesDir, '/index.html'))
        .pipe(inject(injectStyles, injectOptions))
        .pipe(inject(injectScripts, injectOptions))
        .pipe(wiredep({}, wiredepConf))
        .pipe(gulp.dest(webDistDir));
});

gulp.task('web:clean', function(){
    return del(webDistDir);
});

gulp.task('web:dev', function(cb){
    return gulpSequence('web:clean', ['web:partials', 'web:sass', 'web:js'], 'web:inject', cb);
});

gulp.task('web:watch', ['web:dev'], function(){
    gulp.watch([
        path.join(webSourcesDir, '/**/*')
    ], ['web:dev'], function(){
        browserSync.reload({
            stream: true
        });
    });
});

gulp.task('web:release:build', ['web:dev'], function(){
    return gulp.src(path.join(webDistDir, '/*.html'))
        .pipe(useref())
        .pipe(gulpif('*.js', ngAnnotate()))
        .pipe(gulpif('*.js', uglify({
            preserveComments: uglifySaveLicense
        })))
        .pipe(gulpif('*.css', csso()))
        .pipe(gulpif('*.html', minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        })))
        .pipe(gulp.dest(path.join(distDirTemp, '/views/')));
});

gulp.task('web:release:clean', function(){
    return del(path.join(distDirTemp, '/views/'));
});

gulp.task('web:release', function(cb){
    return gulpSequence('web:release:clean', 'web:release:build', cb);
});



