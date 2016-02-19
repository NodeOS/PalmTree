#!/usr/bin/env node
var spawn = require('child_process').spawn;
var PalmTree = function() {
    var name = require('./package.json').name;
    var MIN_UPTIME = process.env.UPT || 2000;
    var launch = function(item) {
        var command = item.command;
        if(!command) {
            logError('No command provided. Please check spelling.');
            return;
        }
        
        var name = item.name || command;
        var args = item.args || [];
        var logError = console.error.bind(console, command + ' ' + args + ':');
        var minUptime = item.minUptime || MIN_UPTIME;
        var started = Date.now();
        spawn(command, args, {
            detached: true,
            stdio: 'ignore'
        }).on('error', logError).on('exit', function (code, signal) {
            // including name or command makes debugging easier
            if (code) {
                logError('"' + name + '" exited with code ' + code + '.');
            }
        
            if (signal) {
                logError('"' + name + '" exited with signal ' + signal + '.');
            }
      
            if (Date.now() - started < minUptime) {
                return logError('"' + name + '" ran for less than ' + minUptime + 'ms. Not retrying.');
            }

            launch(item); // re-launch silently on exit
        }).unref();
    };
    
    require('/etc/' + name + '.json').filter(function(item) {
        return item.enabled !== false;
    }).forEach(launch);
};

module.exports = new PalmTree();