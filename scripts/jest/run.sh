#!/bin/sh

test_version=${2:-ce}
echo "current test version: $test_version"


export JEST_TEST_VERSION_ENV=$test_version

pnpm jest -u --watchAll=true --filter='<rootDir>/scripts/jest/custom-filter' $1
