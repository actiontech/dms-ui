#!/bin/sh

shard_index=${1:-1}
shard_count=${2:-1}

pnpm test:clean
pnpm jest --ci --maxWorkers=50% --silent --watchAll=false --coverage --coverageDirectory=coverage --json --testLocationInResults --outputFile=coverage/report.json --shard=$shard_index/$shard_count
if [ $? -ne 0 ]; then
  echo "Jest test failed."
  exit 1
fi

mv coverage/report.json coverage/report-$shard_index.json
if [ $? -ne 0 ]; then
  echo "Move report.json failed."
  exit 1
fi

mv coverage/coverage-final.json coverage/coverage-final-$shard_index.json
if [ $? -ne 0 ]; then
  echo "Move coverage-final.json failed."
  exit 1
fi

rm -rf coverage/lcov-report coverage/clover.xml coverage/lcov.info
if [ $? -ne 0 ]; then
  echo "Jest test failed."
  exit 1
fi
