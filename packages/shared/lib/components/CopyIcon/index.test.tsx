import { CopyIconProps } from '.';
import { getBySelector } from '../../testUtil/customQuery';
import { renderWithTheme } from '../../testUtil/customRender';
import CopyIcon from './CopyIcon';

import { fireEvent, act, cleanup } from '@testing-library/react';

describe('lib/CopyIcon', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: CopyIconProps) => {
    return renderWithTheme(<CopyIcon {...params} />);
  };

  it('should render ui snap for only text', () => {
    const { container } = customRender({
      text: 'sql ss'
    });

    expect(container).toMatchSnapshot();
  });

  it('should render ui snap for no tip', () => {
    const { container } = customRender({
      text: 'sql ss',
      tooltips: false
    });

    expect(container).toMatchSnapshot();
  });

  it('should render ui when click copy btn', async () => {
    const execCommandFn = jest.fn();
    document.execCommand = execCommandFn;
    const { container, baseElement } = customRender({
      text: 'sql ss'
    });

    const copyEle = getBySelector('.anticon-copy', baseElement);
    await act(async () => {
      fireEvent.click(copyEle);
      await jest.advanceTimersByTime(300);
    });
    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(execCommandFn).toHaveBeenCalledWith('copy');
    expect(execCommandFn).toBeCalledTimes(1);
    expect(container).toMatchSnapshot();
    execCommandFn.mockRestore();
  });
});
