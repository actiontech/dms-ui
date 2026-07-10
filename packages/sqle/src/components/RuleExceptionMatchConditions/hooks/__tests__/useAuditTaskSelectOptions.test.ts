import { TFunction } from 'i18next';
import { SelectProps } from 'antd';
import { formatAuditTaskLabel } from '../useAuditTaskSelectOptions';
import { IInstanceAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

const mockT = ((key: string) => key) as TFunction;

const basePlan: IInstanceAuditPlanResV1 = {
  instance_audit_plan_id: 7,
  instance_name: 'tdsql-test',
  audit_plan_types: [
    {
      audit_plan_id: 1,
      type: 'mysql_schema_meta',
      desc: '库表元数据'
    },
    {
      audit_plan_id: 2,
      type: 'sql_file',
      desc: 'SQL文件'
    }
  ]
};

const sourceSelectOptions: SelectProps['options'] = [
  {
    label: 'group',
    options: [{ label: '库表元数据', value: 'mysql_schema_meta' }]
  }
];

describe('formatAuditTaskLabel', () => {
  it('formats label as instanceName-typeDesc (#id) when audit task type is selected', () => {
    expect(
      formatAuditTaskLabel(
        basePlan,
        'mysql_schema_meta',
        sourceSelectOptions,
        mockT
      )
    ).toBe('tdsql-test-库表元数据 (#7)');
  });

  it('uses first audit plan type desc when audit task type is not selected', () => {
    expect(
      formatAuditTaskLabel(basePlan, undefined, sourceSelectOptions, mockT)
    ).toBe('tdsql-test-库表元数据 (#7)');
  });

  it('falls back to static scan type i18n when instance_name is empty', () => {
    expect(
      formatAuditTaskLabel(
        {
          ...basePlan,
          instance_name: ''
        },
        'mysql_schema_meta',
        sourceSelectOptions,
        mockT
      )
    ).toBe('managementConf.list.table.column.staticScanType-库表元数据 (#7)');
  });

  it('falls back to old format when no type desc is available', () => {
    expect(
      formatAuditTaskLabel(
        {
          ...basePlan,
          audit_plan_types: []
        },
        undefined,
        sourceSelectOptions,
        mockT
      )
    ).toBe('tdsql-test (#7)');
  });

  it('resolves type desc from source select options when plan desc is missing', () => {
    expect(
      formatAuditTaskLabel(
        {
          ...basePlan,
          audit_plan_types: [{ audit_plan_id: 1, type: 'mysql_schema_meta' }]
        },
        'mysql_schema_meta',
        sourceSelectOptions,
        mockT
      )
    ).toBe('tdsql-test-库表元数据 (#7)');
  });
});
