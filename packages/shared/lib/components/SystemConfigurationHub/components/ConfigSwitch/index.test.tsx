import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import ConfigSwitch, { ConfigSwitchParams } from '.';
import Form from 'antd/es/form/Form';
import { renderWithTheme } from '../../../../testUtil/customRender';
import { getBySelector } from '../../../../testUtil/customQuery';

describe('base/System/components/ConfigSwitch', () => {
  const onConfirmFn = jest.fn();
  const onSwitchChangeFn = jest.fn();
  const onSwitchPopoverOpenFn = jest.fn();
  const customRender = (
    params: Omit<
      ConfigSwitchParams,
      'switchFieldName' | 'onConfirm' | 'onSwitchChange' | 'onSwitchPopoverOpen'
    >
  ) => {
    return renderWithTheme(
      <Form>
        <ConfigSwitch
          switchFieldName="enabled"
          onConfirm={onConfirmFn}
          onSwitchChange={onSwitchChangeFn}
          onSwitchPopoverOpen={onSwitchPopoverOpenFn}
          {...params}
        />
      </Form>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when switch disabled', () => {
    const { baseElement } = customRender({
      title: 'title',
      submitLoading: true,
      popoverVisible: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when title is false', () => {
    const { baseElement } = customRender({
      title: 'title',
      submitLoading: true,
      popoverVisible: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when confirm popover', async () => {
    customRender({
      title: '是否确认关闭当前配置？',
      submitLoading: false,
      popoverVisible: true
    });
    expect(screen.getByText('是否确认关闭当前配置？')).toBeInTheDocument();
    expect(screen.getByText('确 认')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(onConfirmFn).toHaveBeenCalled();
  });

  it('render snap when click switch', async () => {
    const { baseElement } = customRender({
      title: 'title',
      submitLoading: false,
      popoverVisible: false
    });

    const switchHandle = getBySelector('.ant-switch-handle', baseElement);
    fireEvent.click(switchHandle);
    await act(async () => jest.advanceTimersByTime(500));
    expect(onSwitchChangeFn).toHaveBeenCalled();
  });
});
