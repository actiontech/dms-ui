import { getBySelector } from '../../testUtil/customQuery';
import { superRender } from '../../testUtil/superRender';
import CopyIcon from './CopyIcon';
import Copy from '../../utils/Copy';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
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
    return superRender(<CopyIcon {...params} />);
  };

  it('should render basic ui', () => {
    const { container } = customRender({
      text: 'sql ss'
    });
    expect(container).toMatchSnapshot();
  });

  it('should handle copy text correctly', async () => {
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

    await act(async () => {
      fireEvent.mouseOver(getBySelector('.anticon-check', baseElement));
      await jest.advanceTimersByTime(300);
    });
    expect(screen.getByText('复制成功')).toBeInTheDocument();
    mockCopyTextByTextarea.mockRestore();
  });

  it('should handle custom copy function', async () => {
    const onCustomCopyFn = jest.fn();
    const onCopyCompleteFn = jest.fn();
    const { baseElement } = customRender({
      text: 'test',
      onCustomCopy: onCustomCopyFn,
      onCopyComplete: onCopyCompleteFn
    });

    const copyEle = getBySelector('.anticon-copy', baseElement);
    await act(async () => {
      fireEvent.click(copyEle);
      await jest.advanceTimersByTime(300);
    });
    expect(onCustomCopyFn).toHaveBeenCalledTimes(1);
    expect(onCopyCompleteFn).toHaveBeenCalledTimes(1);
  });

  it('should handle custom tooltips', async () => {
    const { baseElement } = customRender({
      text: 'test',
      tooltips: '自定义提示'
    });

    const copyEle = getBySelector('.anticon-copy', baseElement);
    await act(async () => {
      fireEvent.click(copyEle);
      await jest.advanceTimersByTime(300);
    });

    await act(async () => {
      fireEvent.mouseOver(getBySelector('.anticon-check', baseElement));
      await jest.advanceTimersByTime(300);
    });
    expect(screen.getByText('自定义提示')).toBeInTheDocument();
  });
});
