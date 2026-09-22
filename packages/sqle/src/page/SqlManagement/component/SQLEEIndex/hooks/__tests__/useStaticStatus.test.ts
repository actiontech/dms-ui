import { renderHooksWithRedux } from '../../../../../../testUtils/customRender';
import useStaticStatus from '../useStaticStatus';
import {
  GetSqlManageListV2FilterAuditLevelEnum,
  GetSqlManageListV2FilterSourceEnum
} from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';

describe('SqlManagement/useStaticStatus', () => {
  it('render select options', async () => {
    const { result } = renderHooksWithRedux(() => useStaticStatus());
    expect(result.current.generateAuditLevelSelectOptions.length).toBe(5);
    expect(result.current.generateAuditLevelSelectOptions[0].value).toBe(
      GetSqlManageListV2FilterAuditLevelEnum.normal
    );
    expect(result.current.generateAuditLevelSelectOptions[0].label).toBe(
      '普通'
    );
    expect(result.current.generateAuditLevelSelectOptions[3].value).toBe(
      'error_P0'
    );
    expect(result.current.generateAuditLevelSelectOptions[4].value).toBe(
      'error_P1'
    );
  });
});
