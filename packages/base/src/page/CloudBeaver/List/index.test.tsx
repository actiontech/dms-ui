import { baseSuperRender } from '../../../testUtils/superRender';
import CBOperationLogsList from '.';
import cloudBeaver from '@actiontech/shared/lib/testUtil/mockApi/base/cloudBeaver';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import {
  getBySelector,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { useDispatch, useSelector } from 'react-redux';
import { driverMeta } from 'sqle/src/hooks/useDatabaseType/index.test.data';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { listCBOperationLogsMockData } from '@actiontech/shared/lib/testUtil/mockApi/base/cloudBeaver/data';
import { ModalName } from '../../../data/ModalName';
import { ModalName as SqleModalName } from 'sqle/src/data/ModalName';
import { SystemRole } from '@actiontech/shared/lib/enum';

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
  const mockSetGetOperationLogsLoading = jest.fn();

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
        },
        whitelist: { modalStatus: {} },
        permission: {
          moduleFeatureSupport: false,
          userOperationPermissions: {
            is_admin: false,
            op_permission_list: []
          }
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

  const customRender = () => {
    return baseSuperRender(
      <CBOperationLogsList
        setGetOperationLogsLoading={mockSetGetOperationLogsLoading}
      />
    );
  };

  it('render init table', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getAllByText('添加为审核SQL例外')[2].closest('button')
    ).toBeDisabled();
    expect(listCBOperationLogsSpy).toHaveBeenCalledTimes(1);
    expect(getCBOperationLogTipsSpy).toHaveBeenCalledTimes(1);
    expect(dbServiceTipsSpy).toHaveBeenCalledTimes(1);
    expect(memberTipsSpy).toHaveBeenCalledTimes(1);
    expect(mockSetGetOperationLogsLoading).toHaveBeenCalledTimes(2);
  });

  it('render table when request return failed', async () => {
    listCBOperationLogsSpy.mockClear();
    listCBOperationLogsSpy.mockImplementation(() => createSpyFailResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('filter data with search', async () => {
    const { baseElement } = customRender();
    expect(listCBOperationLogsSpy).toHaveBeenCalledTimes(1);
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
    expect(listCBOperationLogsSpy).toHaveBeenCalledTimes(2);
    expect(listCBOperationLogsSpy).toHaveBeenCalledWith({
      fuzzy_keyword: searchText,
      page_index: 1,
      page_size: 20,
      project_uid: mockProjectInfo.projectID
    });

    fireEvent.click(screen.getByText('筛选'));
    expect(baseElement).toMatchSnapshot();
  });

  it('export file', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
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
    customRender();
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
    customRender();
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

  it('render create whitelist', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('添加为审核SQL例外')[0]).toBeInTheDocument();
    fireEvent.click(screen.queryAllByText('添加为审核SQL例外')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    expect(mockDispatch).toHaveBeenCalledTimes(4);
    expect(mockDispatch).toHaveBeenNthCalledWith(3, {
      payload: { modalName: SqleModalName.Add_Whitelist, status: true },
      type: 'whitelist/updateModalStatus'
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(4, {
      payload: { selectRow: { value: 'SELECT 1;' } },
      type: 'whitelist/updateSelectWhitelist'
    });
  });

  describe('action permissions', () => {
    it('should render actions', async () => {
      customRender();

      await act(async () => jest.advanceTimersByTime(3000));

      expect(screen.getByText('导 出')).toBeInTheDocument();
      expect(screen.queryAllByText('添加为审核SQL例外').length).toBe(
        listCBOperationLogsMockData.length
      );
    });

    it('should not render actions when project is archived', async () => {
      mockUseCurrentUser({
        bindProjects: [
          {
            project_id: mockProjectInfo.projectID,
            project_name: mockProjectInfo.projectName,
            archived: true,
            is_manager: true
          }
        ]
      });
      customRender();

      await act(async () => jest.advanceTimersByTime(3000));

      expect(screen.getByText('导 出')).toBeInTheDocument();
      expect(screen.queryAllByText('添加为审核SQL例外').length).toBe(0);
    });

    it('should not render actions when user is not admin or is not project manager', async () => {
      mockUseCurrentUser({
        userRoles: {
          [SystemRole.admin]: false,
          [SystemRole.certainProjectManager]: false,
          [SystemRole.auditAdministrator]: false,
          [SystemRole.systemAdministrator]: false,
          [SystemRole.projectDirector]: false
        },
        bindProjects: [
          {
            project_id: mockProjectInfo.projectID,
            project_name: mockProjectInfo.projectName,
            archived: false,
            is_manager: false
          }
        ]
      });
      customRender();

      await act(async () => jest.advanceTimersByTime(3000));

      expect(screen.getByText('导 出')).toBeInTheDocument();
      expect(screen.queryAllByText('添加为审核SQL例外').length).toBe(0);
    });
  });
});
