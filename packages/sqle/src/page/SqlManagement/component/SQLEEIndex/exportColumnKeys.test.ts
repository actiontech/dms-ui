import LocalStorageWrapper from '@actiontech/shared/lib/utils/LocalStorageWrapper';
import SqlManagementColumn from './column';
import {
  getSqlManagementExportColumnKeys,
  SQL_MANAGEMENT_TABLE_NAME
} from './exportColumnKeys';

const mockUpdateRemark = jest.fn();
const mockOpenModal = jest.fn();

const columns = SqlManagementColumn(
  '700300',
  true,
  mockUpdateRemark,
  mockOpenModal
);

describe('page/SqlManagement/SQLEEIndex/exportColumnKeys', () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('return default export columns when current user has no settings', () => {
    expect(getSqlManagementExportColumnKeys(columns, 'admin')).toEqual([
      'sql_fingerprint',
      'sql',
      'source',
      'audit_result',
      'instance_name',
      'schema_name',
      'priority',
      'assignees',
      'endpoints',
      'status',
      'remark'
    ]);
  });

  it('return visible business columns by local settings order', () => {
    LocalStorageWrapper.set(
      SQL_MANAGEMENT_TABLE_NAME,
      JSON.stringify({
        admin: {
          sql_fingerprint: { order: 2, show: true },
          sql: { order: 1, show: true },
          source: { order: 3, show: false },
          audit_result: { order: 4, show: true },
          selection: { order: 5, show: true },
          action: { order: 6, show: true },
          filter_business: { order: 7, show: true }
        }
      })
    );

    expect(getSqlManagementExportColumnKeys(columns, 'admin')).toEqual([
      'sql',
      'sql_fingerprint',
      'audit_result',
      'instance_name',
      'schema_name',
      'priority',
      'assignees',
      'endpoints',
      'status',
      'remark'
    ]);
  });

  it('return empty array when all export columns are hidden', () => {
    LocalStorageWrapper.set(
      SQL_MANAGEMENT_TABLE_NAME,
      JSON.stringify({
        admin: Object.fromEntries(
          [
            'sql_fingerprint',
            'sql',
            'source',
            'audit_result',
            'instance_name',
            'schema_name',
            'priority',
            'assignees',
            'endpoints',
            'status',
            'remark'
          ].map((columnKey, index) => [
            columnKey,
            { order: index + 1, show: false }
          ])
        )
      })
    );

    expect(getSqlManagementExportColumnKeys(columns, 'admin')).toEqual([]);
  });
});
