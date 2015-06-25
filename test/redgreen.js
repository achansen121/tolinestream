
var conv , fs , even, color, tolines;

color=require('colors');
fs = require("fs");
tolines = require("../index.js");

even=1;
conv=new tolines();

fs.createReadStream(__filename)
.pipe(tolines())
.on("data",function(data){
  var c;
  c = even ? "green" : "red";
  process.stdout.write((data+"\n")[c]);
  even=!even;
});
