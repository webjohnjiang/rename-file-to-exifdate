#!/usr/bin/env node
const logic = require('../app.js');
const { program } = require('commander')
const path = require('path')

program
.argument('<dirname>', 'pass the directory path')

program.parse()

const baseDir = path.resolve(process.cwd(), program.args[0]) 

console.log('待处理目录：', baseDir)

logic.renameOneDir(baseDir)