#!/usr/bin/env node

"use strict";

var through, tolines;

through=require("through");

tolines=function(optional_s){
  var buff, onwrite, onend;

  buff="";
  
  onwrite=function(data){
    var n, m, lines, rest, me, lasti;
    
    buff+=data;
    me=this;
    
    lines=buff.split("\n");
    lasti=lines.length-1;
    
    lines.forEach(function(line, i){
      if(i==lasti){
        buff=line;
        return;
      }
      if(line.substr(line.length-1)=="\r")
        line=line.substr(0,line.length-1);
      me.queue(line);
    });
    
  };
  onend=function(){
    var lines, me;
    if(buff.length){
      this.emit('data',buff);
    }
    this.emit("end");
  };
  return through.call(this,onwrite,onend);
};


module.exports=tolines;
