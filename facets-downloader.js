//Required modules
var fs = require('fs'),
	cheerio = require('cheerio'),
	request = require('request');

var BASE_URI =  'http://www.facets.la/';
var year = 2013;
var id = 1;

/**
* Local save path on your machine
*/
var savePath = process.argv[2];
/**
* Default is a standard sized facets.la image. If you specific the 'wallpaper'
* command line argument, it will download all facets.la wallpaper images
*/
var type = process.argv[3];

if(!savePath) {
	return console.log("Error: Save path not defined.");
}

/**
* Downloads a specific facets image based on:
* @var uri The facets.la uri provided
* @var savePath Local save path on your machine
* @var callback
*/
var download = function(options, callback) {
	var uri = options.uri;
	var savePath = options.savePath;
	var imgDiv = options.imgDiv;

	request({ uri: uri }, function(err, res, body) {
		var $ = cheerio.load(body);
		var requestImgDiv = $(imgDiv).children()['0'];
		if(typeof requestImgDiv !== 'undefined') {
			request(requestImgDiv.attribs.src).pipe(fs.createWriteStream(savePath)).on('close', callback);
		}
		id++;
	});
};

console.log("Downloading . . .");

/**
* @return object with info regarding the download
*/
function getDownloadInfo() {
	var imgUrl = BASE_URI + year + '/' + id + '/';
	var imgDiv;

	if(type === 'wallpaper') {
		imgUrl += '/wallpaper/';
		imgDiv  = '#facet-wallpaper';
	} else {
		imgDiv  = '#facet-image';
	}

	return {
		imgDiv: imgDiv,
		imgUrl: imgUrl
	};
}

// Loop function to create a recursive effect
(function loop(){
	var downloadInfo = getDownloadInfo();

	download({
		uri: downloadInfo.imgUrl,
		savePath: savePath+id+'.jpg',
		imgDiv: downloadInfo.imgDiv
	}, function(){
		console.log(((id/365)*100).toFixed(2)+'% completed');
		if(id === 330) {
			year = "2014";
		}

		if(id < 365){
			loop();
		}
	});
})(1);
