#!/bin/sh

# Usage: pnpm test [path] [project]
#
# Arguments:
#   path    - (optional) test path pattern, e.g. packages/sqle/src/components/Foo
#   project - (optional) project name: ee | ce  (default: runs both)
#
# Examples:
#   pnpm test                                                   → all projects, all tests
#   pnpm test "" ee                                             → ee project, all tests
#   pnpm test packages/sqle/src/components/Foo                 → all projects, filtered path
#   pnpm test packages/sqle/src/components/Foo ee              → ee project, filtered path

test_path="${1:-}"
test_project="${2:-}"

base_args="--maxWorkers=50% --watchAll=true"

if [ -n "$test_project" ]; then
  base_args="$base_args --selectProjects $test_project"
fi

if [ -n "$test_path" ]; then
  # Use --testPathPattern explicitly; positional args are ignored in --watchAll mode
  pnpm jest $base_args --testPathPattern="$test_path"
else
  pnpm jest $base_args
fi
