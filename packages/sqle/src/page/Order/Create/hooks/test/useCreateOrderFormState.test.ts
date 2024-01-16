import { renderHook, act } from '@testing-library/react';

import useCreateOrderFormState from '../useCreateOrderFormState';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('sqle/Order/Create/hooks/useCreateOrderFormState', () => {
  const customRender = () => {
    return renderHook(() => useCreateOrderFormState());
  };

  it('render schemaList', async () => {
    const { result } = customRender();
    expect(result.current.schemaList).toMatchSnapshot();
    await act(async () => {
      result.current.setSchemaList(new Map([[0, ['schema1']]]));
    });
    expect(result.current.schemaList).toMatchSnapshot();
  });

  it('render ruleTemplates', async () => {
    const { result } = customRender();
    expect(result.current.ruleTemplates).toMatchSnapshot();
    await act(async () => {
      result.current.setRuleTemplates(new Map([[0, { dbType: 'dbType1' }]]));
    });
    expect(result.current.ruleTemplates).toMatchSnapshot();
  });

  it('render changeSqlModeDisabled', async () => {
    const { result } = customRender();
    expect(result.current.changeSqlModeDisabled).toBeFalsy();
    await act(async () => {
      result.current.setChangeSqlModeDisabled(true);
    });
    expect(result.current.changeSqlModeDisabled).toBeTruthy();
  });

  it('render currentSqlMode', async () => {
    const { result } = customRender();
    expect(result.current.currentSqlMode).toBe(WorkflowResV2ModeEnum.same_sqls);
    await act(async () => {
      result.current.setCurrentSqlMode(WorkflowResV2ModeEnum.different_sqls);
    });
    expect(result.current.currentSqlMode).toBe(
      WorkflowResV2ModeEnum.different_sqls
    );
  });

  it('render instanceInfo', async () => {
    const { result } = customRender();
    expect(result.current.instanceInfo).toMatchSnapshot();
    await act(async () => {
      result.current.setInstanceInfo(
        new Map([[0, { instanceName: 'instance name 1' }]])
      );
    });
    expect(result.current.instanceInfo).toMatchSnapshot();
  });

  it('render auditLoading', async () => {
    const { result } = customRender();
    expect(result.current.auditLoading).toBeFalsy();
    await act(async () => {
      result.current.startAudit();
    });
    expect(result.current.auditLoading).toBeTruthy();
    await act(async () => {
      result.current.finishAudit();
    });
    expect(result.current.auditLoading).toBeFalsy();
  });
});
