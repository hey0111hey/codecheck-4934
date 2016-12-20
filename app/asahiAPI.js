"use strict";

var asahiRapper = {};

var parser = require('xml2json');
var request = require('request');
var ackey =  '869388c0968ae503614699f99e09d960f9ad3e12';//default key


asahiRapper.hoge= function(){
  console.log(1);
}

asahiRapper.setAckey =function(a){ackey=a;};

asahiRapper.get= function(parm,ans,onload){

  var url='http://54.92.123.84/search?ackey='+ackey+'&q=';
  if(typeof parm['q'] === "undefined"){
    console.log('クエリの指定は必須です。');
    return ;
  }else{
    var query = parm['q']['Body'];
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


module.exports = asahiRapper;
