'use strict';

const fs = require('fs');
const cheerio = require('cheerio');
const http = require('http');

const BASE_URL = 'http://www.facets.la/';
const REQUEST_TIMEOUT = 5000;

function request(url) {
  return new Promise((resolve, reject) => {
    let req = http.get(url, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => resolve(body));
    });

    req.on('error', (err) => reject(err));

    req.on('socket', (socket) => {
      socket.setTimeout(REQUEST_TIMEOUT);
      socket.on('timeout', () => {
        req.abort();
        reject('Facet download request timed out');
      });
    });
  });
}

function writeFile(uri, path) {
  return new Promise((resolve, reject) => {
    let file = fs.createWriteStream(path);

    let req = http.get(uri, (response) => {
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    });

    req.on('error', (err) => {
      fs.unlink(path);
      reject(err);
    });
  });
}

function parse(html, divId) {
  let $ = cheerio.load(html);
  let div = $(divId).children()['0'];
  let src;

  if (div && ((src = div.attribs.src) && src.indexOf('jpg') !== -1)) {
    return src;
  }
}

let download = (options) => {
  let id = options.id || 1;
  let year = options.year || 2013;
  let wallpaper = options.wallpaper;
  let directory = options.directory || __dirname;

  let url = BASE_URL + year + '/' + id + '/';
  let divId;
  let savePath;

  if (wallpaper) {
    url += 'wallpaper/';
    divId = '#facet-wallpaper';
    savePath = directory + 'facet-' + id + '-wallpaper' + '.jpg';
  } else {
    divId = '#facet-image';
    savePath = directory + 'facet-' + id + '.jpg';
  }

  return request(url)
    .then(html => parse(html, divId))
    .then(src => {
      if (src) {
        return writeFile(src, savePath)
          .then(next(id, year, directory, wallpaper));
      } else {
        return next(id, year, directory, wallpaper);
      }
    })
    .catch(err => {
      console.log(`Could not download image with URL ${url}`, err);
      return next(id, year, directory, wallpaper);
    });
};

function next(id, year, directory, wallpaper) {
  if (id === 330) year = '2014';
  if (id < 365) {
    if (id === 1 || id % 20 === 0) {
      let percentCompleted = ((id/365) * 100).toFixed(1);
      console.log(`${percentCompleted}% completed`);
    }

    return download({
      directory: directory,
      wallpaper: wallpaper,
      year: year,
      id: ++id
    });
  } else {
    console.log('100% complete!');
  }
}

module.exports = {download};
