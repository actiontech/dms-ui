import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import useStaticStatus from './useStaticStatus';
import {
  GetSqlManageListV2FilterAuditLevelEnum,
  GetSqlManageListV2FilterSourceEnum
} from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';

describe('SqlManagement/useStaticStatus', () => {
  it('render select options', async () => {
    const { result } = renderHooksWithTheme(() => useStaticStatus());
    expect(result.current.generateSourceSelectOptions.length).toBe(2);
    expect(result.current.generateSourceSelectOptions[0].value).toBe(
      GetSqlManageListV2FilterSourceEnum.sql_audit_record
    );
    expect(result.current.generateSourceSelectOptions[0].label).toBe('SQL审核');
    expect(result.current.generateAuditLevelSelectOptions.length).toBe(4);
    expect(result.current.generateAuditLevelSelectOptions[0].value).toBe(
      GetSqlManageListV2FilterAuditLevelEnum.normal
    );
    expect(result.current.generateAuditLevelSelectOptions[0].label).toBe(
      '普通'
    );
  });
});
