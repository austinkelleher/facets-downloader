//Required modules
var fs = require('fs'),
		 cheerio = require('cheerio'),
		 request = require('request');

//Default Variables
var baseURI =  'http://www.facets.la/';
var year = 2013;
var id = 1;
var savePath = process.argv[2];	
var type = process.argv[3];

if(typeof savePath === 'undefined') {
	console.log("Error: Save path not defined.");
	return;
}

//Download Function
var download = function(uri, filename, callback){	
	request({ uri: uri }, function(err, res, body){    
		var $ = cheerio.load(body);
		var imgDiv = $(wDiv).children()['0'];				
		if(typeof imgDiv !== 'undefined') {
		request(imgDiv.attribs.src).pipe(fs.createWriteStream(filename)).on('close', callback);}
		else{
			id++;
			request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		}		
	}); 
};

//Main Function
console.log("Downloading . . .");
function main(){
	if(type == 'w'){
		wdUrl = baseURI + year +'/' + id + '/wallpaper/';
		wDiv  = '#facet-wallpaper';		
		}
	else{
		wdUrl = baseURI + year + '/' + id + '/';
		wDiv  = '#facet-image';
		}
}

// Loop function to create a recursive effect
(function loop(){
	main();
	download(wdUrl, savePath+id+'.jpg', 
	function(){
		console.log(((id/365)*100).toFixed(2)+'% completed');
		if(id == 330) 
			year = "2014";
		if(id < 365){
			id=id+1;
			loop();
		}
		});
})(1)
