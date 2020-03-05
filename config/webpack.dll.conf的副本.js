// build/webpack.dll.conf.js

const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    // 把这些资源打包成dll，提高编译速度
    vue: ['vue','vue-router', 'vuex'],
    ui: ['vant'],
    others: ['axios','vue-clipboard2','jquery', 'fastclick', 'vue-lazyload', 'vue-navigation', 'vue-wechat-title', 'babel-polyfill', 'vue-qr', 'crypto', 'weixin-js-sdk', 'js-cookie']
  },
  output: {
    path: path.resolve(__dirname, "../dist/static/js"),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    ...Object.keys(['vue','ui','others']).map(name => {
      return new webpack.DllReferencePlugin({
        context: '.',
        manifest: require(`../static/${name}.manifest.json`),
      })
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console:true,
        drop_debugger:true
      },
      output:{
        // 去掉注释内容
        comments: false,
      },
      sourceMap: true
    })
  ]
}
