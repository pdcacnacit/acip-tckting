'use strict'

var gulp = require('gulp')
var lint = require('gulp-eslint')
var tslint = require('gulp-tslint')
var tsl = require("tslint")
var babel = require('gulp-babel')
var clean = require('gulp-clean')
var shell = require('gulp-shell')
var gulpIgnore = require('gulp-ignore')
var fs = require('fs')
var spawn = require('child_process').spawn
var node

var config = {
  devBaseUrl: 'http://localhost',
  paths: {
    script: {
      server: './server/**/*.js',
      common: './common/**/*.js',
      clientTS: './client/src/**/*.ts',
      clientJS: './client/src/**/*.js'
    },
    directories: {
      server: './server/**/*.*',
      common: './common/**/*.*',
      client: './client/src/**/*.*'
    },
    dist: {
      root: './dist',
      server: './dist/server',
      common: './dist/common',
      client: './dist/client'
    }
  }
}

// Lint JS code
gulp.task('lint:js', function () {
  gulp.src([config.paths.script.server, config.paths.script.common, config.paths.script.clientJS])
  .pipe(lint({configFile: '.eslintrc'}))
  .pipe(lint.formatEach())
  .pipe(lint.result(result => {
    // Called for each ESLint result.
    console.log(`ESLint result: ${result.filePath}`)
    console.log(`# Messages: ${result.messages.length}`)
    console.log(`# Warnings: ${result.warningCount}`)
    console.log(`# Errors: ${result.errorCount}`)
  }))
})

// Lint TS code
gulp.task('lint:ts', function () {
  // Really roundabout way to write "extends tslint:recommended" since it is not an option!
  var recommendedConfig = require('./node_modules/tslint/lib/configs/recommended.js')
  var specifiedRules = require('./client/tslint.json')
  var combinedRules = Object.assign({}, recommendedConfig.rules, specifiedRules.rules)

  gulp.src([config.paths.script.clientTS])
    .pipe(gulpIgnore('*.d.ts'))
    .pipe(gulpIgnore('*.spec.ts'))
    .pipe(tslint({
      formatter: 'prose',
      configuration: {rules: combinedRules},
      rulesDirectory: ['node_modules/codelyzer', 'node_modules/tslint']
    }))
    .pipe(tslint.report({
      emitError: false
    }))
})

// Lint both TS and JS
gulp.task('lint:all', function () {
  console.log('***********************************************************************************')
  console.log('Linting is temporarily disabled. If you need to lint, execute "gulp lint:all-force"')
  console.log('Linting will be included once a common ruleset is decided')
  console.log('***********************************************************************************')
})

// Temporary force all linting
gulp.task('lint:all-force', ['lint:js', 'lint:ts'])

// Build only server components
gulp.task('build:server', ['lint:all', 'clean:server', 'move:server'], () => {
  return gulp.src([config.paths.script.server])
    .pipe(babel({
      presets: ['latest'],
      plugins: ['transform-async-to-generator']
    }))
    .pipe(gulp.dest(config.paths.dist.server))
})

// Build common components (server side)
gulp.task('build:common', ['lint:all', 'clean:server', 'move:server'], () => {
  return gulp.src([config.paths.script.common])
    .pipe(babel({
      presets: ['latest'],
      plugins: ['transform-async-to-generator']
    }))
    .pipe(gulp.dest(config.paths.dist.common))
})

// Build only the client components
gulp.task('build:client', ['lint:all', 'clean:client'], shell.task([
  '(cd ./client && ng build)'
]))

// Build all components
gulp.task('build:all', ['build:server', 'build:common', 'build:client'])

// Clean entire dist directory
gulp.task('clean:all', function () {
  return gulp.src(['./dist/'], {read: false})
        .pipe(clean())
})

// Clean only client code in dist
gulp.task('clean:client', function () {
  return gulp.src(['./dist/client'], {read: false})
    .pipe(clean())
})

// Clean only server code in dist
gulp.task('clean:server', function () {
  return gulp.src(['./dist/common', './dist/server'], {read: false})
    .pipe(clean())
})

// Move the server code that does not transpile into dist
gulp.task('move:server', ['clean:server'], function () {
  return gulp.src([config.paths.directories.server, config.paths.directories.common], {base: '.'})
    .pipe(gulp.dest(config.paths.dist.root))
})

// Development mode, and build both client and server on changes
gulp.task('develop', ['build:all', 'start'], function () {
  console.log('ENTERING DEVELOPMENT MODE. APP WILL REBUILD ON CHANGES')
  gulp.watch(config.paths.directories.server, ['build:all', 'start'])
  gulp.watch(config.paths.directories.common, ['build:all', 'start'])
  gulp.watch(config.paths.directories.client, ['build:all', 'start'])
})

// Development mode, and build only server on changes
gulp.task('develop:server', ['build:common', 'build:server', 'start:server'], function () {
  console.log('ENTERING DEVELOPMENT MODE. APP WILL REBUILD ON CHANGES')
  gulp.watch(config.paths.directories.server, ['build:common', 'build:server', 'start:server'])
  gulp.watch(config.paths.directories.common, ['build:common', 'build:server', 'start:server'])
})

// Development mode, and build only client on changes
gulp.task('develop:client', ['build:client', 'start:client'], function () {
  console.log('ENTERING DEVELOPMENT MODE. APP WILL REBUILD ON CHANGES')
  gulp.watch(config.paths.directories.client, ['build:client', 'start:client'])
})

// Start the server and build server and client code
gulp.task('start', ['build:all'], function () {
  console.log('starting server')
  if (node) node.kill()
  node = spawn('node', ['./dist/server/server.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...')
    }
  })
})

// Start the server and build only server code
gulp.task('start:server', ['build:common', 'build:server'], function () {
  console.log('starting server at ' + new Date())
  if (node) node.kill()
  node = spawn('node', ['./dist/server/server.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...')
    }
  })
})

// Start the server and build only client code
gulp.task('start:client', ['build:client'], function () {
  console.log('starting server at ' + new Date())
  if (node) node.kill()
  node = spawn('node', ['./dist/server/server.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...')
    }
  })
})

// Install all dependencies
gulp.task('install', shell.task([
  'npm install',
  '(cd ./client && npm install)'
]))

gulp.task('default', ['develop'])
gulp.task('build', ['lint:all', 'clean:all', 'move:server', 'build:all'])
gulp.task('publish', ['build'])
