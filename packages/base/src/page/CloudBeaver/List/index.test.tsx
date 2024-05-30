import { superRender } from '../../../testUtils/customRender';
import CBOperationLogsList from '.';
import cloudBeaver from '../../../testUtils/mockApi/cloudBeaver';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import userCenter from '../../../testUtils/mockApi/userCenter';
import dbServices from '../../../testUtils/mockApi/dbServices';
import {
  getBySelector,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { useDispatch, useSelector } from 'react-redux';
import { driverMeta } from 'sqle/src/hooks/useDatabaseType/index.test.data';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { listCBOperationLogsMockData } from '../../../testUtils/mockApi/cloudBeaver/data';
import { ModalName } from '../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test base/CloudBeaver/List', () => {
  let listCBOperationLogsSpy: jest.SpyInstance;
  let exportCBOperationLogsSpy: jest.SpyInstance;
  let getCBOperationLogTipsSpy: jest.SpyInstance;
  let dbServiceTipsSpy: jest.SpyInstance;
  let memberTipsSpy: jest.SpyInstance;
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    listCBOperationLogsSpy = cloudBeaver.listCBOperationLogs();
    exportCBOperationLogsSpy = cloudBeaver.exportCBOperationLogs();
    getCBOperationLogTipsSpy = cloudBeaver.getCBOperationLogTips();
    memberTipsSpy = userCenter.getMemberTips();
    dbServiceTipsSpy = dbServices.ListDBServicesTips();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: driverMeta },
        cloudBeaver: {
          modalStatus: {}
        }
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  test('render init table', async () => {
    const { baseElement } = superRender(<CBOperationLogsList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(listCBOperationLogsSpy).toHaveBeenCalledTimes(1);
    expect(getCBOperationLogTipsSpy).toHaveBeenCalledTimes(1);
    expect(dbServiceTipsSpy).toHaveBeenCalledTimes(1);
    expect(memberTipsSpy).toHaveBeenCalledTimes(1);
  });

  test('render table when request return failed', async () => {
    listCBOperationLogsSpy.mockClear();
    listCBOperationLogsSpy.mockImplementation(() => createSpyFailResponse({}));
    const { baseElement } = superRender(<CBOperationLogsList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('filter data with search', async () => {
    const { baseElement } = superRender(<CBOperationLogsList />);
    expect(listCBOperationLogsSpy).toHaveBeenCalled();
    const searchText = 'search text';
    const inputEle = getBySelector('#actiontech-table-search-input');
    fireEvent.change(inputEle, {
      target: { value: searchText }
    });

    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listCBOperationLogsSpy).toHaveBeenCalledWith({
      fuzzy_keyword: searchText,
      page_index: 1,
      page_size: 20,
      project_uid: mockProjectInfo.projectID
    });

    fireEvent.click(screen.getByText('筛选'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
  });

  it('export file', async () => {
    superRender(<CBOperationLogsList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listCBOperationLogsSpy).toHaveBeenCalled();
    fireEvent.click(screen.getByText('导 出'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('正在导出SQL操作记录')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(exportCBOperationLogsSpy).toHaveBeenCalledTimes(1);
    expect(exportCBOperationLogsSpy).toHaveBeenNthCalledWith(
      1,
      {
        fuzzy_keyword: '',
        project_uid: mockProjectInfo.projectID
      },
      {
        responseType: 'blob'
      }
    );
  });

  it('click sql and open cloud beaver sql operation result', async () => {
    superRender(<CBOperationLogsList />);
    expect(listCBOperationLogsSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getAllByText('SELECT')).toHaveLength(2);
    fireEvent.click(screen.getAllByText('SELECT')[1]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'cloudBeaver/updateModalStatus',
      payload: {
        modalName: ModalName.Cloud_Beaver_Sql_Operation_Audit_Detail,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'cloudBeaver/updateCBSqlOperationRecord',
      payload: {
        cbSqlOperationRecord: listCBOperationLogsMockData[1]
      }
    });
  });

  it('click audit result and open cloud beaver sql operation result', async () => {
    superRender(<CBOperationLogsList />);
    expect(listCBOperationLogsSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllBySelector('.audit-result-wrapper')).toHaveLength(2);
    fireEvent.click(getAllBySelector('.audit-result-wrapper')[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'cloudBeaver/updateModalStatus',
      payload: {
        modalName: ModalName.Cloud_Beaver_Sql_Operation_Audit_Detail,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'cloudBeaver/updateCBSqlOperationRecord',
      payload: {
        cbSqlOperationRecord: listCBOperationLogsMockData[0]
      }
    });
  });
});
