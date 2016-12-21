"use strict";

var asahiRapper = {};

var parser = require('xml2json');
var request = require('request');
var ackey =  '869388c0968ae503614699f99e09d960f9ad3e12';//default key

var setURL = function(parm){
  var url='http://54.92.123.84/search?ackey='+ackey+'&q=';
  if(typeof parm['q'] === "undefined"){
    console.log('select querry!');
    return ;
  }else{
    for (var field in parm['q']) {
      url += field+':'+encodeURIComponent(parm['q'][field])+' AND ';
    }
    //余分な AND を消す
    url=url.substr(0,url.length-5);
  }
  if(typeof parm['start'] !== "undefined"){
    url += '&start='+parm['start'];
  }
  if(typeof parm['rows'] !== "undefined"){
    url += '&rows='+parm['rows'];
  }
  console.log(url);
}

asahiRapper.hoge= function(){
  console.log(1);
}

asahiRapper.setAckey =function(a){ackey=a;};


asahiRapper.get= function(parm,ans,onload){
  var url = setURL(parm);
  var query = parm['q']['Body'];

  request(url, function (error, response, xml) {
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(parser.toJson(xml));
      var res = json['response'];
      if(res['status']!='OK'){
        console.log('error:' + res['code']);
      }else{
        var count =parseInt(res['result']['numFound']);
        ans.push({'name':query,'count':count});
        onload();
      }
    } else {
      console.log('error: '+ response.statusCode);
    }
  });

};

asahiRapper.getAll = function(parm,ans,onload){
  var data;
  var nLoop;
  var counter=0;

  var _getAsyn = function(){
    var maxCount = data['count'];
    nLoop = (maxCount-1)/100;
    for( var i = 0;i<nLoop;i++ ){
      parm['rows']=(i+1)*100;
      asahiRapper.get(parm,data,_onload);
    }
    if(nLoop==0)onload();
  };

  var _onload = function(){
    counter++;
    if(nLoop<=counter){
      onload();
    }
  };

  asahiRapper.get(parm,data,_getAsyn);
};


module.exports = asahiRapper;
