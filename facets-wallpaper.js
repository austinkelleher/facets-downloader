var fs = require('fs'),
    request = require('request'),
	async = require("async");

var baseURI =  'http://www.facets.la/wallpaper/W_';
var year = 2013;
var id = 1;
var savePath = process.argv[2];
	
var download = function(uri, savePath, callback){
	if(id == 330) 
		year = "2014";
  request.head(uri, function(err, res, body){
	console.log('Downloading '+id);
    //console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
	if(typeof res.headers['content-length'] !== "undefined"){
    request(uri).pipe(fs.createWriteStream(savePath)).on('close', callback);
	if(id++ <= 365){
		download(baseURI+year+'_'+id+'.jpg', savePath+id+'.jpg', function(){
		//console.log('done');
		});}
	}
	else{
		if(id++ <= 365){
		download(baseURI+year+'_'+id+'.jpg', savePath+id+'.jpg', function(){
		//console.log('done');
		});}
		}
  });
};

download(baseURI+year+'_'+id+'.jpg', savePath+id+'.jpg', function(){
  console.log('done');
});
