#!/usr/bin/env node
//-----------------------------------
// Copyright(c) 2015 猫王子
//-----------------------------------


import * as program from 'commander';
import { App } from '../app'
import * as fs from 'fs';
import * as logger from 'winston';

'use strict'

// Same with Shadowsocks https://shadowsocks.com/doc.html
program
  .usage('[options]')
  .option('-s, --server <addr|domain>', 'Server Address', String)
  .option('-p, --port <number>', 'Server Port Number', Number.parseInt)
  .option('-l, --localport <number>', 'Local Port Number', Number.parseInt)
  .option('-m, --method <algorithm>', 'Cipher Algorithm', String)
  .option('-k, --password <password>', 'Password', String)
  .option('-c, --config <path>', 'Configuration File Path', String)
  .option('-a, --any', 'Listen Any Connection')
  .option('-t, --timeout [number]', 'Timeout (second)')
  .option('-f, --fork', 'Run as Cluster')
  .option('-u, --socsk5username [name]', 'Socks5 Proxy Username', String)
  .option('-w, --socks5password [password]', 'Socks5 Proxy Password', String)
  .option('-i, --plugin [name]', 'Plugin Name', String)
  .parse(process.argv);
  
let args = <any>program;

function parseFile(path: string) {
  if (!path) return;
  if (!fs.existsSync(path)) return;
  
  let content = fs.readFileSync(path).toString();
  
  try {
    return JSON.parse(content);
  } catch(ex) {
    logger.warn('Configuration file error');
    logger.warn(ex.message);
  }
}

let fileOptions = parseFile(args.config) || {};
  
let argsOptions = {
  addr: args.any ? '0.0.0.0' : 'localhost',
  port: args.localport,
  serverAddr: args.server,
  serverPort: args.port,
  cipherAlgorithm: args.method,
  password: args.password,
  socks5Username: args.socks5username,
  socks5Password: args.socks5password,
  timeout: args.timeout,
  plugin: args.plugin
}

Object.getOwnPropertyNames(argsOptions).forEach(n => argsOptions[n] = argsOptions[n] || fileOptions[n]);

process.title = 'LightSword Client';

new App(argsOptions);
