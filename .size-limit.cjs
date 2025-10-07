const preset = require('@size-limit/preset-small-lib');

module.exports = [
  ...preset,
  {
    name: 'bundle',
    path: 'dist/index.js',
    limit: '40 KB',
  },
];
