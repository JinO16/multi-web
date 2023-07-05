const path = require('path');
const fs = require('fs');
const { MAIN_FILE } = require('./contant');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 获取 多页面入口文件夹中的路径
const dirPath = path.resolve(__dirname, '../../src/packages');
// 用于保存入口文件的Map
const entry = Object.create(null);

// 读取dirPath中的文件夹个数
// 同时保存到entry中 key为文件夹名称 value为文件夹路径
fs.readdirSync(dirPath).filter(file => {
  const entryPath = path.join(dirPath, file);
  // 同步获取文件的方法。
  // 这个方法用于获取文件或目录的状态信息，接受一个路径作为参数，
  // 并返回一个包含文件或目录的详细信息的对象
  if (fs.statSync(entryPath)) {
    entry[file] = path.join(entryPath, MAIN_FILE);
  }
})

/**
 * 
 * @param {*} packages 数组
 * @returns 返回对应webpack需要的entry和html-webpack-plugin组成的数组
 */
// 根据入口文件list生成对应的htmlWebpackPlugin
// 同时返回对应的webpack需要的入口和htmlWebpackPlugin
const getEntryTemplate = packages => {
  const entry = Object.create(null);
  const htmlPlugis = [];
  packages.forEach(packageName => {
    entry[packageName] = path.join(dirPath, packageName, MAIN_FILE);
    htmlPlugis.push(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../../public/index.html'),
        filename: `${packageName}.html`,
        chunks: ['manifest', 'vendors', packageName]
      })
    )
  });
  return {entry, htmlPlugis};
}

module.exports = {
  entry,
  getEntryTemplate,
}