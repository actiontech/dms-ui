// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL management whitelist',
  ceTips:
    "Users can now use the platform's SQL management whitelist to customize which SQL statements or data sources to ignore, so they do not appear on the dashboard. Once identified as an exception, a SQL statement will automatically be removed from the SQL control list, reducing unnecessary attention and minimizing interference, thus improving control efficiency and accuracy.",
  allWhitelist: 'All SQL management whitelist',
  table: {
    content: 'Content',
    desc: 'Description',
    matchType: 'Match type',
    matchCount: 'Matched count',
    lastMatchedTime: 'The last matching time'
  },

  matchType: {
    sql: 'SQL keyword',
    fingerPrint: 'SQL fingerprint',
    ip: 'IP',
    cidr: 'Subnet(CIRD)',
    host: 'Host',
    instance: 'Name of DB instance'
  },

  operate: {
    add: 'Add SQL management whitelist',
    deleting: 'Deleting SQL management whitelist item...',
    deleteSuccess: 'Successfully added SQL management whitelist item',
    confirmDelete:
      'Are you sure you want to delete this SQL management whitelist item?'
  },

  modal: {
    add: {
      title: 'Add SQL management whitelist',
      success: 'Successfully added SQL management whitelist'
    },
    update: {
      title: 'Update SQL management whitelist',
      success: 'Successfully updated SQL management whitelist'
    },
    sql: 'SQL'
  }
};
