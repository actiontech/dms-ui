#!/bin/sh

package_name=$1
test_version=${2:-ee}

if [ -z "$package_name" ]; then
  echo "Error: package name is required"
  echo "Usage: $0 <package_name> [test_version]"
  echo "Example: $0 base ce"
  exit 1
fi

echo "Running CI tests for package: $package_name, version: $test_version"

export JEST_TEST_VERSION_ENV=$test_version
pnpm test:clean --filter=$package_name

# Run test:coverage:ci for the specific package using turbo
pnpm turbo run test:coverage:ci --filter=$package_name

if [ $? -ne 0 ]; then
  echo "Jest test failed for package: $package_name"
  exit 1
fi

# Move coverage files to a package-specific directory for artifact collection
package_coverage_dir="coverage/${package_name}-${test_version}"
mkdir -p "$package_coverage_dir"

# Find the package's coverage directory and copy files
# Coverage output is typically in the package's own coverage directory
if [ -d "packages/${package_name}/coverage" ]; then
  cp -r packages/${package_name}/coverage/* "$package_coverage_dir/" 2>/dev/null || true
fi

# Also check root coverage directory (some packages might output there)
if [ -d "coverage" ] && [ "$package_name" = "base" ]; then
  # For base package, coverage might be in root
  find coverage -maxdepth 1 -type f -name "*.json" -exec cp {} "$package_coverage_dir/" \; 2>/dev/null || true
fi

# Rename report.json to include package and version info
if [ -f "$package_coverage_dir/report.json" ]; then
  mv "$package_coverage_dir/report.json" "$package_coverage_dir/report-${package_name}-${test_version}.json"
fi

# Rename coverage-final.json similarly
if [ -f "$package_coverage_dir/coverage-final.json" ]; then
  mv "$package_coverage_dir/coverage-final.json" "$package_coverage_dir/coverage-final-${package_name}-${test_version}.json"
fi

# Clean up unnecessary files
rm -rf "$package_coverage_dir/lcov-report" "$package_coverage_dir/clover.xml" "$package_coverage_dir/locv.info" 2>/dev/null || true

echo "Coverage report generated for $package_name ($test_version) in $package_coverage_dir"

