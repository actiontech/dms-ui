import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import SkippedRuleExceptionTable from '..';
import blacklist from '../../../../testUtils/mockApi/blacklist';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('../../../../hooks/useRuleTips', () => ({
  __esModule: true,
  default: () => ({
    updateRuleTips: jest.fn(),
    ruleNameDescMap: new Map()
  })
}));

describe('sqle/components/RuleException/SkippedRuleExceptionTable', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser({
      isAdmin: true,
      isProjectManager: jest.fn().mockReturnValue(true)
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
    jest.clearAllMocks();
  });

  it('calls deleteBlackList with exception_id when cancel is clicked', async () => {
    const deleteSpy = blacklist.deleteBlackList();
    const onRefresh = jest.fn();
    superRender(
      <SkippedRuleExceptionTable
        dataSource={[
          {
            rule_name: 'rule_a',
            level: 'warn',
            message: 'msg',
            exception_id: 42
          }
        ]}
        sqlManageContext={{
          sql_fingerprint: 'select 1'
        }}
        onRefresh={onRefresh}
      />
    );

    fireEvent.click(screen.getByText('取消例外'));
    await act(async () => jest.advanceTimersByTime(3300));

    expect(deleteSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      blacklist_id: '42'
    });
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
