const { task, watch, dest, src, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync')
const sortCSSmq = require('sort-css-media-queries');
const mqpacker = require('css-mqpacker');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const csscomb = require('gulp-csscomb');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const del = require('del');

const PLUGINS = [
  autoprefixer({ overrideBrowserslist: ['last 5 versions', '> 1%'], cascade: true }),
  mqpacker({ sort: sortCSSmq })
];

const PATH = {
  scssRoot: './assets/scss/style.scss',
  scssFolder: './assets/scss',
  scssFiles: './assets/scss/**/*.scss',
  cssFolder: './assets/css',
  htmlFolder: './*.html',
  jsFolder: './assets/js',
  jsFiles: [
    './assets/js/**/*.js',
    '!./assets/js/**/*min.js',
    '!./assets/js/**/bundle.js'
  ],
  jsMinFiles: './assets/js/**/*.min.js',
  jsBundleName: 'bundle.js',
  buildFolder: 'dist.js',
}

function scss() {
  return src(PATH.scssRoot)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(PLUGINS))
    .pipe(dest(PATH.cssFolder))
    .pipe(browserSync.stream())
}

function scssDev() {
  const pluginsForDevMode = [...PLUGINS]
  return src(PATH.scssRoot, { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(pluginsForDevMode.splice(1, 1)))
    .pipe(dest(PATH.cssFolder, { sourcemaps: true }))
    .pipe(browserSync.stream())
}

function scssMin() {
  const pluginsExtended = [...PLUGINS, cssnano({ preset: 'default' })];

  return src(PATH.scssRoot)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(pluginsExtended))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(PATH.cssFolder))
}

function syncInit() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
}

async function sync() {
  browserSync.reload();
}

function watchFiles() {
  syncInit()
  watch(PATH.scssFiles, scss)
  watch(PATH.htmlFolder, sync)
  watch(PATH.jsFiles, sync)
}

function comb() {
  return src(PATH.scssFiles)
    .pipe(csscomb('.csscomb.json'))
    .pipe(dest(PATH.scssFolder))
}

function concatJS() {
  return src(PATH.jsFiles)
    .pipe(concat(PATH.jsBundleName))
    .pipe(dest(PATH.jsFolder))
}
function minJS() {
  return src(PATH.jsFiles)
    .pipe(terser({
      toplevel: true,
      output: {
        quote_style:3
      }
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest(PATH.jsFolder))
}

function buildJS(){
  return src(PATH.jsMinFiles)
  .pipe(dest(PATH.buildFolder + '/js'))
}

async function clearFolder() {
  await del(PATH.buildFolder, { force: true })
  return true
}

task('dev', scssDev);
task('min', scssMin);
task('comb', comb)
task('scss', scss);
task('minjs', minJS)
task('watch', watchFiles)
task('build', series(clearFolder, buildJS))
task('concat', concatJS)