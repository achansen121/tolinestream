
var path, fs, crypto;

var range, cb_err_chain, nonprint;

var clear_dir, mk_dir, mk_files, mk_file;

"use strict";

range        = require("range");
cb_err_chain = require("cb_err_chain");
path         = require("path");
fs           = require("fs");
crypto       = require("crypto");

nonprint     = require("./nonprint.js");

where = path.join(__dirname,"testfiles");

clear_dir=function(cb){
  var check_ex, list_all, delete_all, rmdir;
  check_ex=function(){
    fs.exists(where,list_all);
  };
  list_all=function(exists){
    if(!exists)
      return cb();
    fs.readdir(where,delete_all);
  };
  delete_all=function(err,files){
    var n, done, ucb;
    n=files.length;
    done=0;
    ucb=function(s_err){
      if(s_err)
        throw s_err;
      done++;
      if(done===n)
        rmdir();
    };
    if(n===done)
      return rmdir();
    if(err)
      throw err;
    files.map(function(file){
      return path.join(where,file);
    })
    .forEach(function(file){
      fs.unlink(file,ucb);
    });
  };
  rmdir=function(){
    fs.rmdir(where,cb);
  };
  check_ex();
};
mk_dir=function(cb){
  fs.mkdir(where,cb);
};
mk_files=function(cb){
  var n, done;
  n=100;
  done=0;
  range(n)
  .forEach(function(){
    crypto.randomBytes(12,function(ex,data){
      var npath;
      if(ex)throw ex;
      npath = path.join(where,data.toString("hex"));
      mk_file(npath,function(err){
        if(err)
          throw err;
        done++;
        if(done==n)
          cb();
      });
    });
  });
};
mk_file=function(path,cb){
  var rs, n, done;
  rs=fs.createWriteStream(path);
  
  n=20;
  done=0;
  range(n)
  .forEach(function(){
    crypto.randomBytes(256,function(ex,data){
      if(ex)throw ex;
      done++;
      data=data.toString("utf8");

      data=data.replace(nonprint(),"\n");
      
      rs.write(data+"\n");
      if(done==n){
        rs.end();
        cb();
      }
    });
  });
};

if(require.main==module){
  cb_err_chain([clear_dir,mk_dir,mk_files]);
}

module.exports=function(cb){
  if(!cb)throw new Error("need cb");
  cb_err_chain([clear_dir,mk_dir,mk_files,cb]);
};
