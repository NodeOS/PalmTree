var spawn = require('child_process').spawn


const MIN_UPTIME = process.env.MIN_UPTIME || 2000


function filterCommand(item)
{
  return item.enabled !== false
}

function launch(item)
{
  const command = item.command
  if(!command) throw SyntaxError('No command provided. Please check spelling')

  const name = item.name || command
  const args = item.args || []
  const logError = console.error.bind(console, command + ' ' + args + ':')
  const minUptime = item.minUptime || MIN_UPTIME
  const started = Date.now()

  spawn(command, args, {detached: true, stdio: 'ignore'})
  .on('error', logError).on('exit', function(code, signal)
  {
    // including name or command makes debugging easier
    if (code)
      logError('"' + name + '" exited with code ' + code)

    if (signal)
      logError('"' + name + '" exited with signal ' + signal)

    if (Date.now() - started < minUptime)
      return logError('"' + name + '" ran for less than ' + minUptime + 'ms,'+
                      ' not retrying')

    launch(item)  // re-launch silently on exit
  })
}


function palmTree(config)
{
  config.filter(filterCommand).forEach(launch)
}


module.exports = palmTree
