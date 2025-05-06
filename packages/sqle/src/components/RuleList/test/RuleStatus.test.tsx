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

  it('should render custom label when options.renderLabel is provided', async () => {
    const customLabel = {
      [RuleStatusEnum.disabled]: 'disabled',
      [RuleStatusEnum.enabled]: 'enabled'
    };
    const renderLabel = (label: string, status: RuleStatusEnum) =>
      `${customLabel[status]} - ${label}`;

    const { baseElement } = renderWithTheme(
      <RuleStatus
        currentRuleStatus={RuleStatusEnum.enabled}
        options={{ renderLabel }}
      />
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText(`${customLabel[RuleStatusEnum.enabled]} - 已启用`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${customLabel[RuleStatusEnum.disabled]} - 已禁用`)
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});
