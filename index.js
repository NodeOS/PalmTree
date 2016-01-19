var spawn = require('child_process').spawn;
var fs = require('fs');
fs.readFile('/etc/startup.json', 'utf8', function (err, data) {
    var config;
    if (err) { // doesn't exist
        throw ("No startup.json file. Please create one in /etc/");
        process.exit(1);
    } else {
        config = JSON.parse(data);
    }

    var l = config.commands.length;
    for (var p = 0; p < l; p++) {
        if (!config.commands[p].cmd) {
            throw ("No command specified for #" + (p + 1) + " in /etc/startup.json.");
        } else {
            console.log(tag() + "Executing: " + config.commands[p].cmd + config.commands[p].args.join(" "));
            launch(config.commands[p].cmd, config.commands[p].args); // launch the program
        }
    }

    function launch(cmd, args) {
        var ls = spawn(cmd, args);
        ls.on('exit', code, function () {
            launch(cmd, args); // re-launch silently on exit
        });
    }
});
