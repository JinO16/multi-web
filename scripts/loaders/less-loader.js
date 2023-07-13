const less = require('less');

// 参数就是less文件源代码
function lessLoader(lessSource) {
  let css;
  // 通过less本身的render方法，将less文件转换成css代码的过程 【也类似于js文件，会解析成AST后，再进一步转译成css】
  less.render(lessSource, {filename: this.resource}, (err, output) => {
    css = output.css;
  });
  return css;
}

module.exports = lessLoader;