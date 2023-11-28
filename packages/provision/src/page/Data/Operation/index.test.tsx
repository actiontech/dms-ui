import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import Operation from '.';
import { superRender } from '~/testUtil/customRender';
import { getBySelector } from '~/testUtil/customQuery';
import auth from '~/testUtil/mockApi/auth';

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
    expect(listOperationSetsSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getByTestId('refresh'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();
    expect(listOperationSetsSpy).toBeCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});
