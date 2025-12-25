// https://github.com/ArtiomTr/jest-coverage-report-action/issues/244
// Updated to support package-based test splitting

const path = require('path');
const fs = require('fs');
const istanbul = require('istanbul-lib-coverage');

const finalReportJSONFilePath = path.resolve(
  process.cwd(),
  'coverage-merged.json'
);

// Look for coverage artifacts in coverage-all directory (from GitHub Actions artifacts)
// or fall back to coverage and ce_coverage directories (for local testing)
const coverageAllPath = path.resolve(process.cwd(), 'coverage-all');
const coveragePath = path.resolve(process.cwd(), 'coverage');
const ceCoveragePath = path.resolve(process.cwd(), 'ce_coverage');

// Find all report.json files
const findReportFiles = (dir) => {
  const reports = [];
  if (!fs.existsSync(dir)) {
    return reports;
  }

  const findInDir = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        findInDir(fullPath);
      } else if (entry.name === 'report.json' || entry.name.startsWith('report-') && entry.name.endsWith('.json')) {
        reports.push(fullPath);
      }
    }
  };

  findInDir(dir);
  return reports;
};

// Find all coverage-final.json files
const findCoverageFinalFiles = (dir) => {
  const coverageFiles = [];
  if (!fs.existsSync(dir)) {
    return coverageFiles;
  }

  const findInDir = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        findInDir(fullPath);
      } else if (entry.name === 'coverage-final.json' || (entry.name.startsWith('coverage-final-') && entry.name.endsWith('.json'))) {
        coverageFiles.push(fullPath);
      }
    }
  };

  findInDir(dir);
  return coverageFiles;
};

// Collect report files from all possible locations
let reportFiles = [];
if (fs.existsSync(coverageAllPath)) {
  // GitHub Actions: artifacts are in coverage-all
  reportFiles = findReportFiles(coverageAllPath);
} else {
  // Local fallback: check coverage and ce_coverage directories
  reportFiles = [
    ...findReportFiles(coveragePath),
    ...findReportFiles(ceCoveragePath)
  ];
}

if (reportFiles.length === 0) {
  console.error('No report.json files found. Please check coverage artifacts.');
  process.exit(1);
}

console.log(`Found ${reportFiles.length} report files:`);
reportFiles.forEach((file) => console.log(`  - ${file}`));

// Load and merge all reports
const coverageReports = reportFiles.map((filePath) => {
  try {
    return require(filePath);
  } catch (error) {
    console.error(`Error loading report file ${filePath}:`, error.message);
    return null;
  }
}).filter(Boolean);

if (coverageReports.length === 0) {
  console.error('No valid report files found.');
  process.exit(1);
}

// Merge test statistics
const coverageJsonReport = coverageReports.reduce((acc, cur) => {
  return {
    numFailedTestSuites:
      (acc.numFailedTestSuites ?? 0) + (cur.numFailedTestSuites ?? 0),
    numFailedTests: (acc.numFailedTests ?? 0) + (cur.numFailedTests ?? 0),
    numPassedTestSuites:
      (acc.numPassedTestSuites ?? 0) + (cur.numPassedTestSuites ?? 0),
    numPassedTests: (acc.numPassedTests ?? 0) + (cur.numPassedTests ?? 0),
    numPendingTestSuites:
      (acc.numPendingTestSuites ?? 0) + (cur.numPendingTestSuites ?? 0),
    numPendingTests: (acc.numPendingTests ?? 0) + (cur.numPendingTests ?? 0),
    numRuntimeErrorTestSuites:
      (acc.numRuntimeErrorTestSuites ?? 0) + (cur.numRuntimeErrorTestSuites ?? 0),
    numTodoTests: (acc.numTodoTests ?? 0) + (cur.numTodoTests ?? 0),
    numTotalTestSuites: (acc.numTotalTestSuites ?? 0) + (cur.numTotalTestSuites ?? 0),
    numTotalTests: (acc.numTotalTests ?? 0) + (cur.numTotalTests ?? 0),
    success: (acc.success ?? true) && (cur.success ?? true)
  };
}, {});

// Create coverage-merged directory
const coverageMergedDir = path.resolve(process.cwd(), 'coverage-merged');
if (!fs.existsSync(coverageMergedDir)) {
  fs.mkdirSync(coverageMergedDir, { recursive: true });
}

// Collect and copy coverage-final.json files
let coverageFinalFiles = [];
if (fs.existsSync(coverageAllPath)) {
  coverageFinalFiles = findCoverageFinalFiles(coverageAllPath);
} else {
  coverageFinalFiles = [
    ...findCoverageFinalFiles(coveragePath),
    ...findCoverageFinalFiles(ceCoveragePath)
  ];
}

console.log(`Found ${coverageFinalFiles.length} coverage-final files:`);
coverageFinalFiles.forEach((file, index) => {
  const fileName = `coverage-map-${index + 1}.json`;
  const destPath = path.join(coverageMergedDir, fileName);
  try {
    fs.copyFileSync(file, destPath);
    console.log(`  - Copied ${file} to ${destPath}`);
  } catch (error) {
    console.error(`Error copying coverage file ${file}:`, error.message);
  }
});

// Merge coverage maps
const mergeCoverageReport = istanbul.createCoverageMap({});

const mergedCoverageFiles = fs.readdirSync(coverageMergedDir)
  .filter((file) => file.startsWith('coverage-map-') && file.endsWith('.json'));

mergedCoverageFiles.forEach((file) => {
  const filePath = path.join(coverageMergedDir, file);
  try {
    const json = fs.readFileSync(filePath, 'utf8');
    mergeCoverageReport.merge(JSON.parse(json));
  } catch (error) {
    console.error(`Error merging coverage file ${filePath}:`, error.message);
  }
});

coverageJsonReport.coverageMap = mergeCoverageReport;

// Write merged report
fs.writeFile(
  finalReportJSONFilePath,
  JSON.stringify(coverageJsonReport),
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log('Coverage report merged and saved to ' + finalReportJSONFilePath);
  }
);
