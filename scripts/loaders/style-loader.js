/**
 * style-loader的作用本身就是将css内容以内联的方式插入到html标签中
 * @param {*} cssSource css文件源码
 * @returns 
 */
function styleLoader(cssSource) {
  
}
styleLoader.pitch = function (remainingRequest) {
  let script = `
    let style = document.createElement("style");
    style.innerHTML = require("!!${remainingRequest}");
    document.head.appendChild(style);
  `;
  return script;
}
module.exports = styleLoader;
