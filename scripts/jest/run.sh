#!/bin/sh

export JEST_TEST_PROD_VERSION_ENV="sqle"

test_version=${2:-ee}
echo "current test version: $test_version"


export JEST_TEST_VERSION_ENV=$test_version

pnpm jest --watchAll=true --filter='<rootDir>/scripts/jest/custom-filter' $1
