#!/bin/sh

export JEST_TEST_PROD_VERSION_ENV="sqle"

export JEST_TEST_VERSION_ENV="ee"
pnpm test:clean
pnpm jest --ci --silent --watchAll=false --filter='<rootDir>/scripts/jest/custom-filter' --coverage --coverageDirectory='coverage' --json --outputFile='coverage/report.json'

export JEST_TEST_VERSION_ENV="ce"
pnpm test:clean
pnpm jest --ci --silent  --watchAll=false --filter='<rootDir>/scripts/jest/custom-filter' --coverage --coverageDirectory='ce_coverage' --json --outputFile='ce_coverage/report.json'

node ./scripts/jest/merge-report-json.js
