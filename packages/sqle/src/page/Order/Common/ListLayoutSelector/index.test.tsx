import ListLayoutSelector from '.';
import { ListLayoutEnum } from './index.types';

import { renderWithTheme } from '../../../../testUtils/customRender';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';

describe('sqle/Order/Common/ListLayoutSelector', () => {
  const onChangeFn = jest.fn();

  const customRender = (value: ListLayoutEnum) => {
    return renderWithTheme(
      <ListLayoutSelector onChange={onChangeFn} value={value} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when show pagination btn', () => {
    const { baseElement } = customRender(ListLayoutEnum.pagination);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when show scroll btn', () => {
    const { baseElement } = customRender(ListLayoutEnum.scroll);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click pagination btn', async () => {
    const { baseElement } = customRender(ListLayoutEnum.pagination);

    expect(screen.getByText('分页展示')).toBeInTheDocument();
    fireEvent.click(screen.getByText('分页展示'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('瀑布流展示')).toBeInTheDocument();
    fireEvent.click(screen.getByText('瀑布流展示'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(onChangeFn).toBeCalled();
    expect(onChangeFn).toBeCalledWith(ListLayoutEnum.scroll);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click scroll btn', async () => {
    const { baseElement } = customRender(ListLayoutEnum.scroll);

    expect(screen.getByText('瀑布流展示')).toBeInTheDocument();
    fireEvent.click(screen.getByText('瀑布流展示'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('分页展示')).toBeInTheDocument();
    fireEvent.click(screen.getByText('分页展示'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(onChangeFn).toBeCalled();
    expect(onChangeFn).toBeCalledWith(ListLayoutEnum.pagination);
    expect(baseElement).toMatchSnapshot();
  });
});
