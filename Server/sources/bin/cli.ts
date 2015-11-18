#!/usr/bin/env node
//-----------------------------------
// Copyright(c) 2015 猫王子
//-----------------------------------

import * as program from 'commander';
import { App } from '../app';
import * as fs from 'fs';
import * as logger from 'winston';
import * as child from 'child_process';

program
  .option('-p, --port [number]', 'Server Listening Port', Number.parseInt)
  .option('-k, --password [password]', 'Cipher Password', String)
  .option('-m, --method [algorithm]', 'Cipher Algorithm', String)
  .option('-c, --config <path>', 'Configuration File Path', String)
  .option('-f, --fork', 'Run as background')
  .parse(process.argv);
  
var args = <any>program;

function parseFile(path: string) {
  if (!path) return;
  if (!fs.existsSync(path)) return;
  
  var content = fs.readFileSync(path).toString();
  
  try {
    return JSON.parse(content);
  } catch(ex) {
    logger.warn('Configuration file error');
    logger.warn(ex.message);
  }
}

var fileOptions = parseFile(args.config) || {};

var argsOptions = {
  port: args.port,
  password: args.password,
  cipherAlgorithm: args.method
}

if (args.fork && !process.argv.contains('isFork')) {
  logger.info('Run as daemon');
  process.argv.push('isFork');
  child.fork('./build/bin/cli', process.argv);
  process.exit(0);
}

Object.getOwnPropertyNames(argsOptions).forEach(n => argsOptions[n] = argsOptions[n] || fileOptions[n]);

process.title = 'LightSword Server';


new App(argsOptions);