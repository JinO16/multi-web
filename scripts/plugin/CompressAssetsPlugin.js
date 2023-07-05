const JSZip = require('jszip');
const { RawSource }  = require('webpack-sources');
/**
 * 将本次打包的资源都打包成为一个压缩包
 * 需求：获取所有打包的资源
 */
const pluginName = 'CompressAssetsPlugin';

class CompressAssetsPlugin {
  // 在配置文件中传入的参数会保存在插件实例中
  constructor({output}) {
    console.log('output===>', output);
    // 接受外部传入的output参数
    this.output = output;
  }
  apply(compiler) {
    // 注册函数 在webpack即将输出打包文件内容时执行
    // 第一个参数compilation对象，表示本次构建的相关对象
    // 第二个参数callback 对应我们通过tapAsync注册的异步事件函数，当调用callback时表示注册事件执行完成
    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      // 执行插件中的内容
      // 创建jszip对象
      const zip = new JSZip();
      // 获取本次打包生成的所有assets资源
      const assets = compilation.getAssets();
      console.log('assets===>', assets);
      assets.forEach(({name, source}) => {
        // 调用source获取对应的源代码 这是一个源代码的字符串
        const sourceCode = source.source();
        // 向zip中添加资源名称和源代码内容
        zip.file(name, sourceCode);
      });

      // 调用zip.generateAsync 生成zip压缩包
      zip.generateAsync({type: 'nodebuffer'}).then(res => {
        // 通过new RawSource创建压缩包
        // 同时通过compilation.emitAsset 方法将生成的Zip压缩包输出到this.output中
        compilation.emitAsset(this.output, new RawSource(res));
        callback();
      })
      
    })
  }
}

module.exports = CompressAssetsPlugin;