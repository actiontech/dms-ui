/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');

const reportJSONFilePath = path.resolve(process.cwd(), 'report.json');

if (!fs.existsSync(reportJSONFilePath)) {
  console.error('not found report.json');
  process.exit(1);
}

const coverageReport = require(reportJSONFilePath);

const coverageJsonReport = {
  coverageMap: coverageReport
};

fs.writeFile(reportJSONFilePath, JSON.stringify(coverageJsonReport), (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('Coverage report appended to ' + reportJSONFilePath);
});
