"use strict";


function main(argv) {
  var asahiAPI = require('./asahiAPI.js');
  var data = [];
  var count = 0;
  var maxCount = argv[0].length;
  var onload = function(){
    console.log(data);
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

  argv[0].forEach(function(v){
    asahiAPI.get({'q':{'Body':v,'ReleaseDate':'['+argv[1]+' TO '+argv[2]+']'},'rows':100},data,_onload);
  });
  
}

module.exports = main;
