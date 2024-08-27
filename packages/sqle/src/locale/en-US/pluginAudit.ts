// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'IDE audit',
  ceTips:
    'When you need to verify SQL quality independently during development, you can configure the IDE audit plugin provided by SQLE. In addition, when you need to review the SQL audited in the IDE, you can use the recording function provided by SQLE to view usage and related statistics.',
  promptTitle: 'No audit records generated yet',
  promptDesc:
    'By viewing the IDE audit records, you can review the SQL audited in the IDE and obtain related statistics',
  promptStep:
    'Use IDE audit to get audit results\nPlatform generates usage records in real time',
  userBook: 'User manual',
  table: {
    sql: 'SQL',
    sqlFingerprint: 'SQL fingerprint',
    source: 'DB instance',
    schema: 'Schema',
    result: 'Audit result',
    count: 'Occurrences',
    firstAppearTime: 'First appearance time',
    lastReceiveTime: 'Last appearance time',
    creator: 'Creator'
  },
  drawerTitle: 'IDE audit result'
};
