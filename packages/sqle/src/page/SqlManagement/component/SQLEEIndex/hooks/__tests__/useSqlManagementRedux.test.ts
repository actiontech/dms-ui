import useSqlManagementRedux from '../useSqlManagementRedux';
import { act, cleanup } from '@testing-library/react';
import { sqlManageListData } from '../../../../../../testUtils/mockApi/sqlManage/data';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { useDispatch, useSelector } from 'react-redux';
import { renderHooksWithRedux } from '../../../../../../testUtils/customRender';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('SqlManagement/useSqlManagementRedux', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        sqlManagement: {
          modalStatus: {
            test: true
          },
          batchSelectSqlManagement: null,
          selectSqlManagement: null
        }
      });
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('get redux data', async () => {
    const { result } = renderHooksWithRedux(() =>
      useSqlManagementRedux('test')
    );
    expect(result.current.open).toBe(true);
    expect(result.current.batchSelectSqlManagement).toBe(null);
    expect(result.current.selectSqlManagement).toBe(null);
  });

  it('init modal status', async () => {
    const { result } = renderHooksWithRedux(() => useSqlManagementRedux());
    await act(async () => {
      result.current.initModalStatus({ test: true });
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/initModalStatus',
      payload: {
        modalStatus: {
          test: true
        }
      }
    });
  });

  it('set select data', async () => {
    const { result } = renderHooksWithRedux(() => useSqlManagementRedux());
    await act(async () => {
      result.current.setSelectData(sqlManageListData?.data[0] as ISqlManage);
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementSelectData',
      payload: sqlManageListData?.data[0] as ISqlManage
    });
  });

  it('update modal status', async () => {
    const { result } = renderHooksWithRedux(() => useSqlManagementRedux());
    await act(async () => {
      result.current.updateModalStatus('test', true);
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: 'test',
        status: true
      }
    });
  });

  it('set batch select data', async () => {
    const { result } = renderHooksWithRedux(() => useSqlManagementRedux());
    await act(async () => {
      result.current.setBatchSelectData(sqlManageListData.data as ISqlManage[]);
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementBatchSelectData',
      payload: sqlManageListData.data as ISqlManage[]
    });
  });
});
