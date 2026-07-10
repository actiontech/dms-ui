const BLACKLIST_ID_PATTERN = /blacklist_id=(\d+)/;
const AUDIT_WHITELIST_CONFLICT_ID_PATTERN =
  /audit whitelist already exists, id=(\d+)/i;
const GENERIC_ID_PATTERN = /id=(\d+)/;

export const parseConflictAuditWhitelistId = (
  message?: string
): number | null => {
  if (!message) {
    return null;
  }
  const auditWhitelistMatch = message.match(
    AUDIT_WHITELIST_CONFLICT_ID_PATTERN
  );
  if (auditWhitelistMatch?.[1]) {
    return Number(auditWhitelistMatch[1]);
  }
  const blacklistMatch = message.match(BLACKLIST_ID_PATTERN);
  if (blacklistMatch?.[1]) {
    return Number(blacklistMatch[1]);
  }
  const genericMatch = message.match(GENERIC_ID_PATTERN);
  if (genericMatch?.[1]) {
    return Number(genericMatch[1]);
  }
  return null;
};

/** @deprecated use parseConflictAuditWhitelistId */
export const parseRuleExceptionConflictId = parseConflictAuditWhitelistId;
