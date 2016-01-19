var spawn = require('child_process').spawn;
var fs = require('fs');
fs.readFile('/etc/startup.json', 'utf8', function (err, data) {
    var config;
    if (err) { // doesn't exist
        config = {
            commands: []
        };

        fs.writeFile("/etc/startup.json", JSON.stringify(config), function (err) {
            if (err) {
                return console.log(err);
            }
        });
    } else {
        config = JSON.parse(data);
    }

    var l = config.commands.length;
    for (var p = 0; p < l; p++) {
        console.log(tag() + "Executing: " + config.commands[p].cmd + config.commands[p].args.join(" "));
        launch(config.commands[p].cmd, config.commands[p].args); // launch the program
    }
});

function launch(cmd, args) {
    var ls = spawn(cmd, args);
    ls.on('exit', (code) {
        launch(cmd, args); // re-launch silently on exit
    });
}
