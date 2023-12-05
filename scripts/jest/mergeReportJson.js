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
const eeReportJSONFilePath = path.resolve(
  process.cwd(),
  'ee_coverage/report.json'
);

if (!fs.existsSync(ceReportJSONFilePath)) {
  console.error('not found ce report.json');
  process.exit(1);
}

if (!fs.existsSync(eeReportJSONFilePath)) {
  console.error('not found ee report.json');
  process.exit(1);
}

const ceCoverageReport = require(ceReportJSONFilePath);
const eeCoverageReport = require(eeReportJSONFilePath);

const numFailedTestSuites =
  ceCoverageReport.numFailedTestSuites + eeCoverageReport.numFailedTestSuites;
const numFailedTests =
  ceCoverageReport.numFailedTests + eeCoverageReport.numFailedTests;
const numPassedTestSuites =
  ceCoverageReport.numPassedTestSuites + eeCoverageReport.numPassedTestSuites;
const numPassedTests =
  ceCoverageReport.numPassedTests + eeCoverageReport.numPassedTests;
const numPendingTestSuites =
  ceCoverageReport.numPendingTestSuites + eeCoverageReport.numPendingTestSuites;
const numPendingTests =
  ceCoverageReport.numPendingTests + eeCoverageReport.numPendingTests;
const numRuntimeErrorTestSuites =
  ceCoverageReport.numRuntimeErrorTestSuites +
  eeCoverageReport.numRuntimeErrorTestSuites;
const numTodoTests =
  ceCoverageReport.numTodoTests + eeCoverageReport.numTodoTests;
const numTotalTestSuites =
  ceCoverageReport.numTotalTestSuites + eeCoverageReport.numTotalTestSuites;
const numTotalTests =
  ceCoverageReport.numTotalTests + eeCoverageReport.numTotalTests;

fs.writeFile(
  ceReportJSONFilePath,
  JSON.stringify(ceCoverageReport.coverageMap),
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log('Coverage report appended to ' + ceReportJSONFilePath);
  }
);

fs.writeFile(
  eeReportJSONFilePath,
  JSON.stringify(eeCoverageReport.coverageMap),
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log('Coverage report appended to ' + eeReportJSONFilePath);
  }
);

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
  const mergeCoverageReport = require(finalReportJSONFilePath);

  const coverageJsonReport = {
    numFailedTestSuites,
    numFailedTests,
    numPassedTestSuites,
    numPassedTests,
    numPendingTestSuites,
    numPendingTests,
    numRuntimeErrorTestSuites,
    numTodoTests,
    numTotalTestSuites,
    numTotalTests,
    coverageMap: mergeCoverageReport
  };

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
