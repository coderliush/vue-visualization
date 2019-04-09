const path = require('path')
function  resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.resolve.alias
      .set('views', resolve('src/views'))
      .set('utils', resolve('src/utils'))
      .set('styles', resolve('src/styles'))
      .set('components', resolve('src/components'))
      .set('services', resolve('src/services'))
  },

  devServer: {
    proxy: {
      '/dmp': {
        target: 'http://172.16.0.148:30000' 
      }
    }
  }
}
