export JEST_TEST_VERSION_ENV="ce"
pnpm test:clean
pnpm jest --ci --maxWorkers=50% --silent  --watchAll=false --filter='<rootDir>/scripts/jest/custom-filter' --coverage --coverageDirectory=ce_coverage --json --testLocationInResults --outputFile=ce_coverage/report.json
if [ $? -ne 0 ]; then
  echo "Jest test ce failed."
  exit 1
fi

rm -rf ce_coverage/lcov-report ce_coverage/clover.xml ce_coverage/locv.info
if [ $? -ne 0 ]; then
  echo "Jest test ce failed."
  exit 1
fi