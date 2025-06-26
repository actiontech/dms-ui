import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import SqlManagementExceptionList from '../';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import blacklist from '@actiontech/shared/lib/testUtil/mockApi/sqle/blacklist';
import { mockBlacklistData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/blacklist/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useSelector, useDispatch } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  mockProjectInfo,
  mockCurrentUserReturn
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import { SystemRole } from '@actiontech/shared/lib/enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('slqe/Whitelist/SqlManagementExceptionList', () => {
  let getBlacklistSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let useCurrentUserSpy: jest.SpyInstance;
  let useCurrentProjectSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getBlacklistSpy = blacklist.getBlacklist();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlManagementException: { modalStatus: {} },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: { is_admin: false, op_permission_list: [] }
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    useCurrentProjectSpy = mockUseCurrentProject();
    useCurrentUserSpy = mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('should render sqlManagementException list', async () => {
    const { baseElement } = superRender(<SqlManagementExceptionList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('添加管控SQL例外')).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
    expect(screen.queryAllByText('删 除')).toHaveLength(
      mockBlacklistData.length
    );
    expect(screen.queryAllByText('编 辑')).toHaveLength(
      mockBlacklistData.length
    );
  });

  it('render filter list data by search', async () => {
    superRender(<SqlManagementExceptionList />);
    await act(async () => jest.advanceTimersByTime(3000));

    const searchText = 'test search';
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

    expect(getBlacklistSpy).toHaveBeenCalledTimes(2);
    expect(getBlacklistSpy).toHaveBeenNthCalledWith(2, {
      fuzzy_search_content: searchText,
      page_index: '1',
      page_size: '20',
      project_name: mockProjectInfo.projectName
    });
  });

  test('refresh sqlManagementException list', async () => {
    const { baseElement } = superRender(<SqlManagementExceptionList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBlacklistSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBlacklistSpy).toHaveBeenCalledTimes(2);
  });

  it('should hide table actions', async () => {
    // not admin or globalManager or projectManager
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false
      }
    }));
    superRender(<SqlManagementExceptionList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('删 除')).toHaveLength(0);
    expect(screen.queryAllByText('编 辑')).toHaveLength(0);
    useCurrentUserSpy.mockClear();
    cleanup();
    // Be projectManager
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false
      },
      bindProjects: [
        {
          is_manager: true,
          project_name: mockProjectInfo.projectName,
          project_id: mockProjectInfo.projectID,
          archived: false
        }
      ]
    }));
    superRender(<SqlManagementExceptionList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('删 除')).toHaveLength(
      mockBlacklistData.length
    );
    expect(screen.queryAllByText('编 辑')).toHaveLength(
      mockBlacklistData.length
    );
    useCurrentUserSpy.mockClear();
    cleanup();
    // project is archived
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      bindProjects: [
        {
          is_manager: true,
          project_name: mockProjectInfo.projectName,
          project_id: mockProjectInfo.projectID,
          archived: true
        }
      ]
    }));
    superRender(<SqlManagementExceptionList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('删 除')).toHaveLength(0);
    expect(screen.queryAllByText('编 辑')).toHaveLength(0);
  });

  test('add sqlManagementException', async () => {
    const { baseElement } = superRender(<SqlManagementExceptionList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Create_Sql_Management_Exception]: false,
          [ModalName.Update_Sql_Management_Exception]: false
        }
      }
    });
    fireEvent.click(
      getBySelector('.ant-btn-primary.basic-button-wrapper', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'sqlManagementException/updateModalStatus',
      payload: {
        modalName: ModalName.Create_Sql_Management_Exception,
        status: true
      }
    });
  });

  it('delete sqlManagementException', async () => {
    getBlacklistSpy.mockClear();
    getBlacklistSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [mockBlacklistData[1]]
      })
    );
    const deleteBlackListSpy = blacklist.deleteBlackList();
    superRender(<SqlManagementExceptionList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBlacklistSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('确认删除这条管控SQL例外么？')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(deleteBlackListSpy).toHaveBeenCalledTimes(1);
    expect(deleteBlackListSpy).toHaveBeenCalledWith({
      blacklist_id: `${mockBlacklistData[1].blacklist_id}`,
      project_name: mockProjectInfo.projectName
    });
    expect(screen.getByText('删除管控SQL例外语句成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBlacklistSpy).toHaveBeenCalled();
  });

  it('edit sqlManagementException', async () => {
    getBlacklistSpy.mockClear();
    getBlacklistSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [mockBlacklistData[1]]
      })
    );
    superRender(<SqlManagementExceptionList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Create_Sql_Management_Exception]: false,
          [ModalName.Update_Sql_Management_Exception]: false
        }
      }
    });
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toHaveBeenCalledTimes(4);
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'sqlManagementException/updateSelectSqlManagementException',
      payload: {
        selectRow: mockBlacklistData[1]
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(4, {
      type: 'sqlManagementException/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Sql_Management_Exception,
        status: true
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
