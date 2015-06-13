var cheerio = require('cheerio'),
	request = require('request'),
	fs = require('fs');

var savePath = process.argv[2];

if(typeof savePath === 'undefined') {
	console.log("Error: Save path not defined.");
	return;
}

var year = "2013";
var baseUri = 'http://www.facets.la/';

(function getImg(id) {
	var uri = baseUri + year + '/' + id + '/wallpaper/';

	request({ uri: uri }, function(error, response, body) {
		var $ = cheerio.load(body);
		var imgDiv = $('#facet-wallpaper').children()['0'];

		if(typeof imgDiv !== 'undefined') {
			request(imgDiv.attribs.src).pipe(fs.createWriteStream(savePath + id + '.jpg'));
		}
	});

	if(id == 330) 
		year = "2014";
	if(id <= 365)
		getImg(id+1);
})(1);
