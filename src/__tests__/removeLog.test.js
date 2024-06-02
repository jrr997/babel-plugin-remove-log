import { transform, transformSync } from '@babel/core';
import removeLog from '../../lib';

const mockExecSync = jest.fn();

describe('removeLog Babel Plugin', () => {
  beforeEach(() => {
    mockExecSync.mockReset();
  });

  it('should remove console.log if the author is not in the users list', () => {
    const pluginOptions = {
      disabledCurrentUser: true,
      users: ['me'],
      __test__: {
        execSync: mockExecSync,
      },
    };
    const babelOptions = {
      plugins: [[removeLog, pluginOptions]],
    };

    mockExecSync.mockReturnValueOnce('author notMe\n'); // Mock getLineAuthor result

    const inputCode = `
      function test() {
        console.log('This should be removed');
      }
    `;

    const expectedOutput = '"use strict";\n\nfunction test() {}';

    const result = transformSync(inputCode, babelOptions);
    expect(result.code.trim()).toBe(expectedOutput.trim());
  });

  it('should not remove console.log if the author is in the users list', () => {
    const pluginOptions = {
      disabledCurrentUser: true,
      users: ['me'],
      __test__: {
        execSync: mockExecSync,
      },
    };
    const babelOptions = {
      plugins: [[removeLog, pluginOptions]],
    };

    mockExecSync.mockReturnValueOnce('author me\n'); // Mock getLineAuthor result

    const inputCode = `
      function test() {
        console.log('This should be removed');
      }
    `;

    const expectedOutput = `"use strict";\n\nfunction test() {\n  console.log('This should be removed');\n}`;

    const result = transformSync(inputCode, babelOptions);
    expect(result.code.trim()).toBe(expectedOutput.trim());
  });

  it('current user should work', () => {
    const pluginOptions = {
      __test__: {
        execSync: mockExecSync,
      },
    };
    const babelOptions = {
      plugins: [[removeLog, pluginOptions]],
    };

    mockExecSync.mockReturnValueOnce('me').mockReturnValueOnce('author me\n'); // Mock getLineAuthor result

    const inputCode = `
      function test() {
        console.log('This should be removed');
      }
    `;

    const expectedOutput = `"use strict";\n\nfunction test() {\n  console.log('This should be removed');\n}`;

    const result = transformSync(inputCode, babelOptions);
    expect(result.code.trim()).toBe(expectedOutput.trim());
  });
});
