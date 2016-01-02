//-----------------------------------
// Copyright(c) 2015 猫王子
//-----------------------------------
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var os = require('os');
var cluster = require('cluster');
var app_1 = require('./app');
function runAsClusterMode(users, management, callback) {
    if (cluster.isMaster) {
        os.cpus().forEach(() => {
            cluster.fork();
        });
        cluster.on('exit', () => cluster.fork());
        return callback();
    }
    users.forEach(o => new app_1.App(o));
    if (management)
        require('./management/index');
}
exports.runAsClusterMode = runAsClusterMode;