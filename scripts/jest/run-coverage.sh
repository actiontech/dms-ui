#!/bin/sh

# Usage: pnpm test:c [path] [project]
#
# Arguments:
#   path    - (optional) test path pattern, e.g. packages/sqle/src/components/Foo
#   project - (optional) project name: ee | ce  (default: runs both)

test_path="${1:-}"
test_project="${2:-}"

echo "project: ${test_project:-all} | path: ${test_path:-all}"

pnpm test:clean

base_args="--watchAll=false --coverage --coverageDirectory=coverage --logHeapUsage"

if [ -n "$test_project" ]; then
  base_args="$base_args --selectProjects $test_project"
fi

if [ -n "$test_path" ]; then
  pnpm jest $base_args --testPathPattern="$test_path"
else
  pnpm jest $base_args
fi
