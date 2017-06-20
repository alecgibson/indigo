const gulp = require('gulp');
const runSequence = require('run-sequence');
const shell = require('gulp-shell');
const typescript = require('gulp-typescript');
const typescriptProject = typescript.createProject('tsconfig.json');
const pump = require('pump');
const clean = require('gulp-clean');
const nodemon = require('gulp-nodemon');

gulp.task('clean', (callback) => {
  pump([
      gulp.src('release', {read: false}),
      clean()
    ],
    callback
  );
});

gulp.task('postgres', shell.task([
  "pg_ctl start -D db -l db/db.log",
]));

gulp.task('migrate', shell.task([
  'sequelize db:migrate'
]));

gulp.task('typescript', () => {
  return typescriptProject.src()
    .pipe(typescriptProject())
    .js.pipe(gulp.dest("release"));
});

gulp.task('copy', (callback) => {
  pump([
      gulp.src([
        'source/**/*.js'
      ]),
      gulp.dest('release')
    ],
    callback
  );
});

gulp.task('build', (callback) => {
  runSequence(
    'typescript',
    'copy',
    'postgres',
    'migrate',
    callback
  );
});

gulp.task('run-server', () => {
  nodemon({
    script: 'release/Main.js',
    tasks: ['typescript'],
    watch: ['source'],
    ext: 'js ts'
  });
});

gulp.task('default', () => {
  runSequence(
    'build',
    'run-server'
  );
});
