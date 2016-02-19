var assert = require('assert');
var expect = require('expect');
var config = require('testconfig.json');
var wss = require('ws').Server();
var probed = false;
wss = new WebSocketServer({
    port: config.port;
});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        probed = true;
        console.log("Probe landed.");
    });
});

describe('Module', function() {
    describe('Launch', function () {
        it('should run commands', function () {
            var palmTree = require('../PalmTree.js');
            setTimeout(expect(probed).toEqual(true), 5000);
        });
    });
});
