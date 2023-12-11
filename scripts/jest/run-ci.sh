#!/bin/sh

export JEST_TEST_VERSION_ENV="ee"
pnpm test:clean
pnpm jest --ci --silent --watchAll=false --filter='<rootDir>/scripts/jest/custom-filter' --coverage --coverageDirectory='coverage' --json --testLocationInResults --outputFile='coverage/report.json'
# if [ $? -ne 0 ]; then
#   echo "Jest test failed."
#   exit 1
# fi

export JEST_TEST_VERSION_ENV="ce"
pnpm test:clean
pnpm jest --ci --silent  --watchAll=false --filter='<rootDir>/scripts/jest/custom-filter' --coverage --coverageDirectory='ce_coverage' --json --testLocationInResults --outputFile='ce_coverage/report.json'
# if [ $? -ne 0 ]; then
#   echo "Jest test ce failed."
#   exit 1
# fi

node ./scripts/jest/merge-report-json.js
# if [ $? -ne 0 ]; then
#   echo "merge report failed."
#   exit 1
# fi

