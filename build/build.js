const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['js/script.js'],
  bundle: true,
  minify: true,
  outfile: 'src/index_min.js',
  platform: 'browser',
  target: ['es2017'],
}).catch(() => process.exit(1));
