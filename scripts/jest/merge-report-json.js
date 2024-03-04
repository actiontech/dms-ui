/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

// https://github.com/ArtiomTr/jest-coverage-report-action/issues/244

const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const finalReportJSONFilePath = path.resolve(
  process.cwd(),
  'coverage-merged.json'
);

const ceReportJSONFilePath = path.resolve(
  process.cwd(),
  'ce_coverage/report.json'
);
const report1JSONFilePath = path.resolve(
  process.cwd(),
  'coverage/report-1.json'
);
const report2JSONFilePath = path.resolve(
  process.cwd(),
  'coverage/report-2.json'
);
const report3JSONFilePath = path.resolve(
  process.cwd(),
  'coverage/report-3.json'
);
const report4JSONFilePath = path.resolve(
  process.cwd(),
  'coverage/report-4.json'
);

if (!fs.existsSync(ceReportJSONFilePath)) {
  console.error(`not found ce report.json ${ceReportJSONFilePath}`);
  process.exit(1);
}

if (!fs.existsSync(report1JSONFilePath)) {
  console.error(`not found report1.json: ${report1JSONFilePath}`);
  process.exit(1);
}

if (!fs.existsSync(report2JSONFilePath)) {
  console.error(`not found report2.json: ${report2JSONFilePath}`);
  process.exit(1);
}

if (!fs.existsSync(report3JSONFilePath)) {
  console.error(`not found report3.json: ${report3JSONFilePath}`);
  process.exit(1);
}

if (!fs.existsSync(report4JSONFilePath)) {
  console.error(`not found report4.json: ${report4JSONFilePath}`);
  process.exit(1);
}

const ceCoverageReport = require(ceReportJSONFilePath);
const coverage1Report = require(report1JSONFilePath);
const coverage2Report = require(report2JSONFilePath);
const coverage3Report = require(report3JSONFilePath);
const coverage4Report = require(report4JSONFilePath);

const coverageJsonReport = [
  ceCoverageReport,
  coverage1Report,
  coverage2Report,
  coverage3Report,
  coverage4Report
].reduce((acc, cur) => {
  return {
    numFailedTestSuites:
      (acc.numFailedTestSuites ?? 0) + cur.numFailedTestSuites,
    numFailedTests: (acc.numFailedTests ?? 0) + cur.numFailedTests,
    numPassedTestSuites:
      (acc.numPassedTestSuites ?? 0) + cur.numPassedTestSuites,
    numPassedTests: (acc.numPassedTests ?? 0) + cur.numPassedTests,
    numPendingTestSuites:
      (acc.numPendingTestSuites ?? 0) + cur.numPendingTestSuites,
    numPendingTests: (acc.numPendingTests ?? 0) + cur.numPendingTests,
    numRuntimeErrorTestSuites:
      (acc.numRuntimeErrorTestSuites ?? 0) + cur.numRuntimeErrorTestSuites,
    numTodoTests: (acc.numTodoTests ?? 0) + cur.numTodoTests,
    numTotalTestSuites: (acc.numTotalTestSuites ?? 0) + cur.numTotalTestSuites,
    numTotalTests: (acc.numTotalTests ?? 0) + cur.numTotalTests,
    success: (acc.success ?? true) && cur.success
  };
}, {});

const command = 'pnpm test:merge';

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec command error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`exec command error: ${stderr}`);
    return;
  }
  console.log(stdout);

  const mergeCoverageReport = require(finalReportJSONFilePath);

  coverageJsonReport.coverageMap = mergeCoverageReport;

  fs.writeFile(
    finalReportJSONFilePath,
    JSON.stringify(coverageJsonReport),
    (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log('Coverage report appended to ' + finalReportJSONFilePath);
    }
  );
});
