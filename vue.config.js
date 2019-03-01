const path = require('path')
function  resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.resolve.alias
      .set('views', resolve('src/views'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'))
  },

  devServer: {
    // proxy: {
    //   '/api': {
    //     // target: 'http://172.16.0.148:20003'         // 测试
    //   }
    // }
  }
}
