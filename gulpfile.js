/**
 * Description: This file defines and executes tasks for gulp email workflow.
 * Version: 0.2.1
 * Author: Eric Klemen
 */

'use strict';



// IMPORT CONFIG FILE DEFINED BY WD:

var config = require('./gulpfile.config.json');






// GULP NODE REQUIREMENTS:
// installing them in terminal using the node package manager. ex: $npm install gulp-rename --save-dev

var gulp = require('gulp'),
  // allows html files to be included into eachother. includes variable support
  include = require('gulp-html-tag-include'),
  // sass preprocessing
  sass = require('gulp-sass'),
  // inline all <script>, <link> and <img> tags that contain an "inline" attribute
  inlineSource = require('gulp-inline-source'),
  // inline <style> css into the element's style attribute
  juice = require('gulp-juice'),
  // send email through smtp
  mail = require('gulp-mailing');






// GULP TASKS:

// HTML INCLUDES

gulp.task('htmlInclude', function() {
  return gulp.src(['./source/**/*.html', '!./source/_partials/*.html'])
    .pipe(include())
    .pipe(gulp.dest('./build/'));
});



// SASS

gulp.task('sass', function(){
  return gulp.src(['./source/**/*.scss', '!./source/css/*.scss'])
    .pipe(sass({
      outputStyle:'compact'
    }))
    .pipe(gulp.dest('./build/'));
});



// INLINE CSS

gulp.task(
  'inlineEmailCSS',
  gulp.series(gulp.parallel('htmlInclude', 'sass'), function () {
    return gulp.src('./build/**/*.html')
    .pipe(inlineSource({
      compress: false
    }))
    .pipe(juice({
      applyAttributesTableElements:true,
      applyWidthAttributes:true,
      removeStyleTags:false,
      webResources: {
        images: false
      }
    }))
    .pipe(gulp.dest('./build/'));
  }
));


// SEND TEST EMAIL

// var campaign = config.campaign;
// var filename = config.filename;
// var emailSubject = filename + ' - Rd' + config.round;

// var smtpInfo = {
//   auth: {
//     user: "ALRWD1",
//     pass: "royallwd"
//   },
//   host: 'smtp-mail.outlook.com',
//   secureConnection: false,
//   port: 587
// };

// gulp.task('mail', function () {  
//   return gulp.src('./build/' + campaign + '/' + filename  + '.html')
//     .pipe(mail({
//       subject: emailSubject,
//       to: [
//         config.eoaInboxEmail
//       ],
//       from: 'EAB Web Designer <eabwd@outlook.com>',
//       smtp: smtpInfo
//     }));
// });



// GULP WATCH:

gulp.task('watch', function(){
  gulp.watch('./source/**/*.html', gulp.series('inlineEmailCSS'));
  gulp.watch('./source/**/*.scss', gulp.series('inlineEmailCSS'));
})