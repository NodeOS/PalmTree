require('colors');
var spawn = require('child_process').spawn;
var fs = require('fs');
console.log(tag() + "Reading startup file... (/etc/startup.json)")
fs.readFile('/etc/startup.json', 'utf8', function (err, data) {
    var config;
    if (err) { // doesn't exist
        config = {
            commands: []
        };
        
        fs.writeFile("/etc/startup.json", JSON.stringify(config), function(err) {
            if(err) {
                return console.log(err);
            }
            
            console.log(tag + "Saved blank config file.");
        }); 
    } else {
        config = JSON.parse(data);
    }
    
    var l = config.commands.length;
    for(var p = 0; p < l; p++) {
        console.log(tag() + "Executing: " + config.commands[p].cmd + config.commands[p].args.join(" "));
        spawn(config.commands[p].cmd, config.commands[p].args);
    }
    
    console.log(tag() + "All programs launched.");
});

function tag() {
    return "[PalmTree]".red;
}
