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
var downloadType = process.argv[3];

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

		id++;

		if(typeof requestImgDiv !== 'undefined') {
			request(requestImgDiv.attribs.src).pipe(fs.createWriteStream(savePath)).on('close', callback);
		} else {
			callback();
		}
	});
};

console.log("Downloading . . .");

/**
* Sets the variabless needed for the download process to begin, and executes
* the download process
*/
function initDownloadFacet() {
	var imgUri = BASE_URI + year + '/' + id + '/';
	var imgDiv;

	if(downloadType === 'wallpaper') {
		imgUri += '/wallpaper/';
		imgDiv  = '#facet-wallpaper';
	} else {
		imgDiv  = '#facet-image';
	}

	download({
		uri: imgUri,
		savePath: savePath+id+'.jpg',
		imgDiv: imgDiv
	}, function() {
		console.log(((id/365)*100).toFixed(2)+'% completed');

		//Id 330 is when the facets.la images turn from 2013 to 2014 in the url
		if(id === 330) {
			year = "2014";
		}

		if(id < 365){
			initDownloadFacet();
		}
	});
}

initDownloadFacet();
