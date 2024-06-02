import { execSync } from 'child_process';

export default function removeLog(
  { types: t },
  { disabledCurrentUser = false, users = [], __test__ }
) {
  const reg = /author\s(.*?)\n/;

  const _execSync = __test__?.execSync || execSync;

  function getCurrentGitUser() {
    try {
      let user = _execSync('git config user.name').toString().trim();
      return user;
    } catch (e) {}
  }

  function getLineAuthor(filePath, lineNumber) {
    try {
      const blameOutput = _execSync(
        `git blame -p -L ${lineNumber},${lineNumber} ${filePath}`
      ).toString();
      const author = blameOutput.match(reg)[1];
      return author;
    } catch (e) {
      return undefined;
    }
  }

  if (!disabledCurrentUser) {
    const currentUser = getCurrentGitUser();
    if (currentUser !== void 0) users.push(currentUser);
  }
  users.push('Not Committed Yet');

  return {
    visitor: {
      CallExpression(path, state) {
        const { callee, loc } = path.node;
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object, { name: 'console' }) &&
          t.isIdentifier(callee.property, { name: 'log' })
        ) {
          const filePath = state.file.opts.filename;
          const lineNumber = loc.start.line;
          const lineAuthor = getLineAuthor(filePath, lineNumber);
          if (lineAuthor && !users.includes(lineAuthor)) {
            path.remove();
          }
        }
      },
    },
  };
}
