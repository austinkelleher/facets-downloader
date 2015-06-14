facets-downloader
=========

##About

facets-downloader is a simple Node.js script that will download all [facets.la]('http://facets.la/') images to a specified folder on your local machine. You can specify command line arguments for the local save path you desire as well as standard or high resolution. See the instructions below for additional information.

##Prerequisites

###1. Download Node.js

> https://nodejs.org/download/

###2. Install the project dependencies

```bash
cd /path/to/facets-downloader
npm install
```
##Running

[Downloads all the facets in 800x800 resolution]

```bash
cd /path/to/facets-downloader
node facets-downloader.js LOCAL_SAVE_PATH_HERE
```

[Downloads all the facets in 2560x1440 resolution]

```bash
cd /path/to/facets-downloader
node facets-downloader.js LOCAL_SAVE_PATH_HERE wallpaper
```
