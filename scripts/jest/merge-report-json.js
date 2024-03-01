/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

// https://github.com/ArtiomTr/jest-coverage-report-action/issues/244

const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const finalReportJSONFilePath = path.resolve(process.cwd(), 'report.json');

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

const mergeSnapshot = (accSnapshot, curSnapshot) => {
  return Object.keys(accSnapshot ?? {}).reduce(
    (acc, key) => ({
      ...acc,
      [key]: (accSnapshot[key] ?? 0) + (curSnapshot[key] ?? 0)
    }),
    {}
  );
};

const coverageJsonReport = [
  ceCoverageReport,
  coverage1Report,
  coverage2Report,
  coverage3Report,
  coverage4Report
].reduce((acc, cur) => {
  return {
    numFailedTestSuites: acc.numFailedTestSuites + cur.numFailedTestSuites,
    numFailedTests: acc.numFailedTests + cur.numFailedTests,
    numPassedTestSuites: acc.numPassedTestSuites + cur.numPassedTestSuites,
    numPassedTests: acc.numPassedTests + cur.numPassedTests,
    numPendingTestSuites: acc.numPendingTestSuites + cur.numPendingTestSuites,
    numPendingTests: acc.numPendingTests + cur.numPendingTests,
    numRuntimeErrorTestSuites:
      acc.numRuntimeErrorTestSuites + cur.numRuntimeErrorTestSuites,
    numTodoTests: acc.numTodoTests + cur.numTodoTests,
    numTotalTestSuites: acc.numTotalTestSuites + cur.numTotalTestSuites,
    numTotalTests: acc.numTotalTests + cur.numTotalTests,
    success: acc.success && cur.success,
    snapshot: mergeSnapshot(acc.snapshot, cur.snapshot)
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
