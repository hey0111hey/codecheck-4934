"use strict";

var asahiRapper = {};

var parser = require('xml2json');
var request = require('request');
var ackey =  '869388c0968ae503614699f99e09d960f9ad3e12';//default key

asahiRapper.setAckey =function(a){ackey=a;};

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
  return url;
}



//
// responseの構造
// { "numFound":検索Hit数,
//   "start"   :検索インデックス,
//   "doc":[
//     { "Id":記事の固有ID,
//       "PageName": 分類,
//       "Title":記事のタイトル,
//       "Body":記事の内容,
//       "Category":カテゴリ,
//       "SubCategory":サブカテゴリ,
//       "Keyword":キーワード,
//       "PublicationKind",??,
//       "ReleaseDate":発行日,
//       "WordCount":文字数,
//       "Page":ページ数
//     },...]
//   ]
asahiRapper.get= function(parm,type,ans,onload){
  var url = setURL(parm);
  var query = parm['q']['Body'];
  console.log(url);

  request(url, function (error, response, xml) {
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(parser.toJson(xml));
      var res = json['response'];
      if(res['status']!='OK'){
        console.log('error:' + res['code']);
        console.log(res['errstr']);
      }else{
        var data={};
        for(var field in type){
          if(field=='doc'){
            data['doc']=[];
            res['result']['doc'].forEach(function(v){
              var tmp ={};
              for(var parms in type[field]){
                if(typeof v[parms] !== "undefined"){
                  tmp[parms]=v[parms];
                }
              }
              data['doc'].push(tmp);
            });
          }else if(typeof res['result'][field] !=="undefined"){
            data[field]=res['result'][field];
          }
        }
        ans.push(data);
        onload();
      }
    } else {
      console.log('error: '+ response.statusCode);
    }
  });

};

asahiRapper.getAll = function(parm,type,ans,onload){
  var data=[];
  var nLoop;
  var counter=0;

  var _getAsyn = function(){
    var maxCount = data[0]['numFound'];
    nLoop = Math.floor((maxCount-1)/100);
    console.log('_getAsyn is called:maxCount '+maxCount+' nLoop '+nLoop);
    for( var i = 0;i<nLoop;i++ ){
      parm['start']=(i+1)*100;
      asahiRapper.get(parm,type,data,_onload);
    }
    if(nLoop==0)onload();
  };

  var _onload = function(){
    console.log('_onload is called');
    counter++;
    if(nLoop<=counter){
      console.log(data);
      onload();
    }
  };

  asahiRapper.get(parm,type,data,_getAsyn);
};


module.exports = asahiRapper;
