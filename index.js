var spawn = require('child_process').spawn;
var config = require('/etc/startup.json');
for (var p in config.commands) {
    launch(config.commands[p].cmd, config.commands[p].args); // launch the program
}

function launch(cmd, args) {
    var ls = spawn(cmd, args, {
        stdio: 'ignore'
    });

    ls.on('exit', code, function () {
        launch(cmd, args, {
            stdio: 'ignore'
        }); // re-launch silently on exit
    });
}
