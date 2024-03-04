#!/bin/sh

test_version=${2:-ee}
echo "current test version: $test_version"


export JEST_TEST_VERSION_ENV=$test_version

pnpm jest --maxWorkers=50% --watchAll=true --filter='<rootDir>/scripts/jest/custom-filter' --logHeapUsage $1
