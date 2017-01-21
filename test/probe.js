const WebSocket = require('ws')

const config = require('testconfig.json')


var ws = new WebSocket('ws://127.0.0.1:' + config.port)
ws.on('open', function open()
{
  ws.send('.')
  process.exit(9)
  // triger code error
  // hopefully fast enough to not relaunch
})
