const fs = require('fs');
const { parse: parseComments } = require('comment-parser');

const testRegex = new RegExp('(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$');

const filteringFunction = (path) => {
  const code = fs.readFileSync(path).toString();

  if (testRegex.test(path)) {
    const metadata = parseComments(code)[0]?.tags ?? [];
    const testVersion = metadata.find((v) => v.tag === 'test_version')?.name;

    if (process.env?.JEST_TEST_VERSION_ENV === 'ee') {
      const testProdVersion = metadata.find(
        (v) => v.tag === 'test_prod_version'
      )?.name;

      if (testProdVersion) {
        return (
          process.env.JEST_TEST_PROD_VERSION_ENV === testProdVersion &&
          (!testVersion || testVersion === 'ee')
        );
      }
      return !testVersion || testVersion === 'ee';
    }

    if (process.env.JEST_TEST_VERSION_ENV === 'ce') {
      return testVersion === 'ce';
    }
  }

  return true;
};

module.exports = (testPaths) => {
  const allowedPaths = testPaths
    .filter(filteringFunction)
    .map((test) => ({ test }));

  return {
    filtered: allowedPaths
  };
};
