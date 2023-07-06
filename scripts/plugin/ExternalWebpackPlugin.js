const { ExternalModule } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const pluginName = 'ExternalsWebpackPlugin';

class ExternalsWebpackPlugin {
  constructor(options) {
    // 保存参数
    this.options = options;
    // 保存参数传入的所有需要转化CDN外部externals的库名称 转化后为['lodash']
    this.transformLibrary = Object.keys(this.options);
    // 存储我们在代码中真实使用到的外部依赖库
    this.usedLibrary = new Set();
  }

  apply(compiler) {
    // 创建normalModuleFactory的监听注册函数，当开始编译时触发
    compiler.hooks.normalModuleFactory.tap(pluginName, (normalModuleFactory) => {
      // 初始化解析模块之前调用
      normalModuleFactory.hooks.factorize.tapAsync(pluginName, (resolveData, callback) => {
        // 获取引入模块名称
        const requireModuleName = resolveData.request;
        if (this.transformLibrary.includes(requireModuleName)) {
          // 如果当前模块存在于需要转化的外部模块
          // 首先需要获得当前模块需要转位成为的变量名
          const externalModuleName = this.options[requireModuleName].variableName;
          // 返回了创建一个外部依赖模块进行返回
          // 告诉weebpack这个模块不需要被编译，我为你返回了一个ExternalModule的实例对象，直接当作外部依赖处理
          callback(null, new ExternalModule(
              externalModuleName,
              'window',
              externalModuleName
          ))
        } else {
          callback();
        }
      });

      // 在编译模块时触发，将模块变为AST阶段调用
      normalModuleFactory.hooks.parser
      .for('javascript/auto')
      .tap(pluginName, (parser) => {
        // 遇到模块引入语句import和require时，调用这两个方法。
        importHandler.call(this, parser);
        requireHandler.call(this, parser);
      })
    })
    // 在html中注入外联模块的cdn
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // 获取HtmlWebpckPlugin拓展的compilation hooks
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(pluginName, data => {
        // 额外添加scripts
        const scriptTag = data.assetTags.scripts;
        this.usedLibrary.forEach(library => {
          scriptTag.unshift({
            tagName: 'script',
            voidTag: false,
            meta: {
              plugin: pluginName
            },
            attributes: {
              defer: true,
              type: undefined,
              src: this.options[library].src
            }
          })
        })
      })
    })

  }

  
}

function importHandler(parser) {
     parser.hooks.import.tap(pluginName, (statement, source) => {
      // 解析当前模块中的import语句
      if (this.transformLibrary.includes(source)) {
        this.usedLibrary.add(source);
      }
     }) 
}

function requireHandler(parser) {
  parser.hooks.call.for('require').tap(pluginName, (expression) => {
      console.log('expression.arguments===>', expression.arguments);
      const moduleName = expression.arguments[0].value;
      if (this.transformLibrary.includes(moduleName)) {
        this.usedLibrary.add(moduleName);
      }
  })
}

module.exports = ExternalsWebpackPlugin;
