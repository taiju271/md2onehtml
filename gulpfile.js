'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const changed = require('gulp-changed');
const cssnano = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
const inlineCss = require('gulp-inline-css');
const pandoc = require('gulp-pandoc');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');

const os = require('os');
const path = require('path');
const fs = require('fs');
const sh = require('shelljs');

const cfg = require('./config.json');

const resDir = path.join(process.cwd(), 'res', '/');
const tmpDir = path.join(process.cwd(), 'tmp', '/');

function pandocVersion() {
  return sh
    .exec('pandoc --version', { silent: true })
    .stdout.match(/^pandoc.* (.*?)\r?\n/)[1];
}

function now(format) {
  const moment = require('moment');
  moment.locale('ja');
  return moment().format('LLLL');
}

function htmlminConf() {
  const htmlminConf = cfg.htmlmin;

  if (Array.isArray(htmlminConf.ignoreCustomComments)) {
    htmlminConf.ignoreCustomComments = htmlminConf.ignoreCustomComments.map(
      re => {
        const match = re.match(/^\/(.*?)\/([gimy]*)$/);
        if (null == match) {
          gutil.log(
            gutil.colors.red('Syntax ERROR:'),
            'htmlmin conf "ignoreCustomComments" regexp:',
            gutil.colors.red(re),
          );
          gutil.beep();
          process.exit(1);
        }
        return new RegExp(match[1], match[2]);
      },
    );
  }

  return htmlminConf;
}

function lang(def) {
  def = def || 'en';
  if ('string' !== typeof def) {
    def = 'en';
  }
  return cfg.lang || def;
}

function pandocArgs() {
  const pandocVer = pandocVersion();
  const txt = require('./res/i18n.json');
  const n = now(cfg.dateFormat);
  const l = lang();

  const pandocArgs = cfg.pandoc.args.concat([
    `--variable=date:${n}`,
    `--variable=rootdir:${__dirname}`,
    `--variable=version:${pandocVer}`,
    `--variable=lang:${l}`,
    `--variable=text_toc:${txt[l].toc}`,
    `--variable=text_author:${txt[l].author}`,
    `--variable=text_created:${txt[l].created}`,
    `--template=${path.join(resDir, 'template.html')}`,
    //'+RTS',
    //'-K128m',
    //'-RTS',
  ]);

  if (cfg.mermaid || cfg['font-awesome'] || cfg.bootstrap) {
    pandocArgs.push('--variable=thirdparty:true');
    if (cfg.mermaid) {
      pandocArgs.push('--variable=mermaid:true');
      if (
        os
          .type()
          .toString()
          .match('Windows') !== null
      ) {
        pandocArgs.push(`--filter=pandoc-mermaid.cmd`);
      } else {
        pandocArgs.push(`--filter=pandoc-mermaid`);
      }
    }
    if (cfg['font-awesome']) {
      pandocArgs.push('--variable=fontawesome:true');
    }
    if (cfg.bootstrap) {
      sh.sed(
        '-i',
        /\*{.*?}:after,:before{.*?}/g,
        '',
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
      );
      pandocArgs.push('--variable=bootstrap:true');
    }
  }

  return pandocArgs;
}

gulp.task('jsmin', () => {
  return gulp
    .src(['res/**/*.js', '!**/*.min.js'])
    .pipe(changed(tmpDir, { extension: '.min.js' }))
    .pipe(uglify({ mangle: true, compress: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(tmpDir));
});

gulp.task('cssmin', () => {
  return gulp
    .src(['res/**/*.css', '!**/*.min.css'])
    .pipe(changed(tmpDir, { extension: '.min.css' }))
    .pipe(cssnano({ discardComments: { removeAll: true } }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(tmpDir));
});

gulp.task('copy', () => {
  return gulp
    .src(['html/**'], { base: 'html' })
    .pipe(changed(cfg.dest, { extension: '.html' }))
    .pipe(gulp.dest(cfg.dest));
});

gulp.task('build', () => {
  const dest = 'html/';
  return gulp
    .src(['**/*.md'], { cwd: 'markdown' })
    .pipe(changed(dest, { extension: '.html' }))
    .pipe(
      pandoc({
        from: cfg.pandoc.from,
        to: 'html5',
        ext: '.html',
        args: pandocArgs(),
      }),
    )
    .pipe(
      replace(/<!-- inject-css-inline\s+src="(.+\.css)"[^>]*>/g, function(
        s,
        filename,
      ) {
        const style = fs.readFileSync(filename, 'utf8');
        return '<style>' + style + '</style>';
      }),
    )
    .pipe(
      inlineCss({
        applyLinkTags: false,
        removeLinkTags: false,
      }),
    )
    .pipe(
      replace(/<!-- inject-css\s+src="(.+\.css)"[^>]*>/g, function(
        s,
        filename,
      ) {
        const style = fs.readFileSync(filename, 'utf8');
        return '<style>' + style + '</style>';
      }),
    )
    .pipe(
      replace(/<!-- inject-js\s+src="(.+\.js)"[^>]*>/g, function(s, filename) {
        const script = fs.readFileSync(filename, 'utf8');
        return '<script>' + script + '</script>';
      }),
    )
    .pipe(
      replace(
        /<!-- inject-link\s+href="(.+)"[^>]*>/g,
        '<link href="$1" rel="stylesheet">',
      ),
    )
    .pipe(
      replace(/###FONTAWESOME_LICENSE###/g, function() {
        return fs.readFileSync(
          `${__dirname}/node_modules/@fortawesome/fontawesome-free/LICENSE.txt`,
          'utf8',
        );
      }),
    )
    .pipe(
      replace(/###MERMAID_LICENSE###/g, function() {
        return fs.readFileSync(
          `${__dirname}/node_modules/mermaid/LICENSE`,
          'utf8',
        );
      }),
    )
    .pipe(
      replace(/###BOOTSTRAP_LICENSE###/g, function() {
        return fs.readFileSync(
          `${__dirname}/node_modules/bootstrap/LICENSE`,
          'utf8',
        );
      }),
    )
    .pipe(replace(/\[\s\]/g, '\u2610'))
    .pipe(replace(/\[x\]/g, '\u2611'))
    .pipe(htmlmin(htmlminConf()))
    .pipe(gulp.dest(dest));
});

gulp.task(
  'default',
  gulp.series(gulp.parallel('jsmin', 'cssmin'), 'build', 'copy'),
);
