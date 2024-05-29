import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import Operation from '.';
import { getBySelector } from '~/testUtil/customQuery';
import auth from '~/testUtil/mockApi/auth';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';

describe('Data/Operation', () => {
  let listOperationSetsSpy: jest.SpyInstance;
  beforeEach(() => {
    listOperationSetsSpy = auth.listOperationSets();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  it('should match snapshot', async () => {
    const { container } = superRender(<Operation />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('权限组');
    expect(container).toMatchSnapshot();
  });

  it('should refresh table when user click refresh button', async () => {
    const { container } = superRender(<Operation />);
    await screen.findByText('权限组');
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listOperationSetsSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(getBySelector('.custom-icon-refresh'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();
    expect(listOperationSetsSpy).toHaveBeenCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('should refresh table when user change search input value', async () => {
    superRender(<Operation />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(listOperationSetsSpy).toHaveBeenCalledTimes(1);

    fireEvent.change(getBySelector('#actiontech-table-search-input'), {
      target: { value: 'text' }
    });

    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => {
      fireEvent.keyDown(getBySelector('#actiontech-table-search-input'), {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });

    expect(listOperationSetsSpy).toHaveBeenCalledTimes(2);
    expect(listOperationSetsSpy).toHaveBeenNthCalledWith(2, {
      keyword: 'text',
      page_index: 1,
      page_size: 20
    });
  });
});
