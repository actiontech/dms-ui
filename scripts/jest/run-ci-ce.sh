export JEST_TEST_VERSION_ENV="ce"
pnpm test:clean
pnpm jest --ci --logHeapUsage --maxWorkers=50% --silent  --watchAll=false --filter='<rootDir>/scripts/jest/custom-filter' --coverage --coverageDirectory=ce_coverage --json --testLocationInResults --outputFile=ce_coverage/report.json
if [ $? -ne 0 ]; then
  echo "Jest test ce failed."
  exit 1
fi