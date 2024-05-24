import ListLayoutSelector from '..';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { TaskResultListLayoutEnum } from '../../index.enum';
import { superRender } from '../../../../../../../testUtils/customRender';

describe('sqle/ExecWorkflow/Detail/Common/ListLayoutSelector', () => {
  const onChangeFn = jest.fn();

  const customRender = (value: TaskResultListLayoutEnum) => {
    return superRender(
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
    const { baseElement } = customRender(TaskResultListLayoutEnum.pagination);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when show scroll btn', () => {
    const { baseElement } = customRender(TaskResultListLayoutEnum.scroll);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click pagination btn', async () => {
    const { baseElement } = customRender(TaskResultListLayoutEnum.pagination);

    expect(screen.getByText('分页展示')).toBeInTheDocument();
    fireEvent.click(screen.getByText('分页展示'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('瀑布流展示')).toBeInTheDocument();
    fireEvent.click(screen.getByText('瀑布流展示'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(onChangeFn).toHaveBeenCalled();
    expect(onChangeFn).toHaveBeenCalledWith(TaskResultListLayoutEnum.scroll);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click scroll btn', async () => {
    const { baseElement } = customRender(TaskResultListLayoutEnum.scroll);

    expect(screen.getByText('瀑布流展示')).toBeInTheDocument();
    fireEvent.click(screen.getByText('瀑布流展示'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('分页展示')).toBeInTheDocument();
    fireEvent.click(screen.getByText('分页展示'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(onChangeFn).toHaveBeenCalled();
    expect(onChangeFn).toHaveBeenCalledWith(
      TaskResultListLayoutEnum.pagination
    );
    expect(baseElement).toMatchSnapshot();
  });
});
