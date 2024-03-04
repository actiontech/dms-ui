import BasicEmpty, { IEmptyStyleWrapperProps } from '.';
import { getBySelector } from '../../testUtil/customQuery';

import { renderWithTheme } from '../../testUtil/customRender';
import { fireEvent, act, cleanup } from '@testing-library/react';

describe('lib/BasicEmpty', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });
  const customRender = (params: IEmptyStyleWrapperProps) => {
    return renderWithTheme(<BasicEmpty {...params} />);
  };

  it('render loading ui', () => {
    const { container } = customRender({
      loading: true
    });

    expect(container).toMatchSnapshot();
  });

  it('render error ui', () => {
    const { container } = customRender({
      loading: false,
      errorInfo: '错误信息是字符串'
    });
    expect(container).toMatchSnapshot();

    const { container: container1 } = customRender({
      loading: false,
      errorTitle: '错误大标题',
      errorInfo: ['error', 'error1']
    });
    expect(container1).toMatchSnapshot();

    const { container: container3 } = customRender({
      loading: false,
      errorTitle: '错误大标题',
      errorInfo: <>我是一个错误信息</>
    });
    expect(container3).toMatchSnapshot();
  });

  it('render empty ui', () => {
    const { container } = customRender({
      loading: false,
      dataLength: 0
    });
    expect(container).toMatchSnapshot();

    const { container: container1 } = customRender({
      loading: false,
      dataLength: 0,
      emptyCont: '自定义空数据的提示'
    });
    expect(container1).toMatchSnapshot();
  });

  it('render has refresh icon', async () => {
    const onRefreshFn = jest.fn();
    const { container, baseElement } = customRender({
      loading: false,
      dataLength: 0,
      onRefresh: onRefreshFn
    });
    expect(container).toMatchSnapshot();

    const refreshBtn = getBySelector('.ant-empty-footer .ant-btn', baseElement);
    await act(async () => {
      fireEvent.click(refreshBtn);
      await jest.advanceTimersByTime(300);
    });
    expect(onRefreshFn).toHaveBeenCalledTimes(1);
  });
});
