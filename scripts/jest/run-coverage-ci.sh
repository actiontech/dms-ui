#!/bin/sh

# Use environment variable if set, otherwise use second parameter, default to ee
test_version=${JEST_TEST_VERSION_ENV:-${2:-ee}}

echo "current test version: $test_version"

export JEST_TEST_VERSION_ENV=$test_version
pnpm test:clean
pnpm jest --ci --maxWorkers=50% --silent --watchAll=false --filter='<rootDir>/../../scripts/jest/custom-filter' --coverage --coverageDirectory='coverage' --json --testLocationInResults --outputFile=coverage/report.json --logHeapUsage $1

