// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Whitelist',
  pageDesc:
    'You can add some SQL statements here, which will not trigger any audit rules during auditing.',

  ceTips:
    "If a user enables a rule but wants to temporarily bypass the triggering of certain rules in actual use, they can enable the platform'S whitelist feature.\nCurrently, it supports string matching or SQL fingerprint matching. Statements added to the SQL audit whitelist will not be subject to audit rules when creating a workflow request.",
  allWhitelist: 'All whitelist statements',
  table: {
    sql: 'SQL statement',
    desc: 'Whitelist description',
    matchType: 'Match mode'
  },

  matchType: {
    exact: 'String matching',
    fingerPrint: 'SQL fingerprint matching'
  },

  operate: {
    addWhitelist: 'Add whitelist',

    deleting: 'Deleting whitelist statement...',
    deleteSuccess: 'Successfully deleted whitelist statement',
    confirmDelete: 'Confirm deleting this whitelist?'
  },

  modal: {
    add: {
      title: 'Add whitelist'
    },
    update: {
      title: 'Update whitelist'
    },
    sql: 'SQL statement'
  }
};
