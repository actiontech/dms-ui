import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import useRuleExceptionActions from '../useRuleExceptionActions';
import blacklist from '../../../testUtils/mockApi/blacklist';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  mockCurrentUserReturn,
  mockProjectInfo
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  CreateBlacklistReqV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { RULE_EXCEPTION_CONFLICT_CODE } from '../../../page/RuleException/index.type';
import { storeFactory } from '../../../testUtils/mockRedux';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderUseRuleExceptionActions = (
  options?: Parameters<typeof useRuleExceptionActions>[0]
) => {
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MemoryRouter>
      <Provider store={storeFactory()}>{children}</Provider>
    </MemoryRouter>
  );
  return renderHook(() => useRuleExceptionActions(options), { wrapper });
};

describe('sqle/components/RuleException/useRuleExceptionActions', () => {
  const sqlManageContext = {
    sql_fingerprint: 'select * from orders where id = ?',
    source: {
      sql_source_type: 'mysql_slow_log',
      sql_source_ids: ['100']
    }
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser({
      isAdmin: true,
      isProjectManager: jest.fn().mockReturnValue(true)
    });
    mockNavigate.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates blacklist with assembled payload from sql manage context', async () => {
    const createSpy = blacklist.createBlacklist();
    const onSuccess = jest.fn();
    const { result } = renderUseRuleExceptionActions({
      sqlManageContext,
      onSuccess
    });

    await act(async () => {
      await result.current.addRuleException(
        'dml_check_where_is_invalid',
        'note'
      );
    });

    expect(createSpy).toHaveBeenCalledWith({
      type: CreateBlacklistReqV1TypeEnum.fp_sql,
      content: sqlManageContext.sql_fingerprint,
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.audit_task_type,
          content: 'mysql_slow_log'
        },
        {
          type: MatchConditionReqV1TypeEnum.audit_task_id,
          content: '100'
        }
      ],
      rule_scope: ['dml_check_where_is_invalid'],
      desc: 'note',
      project_name: mockProjectInfo.projectName
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('does not add db_type to match_conditions when context has db_type', async () => {
    const createSpy = blacklist.createBlacklist();
    const { result } = renderUseRuleExceptionActions({
      sqlManageContext: {
        ...sqlManageContext,
        db_type: 'PostgreSQL'
      }
    });

    await act(async () => {
      await result.current.addRuleException(
        'dml_check_where_is_invalid',
        'note'
      );
    });

    expect(createSpy).toHaveBeenCalledWith({
      type: CreateBlacklistReqV1TypeEnum.fp_sql,
      content: sqlManageContext.sql_fingerprint,
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.audit_task_type,
          content: 'mysql_slow_log'
        },
        {
          type: MatchConditionReqV1TypeEnum.audit_task_id,
          content: '100'
        }
      ],
      rule_scope: ['dml_check_where_is_invalid'],
      desc: 'note',
      project_name: mockProjectInfo.projectName
    });
  });

  it('navigates to exception detail when create returns conflict code 4012', async () => {
    const createSpy = blacklist.createBlacklist();
    createSpy.mockImplementation(() =>
      createSpySuccessResponse({
        code: RULE_EXCEPTION_CONFLICT_CODE,
        message: 'blacklist already exists, id=42'
      })
    );

    const { result } = renderUseRuleExceptionActions({ sqlManageContext });

    await act(async () => {
      await result.current.addRuleException('dml_check_where_is_invalid');
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      `/sqle/project/${mockProjectInfo.projectID}/sql-management-exception?blacklist_id=42`
    );
  });

  it('deletes blacklist by exception_id', async () => {
    const deleteSpy = blacklist.deleteBlackList();
    const onSuccess = jest.fn();
    const { result } = renderUseRuleExceptionActions({
      sqlManageContext,
      onSuccess
    });

    await act(async () => {
      await result.current.removeRuleException(42);
    });

    expect(deleteSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      blacklist_id: '42'
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('does not call API when user lacks write permission', async () => {
    mockUseCurrentUser({
      ...mockCurrentUserReturn,
      isAdmin: false,
      isProjectManager: jest.fn().mockReturnValue(false)
    });
    const createSpy = blacklist.createBlacklist();
    const deleteSpy = blacklist.deleteBlackList();
    const { result } = renderUseRuleExceptionActions({ sqlManageContext });

    await act(async () => {
      await result.current.addRuleException('rule_name');
      await result.current.removeRuleException(42);
    });

    expect(createSpy).not.toHaveBeenCalled();
    expect(deleteSpy).not.toHaveBeenCalled();
  });
});
