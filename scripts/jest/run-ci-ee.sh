#!/bin/sh

shard_index=${1:-1}
shard_count=${2:-1}

export JEST_TEST_VERSION_ENV="ee"
pnpm test:clean
pnpm jest --ci --logHeapUsage --maxWorkers=50% --silent --watchAll=false --filter='<rootDir>/scripts/jest/custom-filter' --coverage --coverageDirectory=coverage --json --testLocationInResults --outputFile=coverage/report.json --shard=$shard_index/$shard_count
if [ $? -ne 0 ]; then
  echo "Jest test failed."
  exit 1
fi

mv coverage/coverage-final.json coverage/report$shard_index.json
if [ $? -ne 0 ]; then
  echo "Jest test failed."
  exit 1
fi
