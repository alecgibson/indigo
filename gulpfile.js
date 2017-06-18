const gulp = require('gulp');
const runSequence = require('run-sequence');
const shell = require('gulp-shell');
const typescript = require('gulp-typescript');
const typescriptProject = typescript.createProject('tsconfig.json');

gulp.task('migrate', shell.task([
  'sequelize db:migrate'
]));

gulp.task('typescript', () => {
  return typescriptProject.src()
    .pipe(typescriptProject())
    .js.pipe(gulp.dest("release"));
});

gulp.task('build', (callback) => {
  runSequence(
    'migrate',
    'typescript',
    callback
  );
});
