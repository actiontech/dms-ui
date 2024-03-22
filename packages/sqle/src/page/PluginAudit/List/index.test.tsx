import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import PluginAuditList from '.';
import { superRender } from '../../../testUtils/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useDispatch, useSelector } from 'react-redux';
import { driverMeta } from '../../../hooks/useDatabaseType/index.test.data';
import {
  createSpySuccessResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { ModalName } from '../../../data/ModalName';
import sqlDEVRecord from '../../../testUtils/mockApi/sqlDEVRecord';
import { sqlDEVRecordListMockData } from '../../../testUtils/mockApi/sqlDEVRecord/data';
import user from '../../../testUtils/mockApi/user';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('sqle/PluginAudit/List', () => {
  const mockDispatch = jest.fn();
  let getAuditWhitelistSpy: jest.SpyInstance;
  let getUserTipListSpy: jest.SpyInstance;

  beforeEach(() => {
    sqlDEVRecord.mockAllApi();
    mockUseCurrentProject();
    mockUseCurrentUser();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: driverMeta },
        pluginAudit: {
          modalStatus: {}
        }
      });
    });
    getAuditWhitelistSpy = sqlDEVRecord.getAuditWhitelist();
    getUserTipListSpy = user.getUserTipList();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render table data', async () => {
    const { baseElement } = superRender(<PluginAuditList />);
    expect(getAuditWhitelistSpy).toHaveBeenCalled();
    expect(getUserTipListSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render empty prompt when request return empty', async () => {
    getAuditWhitelistSpy.mockClear();
    getAuditWhitelistSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [] })
    );
    const { baseElement } = superRender(<PluginAuditList />);
    expect(getAuditWhitelistSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render empty prompt when request failed', async () => {
    getAuditWhitelistSpy.mockClear();
    getAuditWhitelistSpy.mockImplementation(() =>
      createSpyFailResponse({ data: [] })
    );
    const { baseElement } = superRender(<PluginAuditList />);
    expect(getAuditWhitelistSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('filter data with search', async () => {
    superRender(<PluginAuditList />);
    expect(getAuditWhitelistSpy).toHaveBeenCalled();
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
    expect(getAuditWhitelistSpy).toHaveBeenCalledWith({
      fuzzy_search_sql_fingerprint: searchText,
      page_index: 1,
      page_size: 20,
      project_name: mockProjectInfo.projectName
    });
  });

  it('click sql fingerprint and open ide audit result', async () => {
    getAuditWhitelistSpy.mockClear();
    getAuditWhitelistSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [sqlDEVRecordListMockData[0]] })
    );
    const { baseElement } = superRender(<PluginAuditList />);
    expect(getAuditWhitelistSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getAllByText('SELECT').length).toBe(2);
    fireEvent.click(screen.getAllByText('SELECT')[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'pluginAudit/updateModalStatus',
      payload: {
        modalName: ModalName.View_Plugin_Audit_Result_Drawer,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'pluginAudit/updatePluginAuditRecord',
      payload: {
        pluginAuditRecord: sqlDEVRecordListMockData[0]
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('click sql and open ide audit result', async () => {
    getAuditWhitelistSpy.mockClear();
    getAuditWhitelistSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [sqlDEVRecordListMockData[0]] })
    );
    superRender(<PluginAuditList />);
    expect(getAuditWhitelistSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getAllByText('SELECT').length).toBe(2);
    fireEvent.click(screen.getAllByText('SELECT')[1]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'pluginAudit/updateModalStatus',
      payload: {
        modalName: ModalName.View_Plugin_Audit_Result_Drawer,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'pluginAudit/updatePluginAuditRecord',
      payload: {
        pluginAuditRecord: sqlDEVRecordListMockData[0]
      }
    });
  });

  it('click audit result and open ide audit result', async () => {
    getAuditWhitelistSpy.mockClear();
    getAuditWhitelistSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [sqlDEVRecordListMockData[0]] })
    );
    superRender(<PluginAuditList />);
    expect(getAuditWhitelistSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllBySelector('.audit-result-wrapper').length).toBe(1);
    fireEvent.click(getAllBySelector('.audit-result-wrapper')[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'pluginAudit/updateModalStatus',
      payload: {
        modalName: ModalName.View_Plugin_Audit_Result_Drawer,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'pluginAudit/updatePluginAuditRecord',
      payload: {
        pluginAuditRecord: sqlDEVRecordListMockData[0]
      }
    });
  });
});
