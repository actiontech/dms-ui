import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import EventEmitter from '../../utils/EventEmitter';
import { mockUseUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/mockUseUserInfo';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../data/ModalName';
import { baseSuperRender } from '../../testUtils/superRender';
import Project from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EmitterKey from '../../data/EmitterKey';
import { SystemRole } from '@actiontech/shared/lib/enum';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test base/page/project', () => {
  let emitSpy: jest.SpyInstance;
  const useSelectorMock = useSelector as jest.Mock;
  const dispatchSpy = jest.fn();
  let exportProjectsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    emitSpy = jest.spyOn(EventEmitter, 'emit');
    project.getProjectList();
    exportProjectsSpy = project.exportProjects();
    mockUseCurrentUser();
    mockUseUserInfo();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    useSelectorMock.mockImplementation((e) =>
      e({
        project: {
          modalStatus: {
            [ModalName.DMS_Add_Project]: false,
            [ModalName.DMS_Update_Project]: false
          }
        },
        permission: {
          moduleFeatureSupport: {
            sqlOptimization: false
          },
          userOperationPermissions: null
        }
      })
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const { baseElement } = baseSuperRender(<Project />);
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should be refresh table when clicking refresh button', async () => {
    baseSuperRender(<Project />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).not.toHaveBeenCalled();
    fireEvent.click(getBySelector('.custom-icon-refresh'));
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(EmitterKey.DMS_Refresh_Project_List);
  });

  it('should open the modal for creating a project when click the Create Project button', () => {
    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: true,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: false
      }
    });
    baseSuperRender(<Project />);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('创建项目'));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'project/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Project,
        status: true
      }
    });

    cleanup();
    jest.clearAllMocks();
    jest.clearAllTimers();

    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: true
      }
    });
    baseSuperRender(<Project />);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('创建项目')).toBeInTheDocument();
    expect(screen.getByText('导 入')).toBeInTheDocument();
    expect(screen.getByText('导 出')).toBeInTheDocument();
    expect(screen.getByText('资源全景视图')).toBeInTheDocument();
    fireEvent.click(screen.getByText('创建项目'));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);

    cleanup();
    jest.clearAllMocks();
    jest.clearAllTimers();

    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: false
      }
    });
    baseSuperRender(<Project />);
    expect(screen.queryByText('创建项目')).not.toBeInTheDocument();
    expect(screen.queryByText('导 入')).not.toBeInTheDocument();
    expect(screen.queryByText('导 出')).not.toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.certainProjectManager]: false,
        [SystemRole.auditAdministrator]: false
      }
    });
    baseSuperRender(<Project />);
    expect(screen.queryByText('资源全景视图')).not.toBeInTheDocument();
  });

  it('should export project info', async () => {
    baseSuperRender(<Project />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('导 出'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('正在导出项目')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(exportProjectsSpy).toHaveBeenCalledTimes(1);
    expect(exportProjectsSpy).toHaveBeenCalledWith(
      {},
      { responseType: 'blob' }
    );
  });

  it('render batch import data source button', async () => {
    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: true,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: false
      }
    });
    baseSuperRender(<Project />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('批量导入数据源')).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false
      }
    });
    baseSuperRender(<Project />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('批量导入数据源')).not.toBeInTheDocument();
  });

  it('should render configure availability zone button', () => {
    baseSuperRender(<Project />);
    expect(screen.getByText('配置可用区')).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();
    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.auditAdministrator]: false
      }
    });
    baseSuperRender(<Project />);
    expect(screen.queryByText('配置可用区')).not.toBeInTheDocument();
  });
});
