var mongoose = require("mongoose");
var sys = require('sys');
var os = require('os');
var spawn = require('child_process').spawn;
fs = require('fs');
var ip = require('ip');

mongoose.connect('mongodb://<SERVER IP>/mydb')
var dataSchema = {
  code:String,
  ip :String,
  review:String,
  host:String,
  google:String,
  date:Date,
  gmail:String
}
var Data = mongoose.model('Data', dataSchema, 'internetdata')

function readData() {
  var child = spawn("phantomjs", ["captureLoadTime.js"])

  // Listen for an exit event:
  child.on('exit', function (exitCode) {
      console.log("Child exited with code: " + exitCode);
      loadData();
  });

  // Listen for any errors:
  child.stderr.on('data', function (data) {
      console.log('There was an error: ' + data);
  });
  }

function loadData() {
  console.log(os.EOL);
  var lines = null, eol = os.type() == 'windows' ? "\r\n" : "\n";

  fs.readFile('Result.txt', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    
    lines = data.split(eol);
    for(var i  = 0; i < lines.length - 1; i++) {
      data = lines[i].split(",");
      addDataToDB(data);
    }

    fs.unlinkSync('Result.txt');

    setTimeout(readData(),600000);
  });
}

function addDataToDB(data) {
  var dataToInsert = new Data({
    code: data[2],
    ip: ip.address(),
    review: data[3],
    host: (os.hostname().split(","))[0],
    google: data[1],
    date: Date.now(),
    gmail: data[0]
  });

  dataToInsert.save(function (err, data) {
    if (err) console.log(err);
    else console.log('Saved : ', data );
  });
}

readData();
