const MAIN_FILE = 'index.tsx';
const chalk = require('chalk');
const BASE_PORT = 8080;

// 打印时色彩颜色
const error  = chalk.bold.red;
const warning = chalk.hex('#FFA500');
const sucess = chalk.green;
const maps = {
  sucess,
  warning,
  error
}

// 因为环境变量的注入是通过字符串方式进行注入的
// 所以当打包多个文件时，我们可以通过*进行连接 比如home和editor 注入的环境变量为home*editor
// 注入多个包环境变量时的分隔符
const separator = '*';
const log = (message, types) => {
  console.log('日志信息', maps[types](message));
}
module.exports = {
  MAIN_FILE,
  log,
  separator,
  BASE_PORT
}