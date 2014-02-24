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

gulp.task('watch', function(){
	server.listen(35729, function (err) {
		if (err) {
			return console.log(err)
		};
	});
	gulp.watch(['./js/**/*.js'], ['reload']);
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


gulp.task('compileJS', function() {
	
	gulp.src('./js/libs/large/*.js')
		.pipe(concat("./js/build/large.min.js"))
		.pipe(gulp.dest('./dist/'));
	
	gulp.src('./js/libs/medium/*.js')
		.pipe(concat("./js/build/medium.min.js"))
		.pipe(gulp.dest('./dist/'));
	
	gulp.src('./js/libs/small/*.js')
		.pipe(concat("./js/build/small.min.js"))
		.pipe(gulp.dest('./dist/'));
});


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
	minify: function (){
		gulp.run('compileJS');
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
