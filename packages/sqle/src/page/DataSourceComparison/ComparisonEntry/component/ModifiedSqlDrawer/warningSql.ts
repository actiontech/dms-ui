// SQL WARNING comment marker emitted by drivers (e.g. Hive) when a DDL
// must be expressed as DROP + CREATE rather than a non-destructive ALTER.
// Drivers prepend lines like "-- WARNING: data loss risk; table will be dropped and recreated."
// in the generated modify SQL. The UI surfaces these in two places:
//   1. A drawer-level banner (only once per drawer, no matter how many WARNING lines exist).
//   2. Per-line highlight inside the SQL preview area.
export const WARNING_LINE_PREFIX = '-- WARNING:';

/**
 * Returns true when the given SQL text contains at least one line that
 * starts with the WARNING marker. Whitespace before the marker is tolerated
 * because the SQL is built by the backend with consistent formatting, but
 * we keep the check lenient to handle future formatting changes.
 */
export const sqlHasWarningLine = (sql?: string | null): boolean => {
  if (!sql) {
    return false;
  }
  return sql.split(/\r?\n/).some((line) => isWarningLine(line));
};

/**
 * Returns true when the trimmed line starts with the WARNING marker.
 */
export const isWarningLine = (line: string): boolean => {
  return line.trimStart().startsWith(WARNING_LINE_PREFIX);
};

/**
 * Aggregates whether any SQL statement in the given iterable contains a
 * WARNING marker. Used by ModifiedSqlDrawer to decide whether to show the
 * top banner exactly once.
 */
export const anySqlHasWarning = (
  sqls: Array<{ sql_statement?: string } | undefined> | undefined
): boolean => {
  if (!sqls || sqls.length === 0) {
    return false;
  }
  return sqls.some((item) => sqlHasWarningLine(item?.sql_statement));
};
