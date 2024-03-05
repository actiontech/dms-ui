import ChartWrapper, { IChartWrapper } from '.';

import { renderWithTheme } from '../../../testUtils/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';

describe('sqle/components/ChartCom/ChartWrapper', () => {
  const customRender = (params: IChartWrapper) => {
    return renderWithTheme(<ChartWrapper {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render error snap when loading is true', () => {
    const { baseElement } = customRender({
      loading: true,
      children: <span>child node</span>,
      emptyCont: 'empty cont text',
      errorInfo: 'error info text'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render error snap when dataLength is 0', () => {
    const { baseElement } = customRender({
      loading: false,
      dataLength: 0,
      children: <span>child node</span>
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render error snap when has error text', async () => {
    const onRefreshFn = jest.fn();
    const { baseElement } = customRender({
      loading: false,
      errorInfo: 'has error text',
      children: <span>child node</span>,
      onRefresh: onRefreshFn
    });
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(onRefreshFn).toHaveBeenCalled();
    onRefreshFn.mockRestore();
  });
});
