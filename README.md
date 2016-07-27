facets-downloader
=========

facets-downloader is a simple Node.js script that will download all [facets.la]('http://facets.la/') images to a specified directory on your local machine.

## Installation

```bash
npm install -g facets-downloader --save
```

## Running

Download all the facets in `800x800` resolution

```bash
facets-downloader --directory ~/Pictures/
```

Download all the facets in `2560x1440` resolution

```bash
facets-downloader --directory ~/Pictures/ --wallpaper
```
