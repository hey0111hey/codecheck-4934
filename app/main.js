"use strict";


function main(argv) {
  var asahiAPI = require('./asahiAPI.js');
  var data = [];
  var count = 0;
  var maxCount = argv.length;
  var onload = function(){
    console.log(data);
    console.log(data[0]['doc']);
    /*
    var ans =data[0];
    data.forEach(function(v){
      if(ans['count']<=v['count'])ans=v;
    });
    console.log(JSON.stringify(ans));
    */
  };
  var _onload = function(){
    count++;
    if(count>=maxCount)onload();
  };

  argv.forEach(function(v){
    asahiAPI.getAll(
      {'q':{'Body':v,'ReleaseDate':'[ 2016-01-01 TO 2016-11-01]'},'rows':10},
      {'numFound':'','start':'','doc':{'ReleaseDate':''}},
      data,
      _onload);
  });
  
}

module.exports = main;
