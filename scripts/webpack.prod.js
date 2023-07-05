const path = require('path');
// 在打包之前删除当前构建记录
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// 识别某些webpack类别的错误，并对他们进行整理、聚合、优先级的排列
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');

const prodConfig = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist')
  },
  // webpack 4之后会在控制台中输出性能提示，当生成的文件大小超过一定阈值时，就会提示警告信息。
  performance: {
    // 禁止提示告警信息
    hints: false,
    // 指定入口点的最大大小 - 10M
    maxEntrypointSize: 102400,
    // 指定生成的资源文件的最大大小 - 10M
    maxAssetSize: 102400
  },
  plugins: [
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin()
  ]
}

module.exports = merge(baseConfig, prodConfig);