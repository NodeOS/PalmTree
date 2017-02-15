const createWriteStream = require('fs').createWriteStream
const dirname           = require('path').dirname
const spawn             = require('child_process').spawn

const isDocker = require('is-docker')
const mkdirp   = require('mkdirp').sync


const DEFAULT_STDIO = isDocker() ? 'inherit' : 'ignore'
const MIN_UPTIME = process.env.MIN_UPTIME || 2000


function filterCommand(item)
{
  return item.enabled !== false
}

function getStdio(stdio)
{
  var stdout = stdio.stdout
  var stderr = stdio.stderr

  if(stdout)
  {
    mkdirp(dirname(stdout))
    stdout = createWriteStream(stdout, {flags: 'a'})
  }

  if(stderr)
  {
    mkdirp(dirname(stderr))
    stderr = createWriteStream(stderr, {flags: 'a'})
  }

  return [
    DEFAULT_STDIO,
    stdout || DEFAULT_STDIO,
    stderr || stdout || DEFAULT_STDIO
  ]
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

  spawn(command, args, {detached: true, stdio: getStdio(item.stdio || {})})
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
