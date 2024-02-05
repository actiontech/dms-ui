import RuleStatus from '../RuleStatus';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../../testUtils/customRender';
import { RuleStatusEnum } from '../index.type';

describe('sqle/components/RuleStatus', () => {
  const ruleStatusChangeSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot when enabled', async () => {
    const { baseElement } = renderWithTheme(
      <RuleStatus currentRuleStatus={RuleStatusEnum.enabled} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snap shot when disabled', async () => {
    const { baseElement } = renderWithTheme(
      <RuleStatus currentRuleStatus={RuleStatusEnum.disabled} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snap shot when has ruleStatusChange', async () => {
    const { baseElement } = renderWithTheme(
      <RuleStatus
        currentRuleStatus={RuleStatusEnum.disabled}
        ruleStatusChange={ruleStatusChangeSpy}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('已启用'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();
  });
});
