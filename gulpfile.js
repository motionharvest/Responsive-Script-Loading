var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	compass = require('gulp-compass'),
	plumber = require('gulp-plumber'),
	// autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	lr = require('tiny-lr'),
	watch = require('gulp-watch'),
	server = lr();


gulp.task('default', ['watch']);

var dir = {
	sass : './sass/**/*.scss',
	//process: './preprocess/**/*.scss',
	views: './**/*.html',
	js: './js/dev/**/*.js'
};
/*
	gulp watch
	-> Create server for LiveReload Chrome Extension (working)
	-> Watch folder, and update when ready
*/
gulp.task('watch', function(){
	server.listen(35729, function (err) {
		if (err) {
			return console.log(err)
		};
	});
	gulp.watch(dir.sass, ['gumbyCompile']);
	gulp.watch(dir.process, ['customCompile']);
	gulp.watch([dir.views, dir.js], ['reload']);
	
});

/*
	compile with compass
*/
gulp.task('gumbyCompile', function(){
	console.log("[gumbyComple] Running...");
	
	gulp.src(dir.sass)
		.pipe(compass({
			config_file: './config.rb',
			css: 'css',
			require: ['susy', 'modular-scale']
		}))
		.pipe(gulp.dest('./css/'))
		.pipe(livereload(server));
});


/*gulp.task('customCompile', function(){
	console.log("[customComple] Running...");
	
	gulp.src(dir.process)
		.pipe(compass({
			css: 'css',
			sass: 'preprocess'
		}))
		.pipe(gulp.dest('./css/'))
		.pipe(livereload(server));
});*/


/*
	Reload the server
*/
gulp.task('reload', function(){
	console.log("[reload] Running...");
	gulp.src('index.html')
		.pipe(livereload(server));
});



/*
	Give internal access via buffer
*/
var stdin = process.openStdin();
stdin.setEncoding( 'utf8' );
var abilities = {
	reload: function (){
		gulp.run('reload');
	}
}
stdin.on( 'data', function( key ){
	key = key.replace(/(\r\n|\n|\r)/gm,"");
	
	if(abilities.hasOwnProperty(key)){  
		abilities[key]();
	} else {
		console.log("command not found. these are available:", abilities); 
	}
	return;
		
});
