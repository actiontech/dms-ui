import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import useTableRedux from './useTableRedux';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import sqlManage from '../../../../../testUtils/mockApi/sqlManage';
import { act, cleanup } from '@testing-library/react';
import { sqlManageListData } from '../../../../../testUtils/mockApi/sqlManage/data';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('SqlManagement/useTableRedux', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        sqleManagement: {
          modalStatus: {
            test: true
          },
          selectSqlIdList: null,
          selectSqleManagement: null
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
    const { result } = renderHooksWithTheme(() => useTableRedux('test'));
    expect(result.current.open).toBe(true);
    expect(result.current.selectedSqlIdList).toBe(null);
    expect(result.current.selectedSqleManagement).toBe(null);
  });

  it('init modal status', async () => {
    const { result } = renderHooksWithTheme(() => useTableRedux());
    await act(async () => {
      result.current.initModalStatus({ test: true });
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'sqleManagement/initModalStatus',
      payload: {
        modalStatus: {
          test: true
        }
      }
    });
  });

  it('set select data', async () => {
    const { result } = renderHooksWithTheme(() => useTableRedux());
    await act(async () => {
      result.current.setSelectData(sqlManageListData?.data[0] as ISqlManage);
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'sqleManagement/updateSqleManagement',
      payload: sqlManageListData?.data[0] as ISqlManage
    });
  });

  it('update modal status', async () => {
    const { result } = renderHooksWithTheme(() => useTableRedux());
    await act(async () => {
      result.current.updateModalStatus('test', true);
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'sqleManagement/updateModalStatus',
      payload: {
        modalName: 'test',
        status: true
      }
    });
  });

  it('update sql id list', async () => {
    const { result } = renderHooksWithTheme(() => useTableRedux());
    await act(async () => {
      result.current.updateIdList(sqlManageListData.data as ISqlManage[]);
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'sqleManagement/updateSqlIdList',
      payload: sqlManageListData.data as ISqlManage[]
    });
  });
});
