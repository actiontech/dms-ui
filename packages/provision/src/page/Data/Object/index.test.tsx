import { cleanup, fireEvent, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { EventEmitterKey, ModalName } from '~/data/enum';
import { DataObjectModalStatus } from '~/store/data/object';
import { getBySelector } from '~/testUtil/customQuery';
import { superRender } from '~/testUtil/customRender';
import auth from '~/testUtil/mockApi/auth';
import { instanceList } from '~/testUtil/mockApi/auth/data';
import RecoilObservable from '~/testUtil/RecoilObservable';
import EventEmitter from '~/utils/EventEmitter';
import DataObject from '.';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('Data/Object', () => {
  let listServicesSpy: jest.SpyInstance;
  let getUsersFromDBServiceSpy: jest.SpyInstance;
  beforeEach(() => {
    listServicesSpy = auth.listServices();
    getUsersFromDBServiceSpy = auth.getUsersFromDBService();
    jest.useFakeTimers();
    mockUseCurrentProject();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  it('should match snapshot', async () => {
    const { container } = superRender(<DataObject />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('Julian Lueilwitz');
    expect(container).toMatchSnapshot();
  });

  it('should refresh table when user click refresh button', async () => {
    listServicesSpy.mockClear();
    listServicesSpy.mockImplementation(() =>
      createSpySuccessResponse({
        total: 20,
        services: instanceList.slice(-2)
      })
    );
    const { container } = superRender(<DataObject />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listServicesSpy).toBeCalledTimes(1);

    await act(() => fireEvent.click(screen.getByTestId('refresh')));
    expect(listServicesSpy).toBeCalledTimes(2);
    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('should init modal status when page init', async () => {
    const dataObjectModalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <DataObject />
        <RecoilObservable
          state={DataObjectModalStatus}
          onChange={dataObjectModalStatusChangeSpy}
        />
      </>
    );
    expect(dataObjectModalStatusChangeSpy).toBeCalledTimes(1);
    expect(dataObjectModalStatusChangeSpy).toBeCalledWith({
      [ModalName.ViewAccount]: false
    });
  });

  it("should refresh table when eventEmitter receive 'Refresh_Data_Object_List_Table' message", async () => {
    listServicesSpy.mockClear();
    listServicesSpy.mockImplementation(() =>
      createSpySuccessResponse({
        total: 20,
        services: instanceList.slice(-2)
      })
    );
    const { container } = superRender(<DataObject />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listServicesSpy).toBeCalledTimes(1);

    await act(() => {
      EventEmitter.emit(EventEmitterKey.Refresh_Data_Object_List_Table);
    });
    expect(listServicesSpy).toBeCalledTimes(2);
    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it("should open 'view_account' modal when user click view account button", async () => {
    const dataObjectModalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <DataObject />
        <RecoilObservable
          state={DataObjectModalStatus}
          onChange={dataObjectModalStatusChangeSpy}
        />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('Julian Lueilwitz');

    await act(() => fireEvent.click(screen.getAllByText('查看账号')[0]));
    await act(async () => jest.advanceTimersByTime(100));

    expect(dataObjectModalStatusChangeSpy).toBeCalledTimes(2);
    expect(dataObjectModalStatusChangeSpy).nthCalledWith(2, {
      [ModalName.ViewAccount]: true
    });
  });

  it('the table should be filtered when url params is not empty', async () => {
    superRender(
      <DataObject />,
      {},
      {
        routerProps: {
          initialEntries: ['/data/object?address=10.186.62.9:33061']
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listServicesSpy).toBeCalledWith({
      page_index: 1,
      page_size: 20,
      filter_by_address: '10.186.62.9:33061',
      filter_by_namespace: mockProjectInfo.projectID
    });
  });
});
