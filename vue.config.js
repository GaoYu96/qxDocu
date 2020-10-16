"use strict"
const path = require('path');

var version     = ''; // 版本号
var versionPath = ''; // 版本号路径
var distPath    = path.resolve('./dist');


// 创建版本号(年月日时分)
(function () {
  var d = new Date();
  var yy = d.getFullYear().toString().slice(2);
  var MM = d.getMonth() + 1 >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
  var DD = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
  var h  = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours();
  var mm = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes();
  version = yy + MM + DD + h + mm;
  versionPath = distPath + '/' + version;
})();

var assetsSubDirectory = version+'/static'

console.log(distPath, version+'/static');

module.exports = {
  outputDir: distPath, //输出文件目录
  assetsDir: version+'/static',  //静态文件目录
  filenameHashing: false, //文件名哈希
  // pages: {
  //   index: {
  //     entry: path.resolve(__dirname, '../view-support/main.js'),
  //     // 模板来源
  //     template: path.resolve(__dirname, '../view-support/public/index.html'),
  //   }
  // },
  configureWebpack:{
    resolve: {
      // alias: {
      //   '~@src': path.resolve(__dirname, './src'),
      //   '@c': path.resolve(__dirname, './src/components'),
      //   '~@view': path.resolve(__dirname, '../view-support/views'),
      //   '~@project': path.resolve(__dirname, '../view-support'),
      // }
    }
  },
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  css: {
    // extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps?
    // loaderOptions: {
    //   css: {}, // 这里的选项会传递给 css-loader
    //   postcss: {} // 这里的选项会传递给 postcss-loader
    // }, // css预设器配置项 详见https://cli.vuejs.org/zh/config/#css-loaderoptions
    // modules: false // 启用 CSS modules for all css / pre-processor files.
  },
  devServer:{
    proxy:{
      '/proxyApi':{
        // target: 'http://192.168.0.44:8883',                   http://192.168.3.114:8883/
        target: 'http://192.168.0.68:8883',
        // target:'http://192.168.3.114:8883',
        pathRewrite: {
          "^/proxyApi": ""
        }
      }
    }
  }
}