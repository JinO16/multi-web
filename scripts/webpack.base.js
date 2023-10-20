const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { separator } = require('./utils/contant');
const { getEntryTemplate } = require('./utils/helper');

let packages;
let trendsEntry = {
  main: path.resolve(__dirname, '../src/packages/home/index.tsx'),
};
let initHtmlPlugin = [new HtmlWebpackPlugin({
  filename: 'index.html',
  template: path.resolve(__dirname, '../public/index.html'),
})];


if (process.env.packages) {
  packages = process.env.packages.split(separator);
  const {entry, htmlPlugis} = getEntryTemplate(packages);
  trendsEntry = entry;
  initHtmlPlugin = htmlPlugis;

}

module.exports = {
  mode: "development",
  // 动态替换entry
  entry: trendsEntry,
  resolve: {
    alias: {
      '@src': path.resolve(__dirname,'../src'),
      '@packages': path.resolve(__dirname, '../src/packages'),
      '@containers': path.resolve(__dirname, '../src/containers')
    },
    // 指定在解析模块时要尝试的文件名，当导入模块时，webpack会按照指定的文件名顺序尝试解析模块
    // 如果找到其中一个文件名匹配的文件，则使用该文件作为模块的入口文件
    mainFiles: ['index', 'main', 'app', 'editor'],
    // 不写文件后缀名时，默认的解析规则
    extensions: ['.ts', '.tsx', '.scss', '.json', '.js', '.less', 'html']
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: 'babel-loader' 
      },
      {
        test: /\.(sa|sc|le)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: 'asset/inline'
      }, 
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/[name].css'
    }),
    // 根据选中的包，加载对应的html plugin
    ...initHtmlPlugin
  ]
}