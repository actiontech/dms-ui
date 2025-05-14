import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import PluginAuditList from '.';
import { sqleSuperRender } from '../../../testUtils/superRender';
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
import instance from '../../../testUtils/mockApi/instance';
import { SupportLanguage } from '@actiontech/shared/lib/enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('sqle/PluginAudit/List', () => {
  const mockDispatch = jest.fn();
  let getSqlDEVRecordListSpy: jest.SpyInstance;
  let getUserTipListSpy: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;

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
        },
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      });
    });
    getSqlDEVRecordListSpy = sqlDEVRecord.getSqlDEVRecordList();
    getUserTipListSpy = user.getUserTipList();
    getInstanceTipListSpy = instance.getInstanceTipList();
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
    const { baseElement } = sqleSuperRender(<PluginAuditList />);
    expect(getSqlDEVRecordListSpy).toHaveBeenCalled();
    expect(getUserTipListSpy).toHaveBeenCalled();
    expect(getInstanceTipListSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render empty prompt when request return empty', async () => {
    getSqlDEVRecordListSpy.mockClear();
    getSqlDEVRecordListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [] })
    );
    const { baseElement } = sqleSuperRender(<PluginAuditList />);
    expect(getSqlDEVRecordListSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render empty prompt when request failed', async () => {
    getSqlDEVRecordListSpy.mockClear();
    getSqlDEVRecordListSpy.mockImplementation(() =>
      createSpyFailResponse({ data: [] })
    );
    const { baseElement } = sqleSuperRender(<PluginAuditList />);
    expect(getSqlDEVRecordListSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('filter data with search', async () => {
    sqleSuperRender(<PluginAuditList />);
    expect(getSqlDEVRecordListSpy).toHaveBeenCalled();
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
    expect(getSqlDEVRecordListSpy).toHaveBeenCalledWith({
      fuzzy_search_sql_fingerprint: searchText,
      page_index: 1,
      page_size: 20,
      project_name: mockProjectInfo.projectName
    });
  });

  it('click sql fingerprint and open ide audit result', async () => {
    getSqlDEVRecordListSpy.mockClear();
    getSqlDEVRecordListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [sqlDEVRecordListMockData[0]] })
    );
    const { baseElement } = sqleSuperRender(<PluginAuditList />);
    expect(getSqlDEVRecordListSpy).toHaveBeenCalled();
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
    getSqlDEVRecordListSpy.mockClear();
    getSqlDEVRecordListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [sqlDEVRecordListMockData[0]] })
    );
    sqleSuperRender(<PluginAuditList />);
    expect(getSqlDEVRecordListSpy).toHaveBeenCalled();
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
    getSqlDEVRecordListSpy.mockClear();
    getSqlDEVRecordListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [sqlDEVRecordListMockData[0]] })
    );
    sqleSuperRender(<PluginAuditList />);
    expect(getSqlDEVRecordListSpy).toHaveBeenCalled();
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

  it('render create whitelist', async () => {
    getSqlDEVRecordListSpy.mockClear();
    getSqlDEVRecordListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [sqlDEVRecordListMockData[0]] })
    );
    sqleSuperRender(<PluginAuditList />);
    expect(getSqlDEVRecordListSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('添加为审核SQL例外')).toBeInTheDocument();
    fireEvent.click(screen.getByText('添加为审核SQL例外'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(mockDispatch).toHaveBeenCalledTimes(4);
    expect(mockDispatch).toHaveBeenNthCalledWith(3, {
      payload: { modalName: ModalName.Add_Whitelist, status: true },
      type: 'whitelist/updateModalStatus'
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(4, {
      payload: { selectRow: { value: 'SELECT 1;' } },
      type: 'whitelist/updateSelectWhitelist'
    });
  });

  it('should hidden user book when current language is en', async () => {
    mockUseCurrentUser({ language: SupportLanguage.enUS });

    getSqlDEVRecordListSpy.mockClear();
    getSqlDEVRecordListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [] })
    );
    const { baseElement } = sqleSuperRender(<PluginAuditList />);
    expect(getSqlDEVRecordListSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('用户手册')).not.toBeInTheDocument();
  });
});
