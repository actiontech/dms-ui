import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { superRender } from '../../testUtil/customRender';
import BasicDrawer from './BasicDrawer';
import { BasicDrawerProps } from './BasicDrawer.types';

describe('lib/BasicDrawer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });
  const customRender = (params: BasicDrawerProps) => {
    return superRender(<BasicDrawer {...params} />);
  };

  it('should match snapshot', () => {
    const { baseElement } = customRender({
      title: '抽屉一',
      children: '默认的抽屉',
      open: true,
      footer: <>底部</>
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('should render drawer with default size', async () => {
    const { baseElement } = customRender({
      size: 'default',
      title: '抽屉一',
      children: '默认的抽屉',
      open: true,
      footer: <>底部</>
    });
    await act(async () => {
      await jest.advanceTimersByTime(300);
    });
    expect(screen.getByText('抽屉一')).toBeInTheDocument();
    expect(screen.getByText('默认的抽屉')).toBeInTheDocument();
    expect(screen.getByText('底部')).toBeInTheDocument();
    const drawerContent = baseElement.querySelector(
      '.ant-drawer-content-wrapper'
    );
    expect(drawerContent).toBeInTheDocument();
    expect(drawerContent).toHaveAttribute(
      'style',
      expect.stringContaining('width: 480px')
    );
  });

  it('should render drawer with no padding', async () => {
    const { baseElement } = customRender({
      title: '抽屉二',
      children: '默认的抽屉',
      noBodyPadding: true,
      open: true,
      footer: <>底部</>
    });
    await act(async () => {
      await jest.advanceTimersByTime(300);
    });
    const drawerWrapper = baseElement.querySelector(
      '.drawer-wrapper-no-padding'
    );
    expect(drawerWrapper).toBeInTheDocument();
    expect(screen.getByText('抽屉二')).toBeInTheDocument();
  });

  it('should render drawer with close icon and handle close event', async () => {
    const onCloseFn = jest.fn();
    customRender({
      size: 'large',
      title: '抽屉三',
      placement: 'right',
      children: '默认的抽屉',
      showClosedIcon: true,
      open: true,
      footer: <>底部</>,
      onClose: onCloseFn
    });

    const closeIcon = screen.getByTestId('basic-drawer-close-icon');
    expect(closeIcon).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(closeIcon);
      await jest.advanceTimersByTime(300);
    });
    expect(onCloseFn).toHaveBeenCalledTimes(1);
  });

  it('should render drawer with custom width', async () => {
    const { baseElement } = customRender({
      width: 600,
      title: '自定义宽度抽屉',
      children: '内容',
      open: true
    });
    await act(async () => {
      await jest.advanceTimersByTime(300);
    });
    const drawerContent = baseElement.querySelector(
      '.ant-drawer-content-wrapper'
    );
    expect(drawerContent).toBeInTheDocument();
    expect(drawerContent).toHaveAttribute(
      'style',
      expect.stringContaining('width: 600px')
    );
  });
});
