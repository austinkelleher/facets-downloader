let args = require('argly')
  .createParser({
    '--help': {
      type: 'string',
      description: 'Show this help message'
    },
    '--directory -d': {
      type: 'string',
      description: 'Directory to download the facets images to. Defaults to present working directory.'
    },
    '--wallpaper -w': {
      type: 'string',
      description: 'Downloads wallpaper facets images'
    }
  })
  .usage('Usage: facets-downloader [options]')
  .example(
    'Standard image download',
    'facets-downloader --directory ~/Pictures/')
  .example(
    'Wallpaper download',
    'facets-downloader --directory ~/Pictures/ --wallpaper')
  .validate(function(result) {
    if (result.help) {
      this.printUsage();
      process.exit(0);
    }
  })
  .onError(function(err) {
    this.printUsage();
    console.error(err);
    process.exit(1);
  })
  .parse();

require('../').download({
  directory: args.directory,
  wallpaper: args.wallpaper
});
