/* eslint-disable no-mixed-spaces-and-tabs */
const gulp = require("gulp"),
	  sass = require("gulp-sass"),
	  cleanCSS = require('gulp-clean-css');
	  browserSync = require("browser-sync").create();

require("dotenv").config();

const port = process.env.PORT || 3000

gulp.task("sass", function() {
	return gulp.src("./dev/sass/**/*.scss")
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(cleanCSS())
		.pipe(gulp.dest("public/dist"))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task("watch", function() {
	browserSync.init({
		proxy: `localhost:${port}`
	});

	gulp.watch("./dev/sass/**/*.scss", gulp.series("sass"));
	gulp.watch("views/**/*.hbs", browserSync.reload);
	gulp.watch("public/js/**/*.js", browserSync.reload);
});