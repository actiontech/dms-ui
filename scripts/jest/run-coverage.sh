#!/bin/sh

test_version=${2:-ee}

echo "current test version: $test_version"

export JEST_TEST_PROD_VERSION_ENV="sqle"

export JEST_TEST_VERSION_ENV=$test_version
pnpm test:clean
pnpm jest --ci --silent --watchAll=false --filter='<rootDir>/scripts/jest/custom-filter' --coverage --coverageDirectory='coverage' $1
