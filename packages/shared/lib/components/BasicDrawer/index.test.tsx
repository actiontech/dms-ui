import BasicDrawer, { BasicDrawerProps } from '.';

import { fireEvent, act, cleanup } from '@testing-library/react';
import { renderWithTheme } from '../../testUtil/customRender';
import { getBySelector } from '../../testUtil/customQuery';

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
    return renderWithTheme(<BasicDrawer {...params} />);
  };

  it('render init drawer', () => {
    const { baseElement } = customRender({
      size: 'default',
      title: '抽屉一',
      children: '默认的抽屉',
      open: true,
      footer: <>底部</>
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render no padding & big size drawer', () => {
    const { baseElement } = customRender({
      title: '抽屉二',
      children: '默认的抽屉',
      noBodyPadding: true,
      open: true,
      footer: <>底部</>
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render show closed icon drawer', async () => {
    const onCloseFn = jest.fn();
    const { baseElement } = customRender({
      size: 'large',
      title: '抽屉三',
      placement: 'right',
      children: '默认的抽屉',
      showClosedIcon: true,
      open: true,
      footer: <>底部</>,
      onClose: onCloseFn
    });
    expect(baseElement).toMatchSnapshot();

    const closedIcon = getBySelector('.closed-icon-custom', baseElement);
    await act(async () => {
      fireEvent.click(closedIcon);
      await jest.advanceTimersByTime(300);
    });
    expect(onCloseFn).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });
});
