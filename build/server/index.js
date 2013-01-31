
var versionString = "0.0.1";

var commander = require("commander");

commander
    .version(versionString)
    .option('-p, --port <n>', 'Port to listen to', parseInt, 8080)
    .parse(process.argv);


//console.log(commander.port + " " + typeof(commander.port));

console.log("Listening to port " + commander.port);

var express = require("express");


var app = express();
app.use(express.limit('1mb'));
app.use(express.static(__dirname + '/public'));

app.listen(commander.port);
