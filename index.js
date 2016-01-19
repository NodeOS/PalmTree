var spawn = require('child_process').spawn;
var fs = require('fs');
var config = require('/etc/startup.json');
var length = config.commands.length;
for (var p = 0; p < length; p++) {
    if (!config.commands[p].cmd) {
        throw ("No command specified for #" + (p + 1) + " in /etc/startup.json.");
    } else {
        launch(config.commands[p].cmd, config.commands[p].args); // launch the program
    }
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
