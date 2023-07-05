const execa = require('execa');
const {log, separator, MAIN_FILE} = require('./contant');
const { entry } = require('./helper');
const inquirer = require('inquirer');

const envConfig = process.env.ENV === 'DEV' ? 'dev' : 'prod';
// 获取packages下的所有文件
const packagesList = [...Object.keys(entry)];
// 至少保证一个
if (!packagesList.length) {
  return log('不合法目录， 请检查src/packages/*/main.tsx', 'warning'); 
}

// 同时添加一个全选
const allPackagesList = [...packagesList, 'all'];

// 调用inquirer和用户交互
inquirer.prompt([
  {
    type: 'checkbox',
    message: '请选择需要启动的项目',
    name: 'devLists',
    choices: allPackagesList,
    // 校验至少选中一个
    validate(value) {
      return !value.length ? new Error('至少选择一个项目进行启动') : true
    },
    // 当选中all选项时候 返回所有packagesList这个数组
    filter(value) {
      if (value.includes('all')) {
        return packagesList
      }
      return value
    }
  }
])
.then(res => {
  const message = `当前选中的是: ${res.devLists.join(',')}`;
  log(message, 'sucess');
  runParallel(res.devLists);
})

async function runParallel(packages) {
  // 当前所有入口文件
  const message = `开始启动：${packages.join('-')}`;
  log(message, 'sucess');
  log('/nplease waiting som times...', 'sucess');
  await build(packages);
}

// 真正的build函数
async function build(buildsList) {
  // 将选中的包通过separator分割
  const stringList = buildsList.join(separator);
  // 通过调用execa调用webpack命令
  // 同时注意路径是相对 执行node的cwd路径
  // 最终会在package.json中 使用node来执行这个脚本
  await execa('webpack', ['server', '--config', `./scripts/webpack.${envConfig}.js`], {
    stdio: 'inherit',
    env: {
      packages: stringList
    }
  })
}