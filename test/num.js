
var fs, path, colors;
var tolines, gentest, cb_err_chain, gensup;

var listf, where;

colors=require("colors");
fs = require("fs");
path = require("path");

tolines = require("../index.js");
gentest = require("./gentestfiles.js");
cb_err_chain = require("cb_err_chain");

where = path.join(__dirname,"testfiles");

gensup=function(cb){
  gentest(function(){
    cb();
  });
};

listall=function(cb){
  fs.readdir(where,function(err,list){
    listf=list;
    cb(err,list);
  });
};

readall=function(cb){
  var done, n;
  done=0, n=listf.length;
  if(done===n)
    return cb();
  listf.map(function(fn){
    return path.join(where,fn);
  })
  .forEach(function(fp){
    readone(fp,function(){
      done++;
      if(done===n)
        return cb();
    });
  });
};
readone=function(fn,cb){
  var orign, newn, donelines, donerf, ifdone, le, fr, readevts;
  newn=0;
  readevts=0;
  orign=0;
  
  ifdone=function(){
    if(donerf&&donelines){
      if(newn!=orign)
        console.log((fn+" line num mismatch "+newn+","+orign).red.bold);
    }
  };
  
  fr=fs.createReadStream(fn,{encoding:"utf8"});
  le=tolines();
  le.on("data",function(data){
    newn++;
    if(data.toString().indexOf("\n")>=0)
      throw new Error("should not be line here");
  });
  fr.on("data",function(data){
    orign+=data.toString().split("\n").length-1;
  });
  le.on("end",function(){
    donelines=true;
    ifdone();
  });
  fr.pipe(le);
};


if(require.main==module)
  cb_err_chain([gensup,listall,readall]);
