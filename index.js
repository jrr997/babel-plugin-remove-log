const { execSync } = require('child_process');
console.log(123);
module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(path, state) {
        console.log('=====');
        const { callee, loc } = path.node;
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object, { name: 'console' }) &&
          t.isIdentifier(callee.property, { name: 'log' })
        ) {
          const filePath = state.file.opts.filename;
          const lineNumber = loc.start.line;
          const lineAuthor = getLineAuthor(filePath, lineNumber);

          if (lineAuthor === getCurrentGitUser()) {
            path.remove(); // 删除 console.log 语句
          }
        }
      },
    },
  };
};

function getLineAuthor(filePath, lineNumber) {
  const blameOutput = execSync(
    `git blame -L ${lineNumber},${lineNumber} ${filePath}`
  ).toString();
  return blameOutput.split(' ')[0];
}

function getCurrentGitUser() {
  let user = execSync('git config user.email').toString().trim();
  if (user) {
    getCurrentGitUser = () => user;
  } else {
    console.warn('没有user');
  }
  return user;
}
