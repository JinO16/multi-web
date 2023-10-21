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
const allPackagesList = [...packagesList, 'all']

inquirer.prompt([
  {
    type: 'checkbox',
    message: '请选择需要打包的项目',
    name: 'devLists',
    choices: allPackagesList,
    // 校验至少选中一个
    validate(value) {
      return !value.length ? new Error('至少选择一个项目进行打包') : true
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
  log(message, 'success');
  runParallel(res.devLists);
})

function runParallel(packages) {
  const message = `开始打包: ${packages.join('-')}`
  log(message, 'warning')
  build(packages)
}

async function build(buildLists) {
  const stringLists = buildLists.join(separator)
  await execa('webpack', ['--config', './scripts/webpack.prod.js'], {
    stdio: 'inherit',
    env: {
      packages: stringLists,
    },
  })
}
