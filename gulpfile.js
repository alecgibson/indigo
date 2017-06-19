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

gulp.task('start-database', shell.task([
  "pg_ctl start -D db",
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
    'start-database',
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

gulp.task('test', shell.task([
  'psql -U postgres -c "DROP TABLE IF EXISTS indigotest"',
  'psql -U postgres -c "CREATE TABLE indigotest"',
  'sequelize db:migrate --env test',
  'cross-env NODE_ENV=test mocha -r ts-node/register test/**/*.ts',
  'sequelize db:migrate:undo:all --env test'
]));

gulp.task('default', () => {
  runSequence(
    'run-server'
  );
});
