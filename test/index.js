const assert = require('assert')

const expect = require('expect')
const ws     = require('ws')

const palmTree = require('..')

const config = require('testconfig.json')


const wss = ws.Server()

var probed = false

wss = new WebSocketServer({port: config.port});

wss.on('connection', function connection(ws)
{
  ws.on('message', function incoming(message)
  {
    probed = true
    console.log("Probe landed.")
  })
})


describe('Module', function()
{
  describe('Launch', function ()
  {
    it('should run commands', function ()
    {
      setTimeout(expect(probed).toEqual(true), 5000)
    })
  })
})
