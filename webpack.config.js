const path = require('path');

module.exports = {
  target: 'web',
  entry: './public/index.js',
  output: {
    filename: 'bundle.js',
    path: `${__dirname + '/public'}/dist`,  
  }
}