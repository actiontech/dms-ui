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
const reportJSONFilePath = path.resolve(process.cwd(), 'coverage/report.json');

if (!fs.existsSync(ceReportJSONFilePath)) {
  console.error(`not found ce report.json ${ceReportJSONFilePath}`);
  process.exit(1);
}

if (!fs.existsSync(reportJSONFilePath)) {
  console.error(`not found report.json: ${reportJSONFilePath}`);
  process.exit(1);
}

const ceCoverageReport = require(ceReportJSONFilePath);
const coverageReport = require(reportJSONFilePath);

const numFailedTestSuites =
  ceCoverageReport.numFailedTestSuites + coverageReport.numFailedTestSuites;
const numFailedTests =
  ceCoverageReport.numFailedTests + coverageReport.numFailedTests;
const numPassedTestSuites =
  ceCoverageReport.numPassedTestSuites + coverageReport.numPassedTestSuites;
const numPassedTests =
  ceCoverageReport.numPassedTests + coverageReport.numPassedTests;
const numPendingTestSuites =
  ceCoverageReport.numPendingTestSuites + coverageReport.numPendingTestSuites;
const numPendingTests =
  ceCoverageReport.numPendingTests + coverageReport.numPendingTests;
const numRuntimeErrorTestSuites =
  ceCoverageReport.numRuntimeErrorTestSuites +
  coverageReport.numRuntimeErrorTestSuites;
const numTodoTests =
  ceCoverageReport.numTodoTests + coverageReport.numTodoTests;
const numTotalTestSuites =
  ceCoverageReport.numTotalTestSuites + coverageReport.numTotalTestSuites;
const numTotalTests =
  ceCoverageReport.numTotalTests + coverageReport.numTotalTests;
const snapshot = Object.keys(ceCoverageReport.snapshot ?? {}).reduce(
  (acc, key) => ({
    ...acc,
    [key]: (ceCoverageReport[key] ?? 0) + (coverageReport[key] ?? 0)
  }),
  {}
);
const success = ceCoverageReport.success && coverageReport.success;

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
  reportJSONFilePath,
  JSON.stringify(coverageReport.coverageMap),
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log('Coverage report appended to ' + reportJSONFilePath);
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
  console.log(stdout);

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
    success,
    snapshot,
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
