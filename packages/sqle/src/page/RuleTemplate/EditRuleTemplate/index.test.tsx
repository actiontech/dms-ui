import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithThemeAndRedux } from '../../../testUtils/customRender';
import EditRuleTemplate from '.';
import { ruleListMockData } from '../../../testUtils/mockApi/rule_template/data';

describe('sqle/RuleTemplate/EditRuleTemplate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const closeSpy = jest.fn();
    const submitSpy = jest.fn();
    const { baseElement } = renderWithThemeAndRedux(
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
    expect(submitSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getByText('取 消'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(closeSpy).toBeCalledTimes(1);
  });
});
