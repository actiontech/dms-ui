import { cleanup, fireEvent, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { EventEmitterKey } from '~/data/enum';
import { getBySelector } from '~/testUtil/customQuery';
import { superRender } from '~/testUtil/customRender';
import auth from '~/testUtil/mockApi/auth';
import EventEmitter from '~/utils/EventEmitter';
import ExternalDataSource from '.';

describe('Data/ExternalDataSource', () => {
  let listDataObjectSourcesSpy: jest.SpyInstance;
  beforeEach(() => {
    listDataObjectSourcesSpy = auth.listDataObjectSources();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  it('should match snapshot', async () => {
    const { container } = superRender(<ExternalDataSource />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('10.186.62.27');
    expect(container).toMatchSnapshot();
  });

  it('should refresh table when user click refresh button', async () => {
    const { container } = superRender(<ExternalDataSource />);
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('10.186.62.27');
    expect(listDataObjectSourcesSpy).toBeCalledTimes(1);

    fireEvent.click(screen.getByTestId('refresh'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(listDataObjectSourcesSpy).toBeCalledTimes(2);
    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it("should refresh table when eventEmitter receive 'Refresh_External_Data_Source_List_Table' message", async () => {
    const { container } = superRender(<ExternalDataSource />);
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('10.186.62.27');
    expect(listDataObjectSourcesSpy).toBeCalledTimes(1);

    await act(() => {
      EventEmitter.emit(
        EventEmitterKey.Refresh_External_Data_Source_List_Table
      );
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(listDataObjectSourcesSpy).toBeCalledTimes(2);
    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});
