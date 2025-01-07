import { getBySelector } from '../../testUtil/customQuery';
import { renderWithTheme } from '../../testUtil/customRender';
import CopyIcon from './CopyIcon';
import Copy from '../../utils/Copy';
import { fireEvent, act, cleanup } from '@testing-library/react';
import { CopyIconProps } from './CopyIcon.types';

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
    expect(execCommandFn).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
    execCommandFn.mockRestore();
  });

  it('should render more line text when click copy btn', async () => {
    const mockCopyTextByTextarea = jest.fn();
    jest
      .spyOn(Copy, 'copyTextByTextarea')
      .mockImplementation(mockCopyTextByTextarea);
    const textVal = 'sql select *\n from user_table\n left join users.id';
    const { baseElement } = customRender({
      text: textVal
    });

    const copyEle = getBySelector('.anticon-copy', baseElement);
    await act(async () => {
      fireEvent.click(copyEle);
      await jest.advanceTimersByTime(300);
    });
    expect(mockCopyTextByTextarea).toHaveBeenCalledTimes(1);
    expect(mockCopyTextByTextarea).toHaveBeenCalledWith(textVal);
    mockCopyTextByTextarea.mockRestore();
  });
});
