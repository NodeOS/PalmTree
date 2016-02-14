#!/usr/bin/env node

var spawn = require('child_process').spawn

var name = require('./package.json').name


const MIN_UPTIME = 2000


function launch(item)
{
  var command = item.command
  var args    = item.args || []

  var logError = console.error.bind(console, command+' '+args+':')

  var minUptime = item.minUptime || MIN_UPTIME
  var started   = Date.now()

  spawn(command, args, {detached: true, stdio: 'ignore'})
  .on('error', logError)
  .on('exit', function(code, signal)
  {
    if(code)   logError('exited with code '  +code)
    if(signal) logError('exited with signal '+signal)

    if(Date.now() - started < minUptime)
      return logError('runned for less than '+minUptime+'ms, not retrying')

    launch(item)  // re-launch silently on exit
  })
  .unref()
}


require('/etc/'+name+'.json')
.filter(function(item)
{
  return item.enabled !== false
})
.forEach(launch)
