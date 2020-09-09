var fs = require('fs');
var path = require('path');

console.log('__Dir', __dirname);
var hasConf = false;
function copyFile (src, dist) {
  const fileName = 'project.config.json';
  const srcRes = path.resolve(__dirname, `${src}/${fileName}`);
  const distRes = path.resolve(__dirname, dist);

  if (fs.existsSync(srcRes)) {
    if (!fs.existsSync(distRes)) {
      fs.mkdirSync(distRes, { recursive: true });
    }
    fs.writeFileSync(`${distRes}/${fileName}`, fs.readFileSync(srcRes));
    hasConf = true;
  }
}

// 没有找到哦更早的hook 所以干脆在引入的时候做备份的事
copyFile('./dist/dev/mp-weixin', './dist/tmp/dev');

class CopyConfPlugin {
  apply (compiler) {
    compiler.hooks.done.tap('CopyConfPlugin',
      (compilation, callback) => {
        if (hasConf) {
          console.log('还原配置文件');
          copyFile('./dist/tmp/dev', './dist/dev/mp-weixin');
        }
      });
  }
}
module.exports = CopyConfPlugin;
