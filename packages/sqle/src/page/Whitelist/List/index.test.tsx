import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import WhitelistList from '.';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import auditWhiteList from '../../../testUtils/mockApi/auditWhiteList';
import { auditWhiteListMockData } from '../../../testUtils/mockApi/auditWhiteList/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useSelector, useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
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

describe('slqe/Whitelist/WhitelistList', () => {
  let whitelistSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  let useCurrentUserSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    whitelistSpy = auditWhiteList.getAuditWhitelist();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    useCurrentUserSpy = mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('should render whitelist list', async () => {
    const { baseElement } = renderWithReduxAndTheme(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(whitelistSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('添加审核SQL例外')).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
    expect(screen.queryAllByText('删 除')).toHaveLength(
      auditWhiteListMockData.length
    );
    expect(screen.queryAllByText('编 辑')).toHaveLength(
      auditWhiteListMockData.length
    );
  });

  test('refresh whitelist list', async () => {
    const { baseElement } = renderWithReduxAndTheme(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(whitelistSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(whitelistSpy).toHaveBeenCalledTimes(2);
  });

  it('should hide table actions', async () => {
    // not admin or global manager or project manager
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
      }
    }));
    renderWithReduxAndTheme(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('删 除')).toHaveLength(0);
    expect(screen.queryAllByText('编 辑')).toHaveLength(0);

    useCurrentUserSpy.mockClear();
    cleanup();
    // project manager
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
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
    renderWithReduxAndTheme(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('删 除')).toHaveLength(
      auditWhiteListMockData.length
    );
    expect(screen.queryAllByText('编 辑')).toHaveLength(
      auditWhiteListMockData.length
    );
    useCurrentUserSpy.mockClear();
    cleanup();
    // project archived
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
      },
      bindProjects: [
        {
          is_manager: true,
          project_name: mockProjectInfo.projectName,
          project_id: mockProjectInfo.projectID,
          archived: true
        }
      ]
    }));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('删 除')).toHaveLength(0);
    expect(screen.queryAllByText('编 辑')).toHaveLength(0);
  });

  test('add whitelist', async () => {
    const { baseElement } = renderWithReduxAndTheme(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(whitelistSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'whitelist/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Add_Whitelist]: false,
          [ModalName.Update_Whitelist]: false
        }
      }
    });
    fireEvent.click(
      getBySelector('.ant-btn-primary.basic-button-wrapper', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'whitelist/updateModalStatus',
      payload: {
        modalName: ModalName.Add_Whitelist,
        status: true
      }
    });
  });

  it('delete whitelist', async () => {
    whitelistSpy.mockClear();
    whitelistSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [auditWhiteListMockData[1]]
      })
    );
    const deleteAuthWhitelistSpy = auditWhiteList.deleteAuthWhitelist();
    renderWithReduxAndTheme(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(whitelistSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('确认删除这条审核SQL例外么？')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(deleteAuthWhitelistSpy).toHaveBeenCalledTimes(1);
    expect(deleteAuthWhitelistSpy).toHaveBeenCalledWith({
      audit_whitelist_id: `${auditWhiteListMockData[1].audit_whitelist_id}`,
      project_name: mockProjectInfo.projectName
    });
    expect(screen.getByText('删除审核SQL例外语句成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(whitelistSpy).toHaveBeenCalled();
  });

  it('edit whitelist', async () => {
    whitelistSpy.mockClear();
    whitelistSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [auditWhiteListMockData[1]]
      })
    );
    renderWithReduxAndTheme(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(whitelistSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'whitelist/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Add_Whitelist]: false,
          [ModalName.Update_Whitelist]: false
        }
      }
    });
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toHaveBeenCalledTimes(4);
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'whitelist/updateSelectWhitelist',
      payload: {
        selectRow: auditWhiteListMockData[1]
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(4, {
      type: 'whitelist/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Whitelist,
        status: true
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
