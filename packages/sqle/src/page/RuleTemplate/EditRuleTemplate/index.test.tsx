import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { sqleSuperRender } from '../../../testUtils/superRender';
import EditRuleTemplate from '.';
import { ruleListMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template/data';
import { RuleParamResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

describe('sqle/RuleTemplate/EditRuleTemplate', () => {
  const closeSpy = jest.fn();
  const submitSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    mockUsePermission(undefined, {
      useSpyOnMockHooks: true
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { baseElement } = sqleSuperRender(
      <EditRuleTemplate
        visible
        title="编辑规则"
        dataSource={ruleListMockData[0]}
        onClosed={closeSpy}
        onSubmit={submitSpy}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(submitSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('取 消'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('when dataSource is empty object', async () => {
    const { baseElement } = sqleSuperRender(
      <EditRuleTemplate
        visible
        title="编辑规则"
        dataSource={{}}
        onClosed={closeSpy}
        onSubmit={submitSpy}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('when param type is boolean', async () => {
    const { baseElement } = sqleSuperRender(
      <EditRuleTemplate
        visible
        title="编辑规则"
        dataSource={{
          ...ruleListMockData[0],
          params: [
            {
              key: 'first_key_test',
              value: 'true',
              desc: 'test',
              type: RuleParamResV1TypeEnum.bool
            }
          ]
        }}
        onClosed={closeSpy}
        onSubmit={submitSpy}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(submitSpy).toHaveBeenCalledTimes(1);
  });
});
