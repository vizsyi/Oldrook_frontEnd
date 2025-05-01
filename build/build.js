const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/dev/script.js'],
  bundle: true,
  minify: true,
  outfile: 'src/script.js',
  platform: 'browser',
  target: ['es2017'],
}).catch(() => process.exit(1));
