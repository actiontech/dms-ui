// https://github.com/ArtiomTr/jest-coverage-report-action/issues/244

const path = require('path');
const fs = require('fs');
const istanbul = require('istanbul-lib-coverage');

const SHARD_COUNT = parseInt(process.env.SHARD_COUNT || '4', 10);

const finalReportJSONFilePath = path.resolve(
  process.cwd(),
  'coverage-merged.json'
);

for (let i = 1; i <= SHARD_COUNT; i++) {
  const reportPath = path.resolve(
    process.cwd(),
    `coverage/report-${i}.json`
  );
  if (!fs.existsSync(reportPath)) {
    console.error(`not found report-${i}.json: ${reportPath}`);
    process.exit(1);
  }
}

const coverageJsonReport = Array.from({ length: SHARD_COUNT }, (_, i) =>
  require(path.resolve(process.cwd(), `coverage/report-${i + 1}.json`))
).reduce(
  (acc, cur) => ({
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
  }),
  {}
);

const coverageMergedDir = path.resolve(process.cwd(), 'coverage-merged');
if (!fs.existsSync(coverageMergedDir)) {
  fs.mkdirSync(coverageMergedDir);
}

for (let i = 1; i <= SHARD_COUNT; i++) {
  const src = path.resolve(
    process.cwd(),
    `coverage/coverage-final-${i}.json`
  );
  if (fs.existsSync(src)) {
    fs.renameSync(
      src,
      path.resolve(coverageMergedDir, `coverage-map-${i}.json`)
    );
  }
}

const mergeCoverageReport = istanbul.createCoverageMap({});

fs.readdirSync(coverageMergedDir).forEach((file) => {
  const json = fs.readFileSync(path.resolve(coverageMergedDir, file));
  mergeCoverageReport.merge(JSON.parse(json));
});

coverageJsonReport.coverageMap = mergeCoverageReport;

fs.writeFile(
  finalReportJSONFilePath,
  JSON.stringify(coverageJsonReport),
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log('Coverage report merged to ' + finalReportJSONFilePath);
  }
);
