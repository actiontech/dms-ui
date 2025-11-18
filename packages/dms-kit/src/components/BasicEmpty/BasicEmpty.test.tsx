import { getBySelector } from '../../testUtil/customQuery';
import { superRender } from '../../testUtil/superRender';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import BasicEmpty from './BasicEmpty';
import { BasicEmptyProps } from './BasicEmpty.types';

describe('lib/BasicEmpty', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });
  const customRender = (params: BasicEmptyProps) => {
    return superRender(<BasicEmpty {...params} />);
  };

  it('should match snapshot', () => {
    const { container } = customRender({
      loading: false,
      dataLength: 0
    });
    expect(container).toMatchSnapshot();
  });

  it('render loading ui', () => {
    const { container } = customRender({
      loading: true
    });
    expect(container).toMatchSnapshot();
    expect(container.querySelector('.is-icon-loading')).toBeTruthy();
    expect(container.querySelector('.ant-spin')).toBeTruthy();
  });

  it('render error ui', () => {
    const { container } = customRender({
      loading: false,
      errorInfo: '错误信息是字符串'
    });
    expect(container).toMatchSnapshot();
    expect(container.querySelector('.is-icon-tips')).toBeTruthy();
    expect(container.querySelector('.no-data-cont')?.textContent).toBe(
      '错误信息是字符串'
    );

    const { container: container1 } = customRender({
      loading: false,
      errorTitle: '错误大标题',
      errorInfo: ['error', 'error1']
    });
    expect(container1).toMatchSnapshot();
    expect(container1.querySelector('.no-data-title')?.textContent).toBe(
      '错误大标题'
    );
    expect(container1.querySelector('.no-data-cont')?.textContent).toBe(
      '数据链接异常，请检查网络'
    );

    const { container: container3 } = customRender({
      loading: false,
      errorTitle: '错误大标题',
      errorInfo: <>我是一个错误信息</>
    });
    expect(container3).toMatchSnapshot();
    expect(container3.querySelector('.no-data-title')?.textContent).toBe(
      '错误大标题'
    );
  });

  it('render empty ui', () => {
    const { container } = customRender({
      loading: false,
      dataLength: 0
    });
    expect(container).toMatchSnapshot();
    expect(container.querySelector('.is-icon-tips')).toBeTruthy();
    expect(container.querySelector('.no-data-cont')?.textContent).toBe(
      '暂无数据'
    );

    const { container: container1 } = customRender({
      loading: false,
      dataLength: 0,
      emptyCont: '自定义空数据的提示'
    });
    expect(container1).toMatchSnapshot();
    expect(container1.querySelector('.no-data-cont')?.textContent).toBe(
      '自定义空数据的提示'
    );
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
    expect(refreshBtn.textContent).toBe('刷 新');
    await act(async () => {
      fireEvent.click(refreshBtn);
      await jest.advanceTimersByTime(300);
    });
    expect(onRefreshFn).toHaveBeenCalledTimes(1);
  });

  it('should render custom children content', () => {
    const { container } = customRender({
      loading: false,
      dataLength: 0,
      children: <div data-testid="custom-content">自定义内容</div>
    });
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByTestId('custom-content').textContent).toBe('自定义内容');
  });

  it('should not render refresh button when loading', () => {
    const onRefreshFn = jest.fn();
    const { container } = customRender({
      loading: true,
      dataLength: 0,
      onRefresh: onRefreshFn
    });
    expect(container.querySelector('.ant-empty-footer .ant-btn')).toBeNull();
  });
});
