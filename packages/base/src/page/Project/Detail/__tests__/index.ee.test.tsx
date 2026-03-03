import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseRecentlyOpenedProjects } from '../../../Nav/SideMenu/testUtils/mockUseRecentlyOpenedProjects';
import { baseSuperRender } from '../../../../testUtils/superRender';
import EEIndexProjectDetail from '../index';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { act, cleanup, screen } from '@testing-library/react';
import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { useDispatch } from 'react-redux';
import { userOpPermissionMockData } from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter/data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('test base/page/project/detail/ee', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot when the current project id and the next project id are both empty', () => {
    mockUseCurrentProject({ projectID: '' });
    mockUseRecentlyOpenedProjects({ currentProjectID: '' });

    const { baseElement } = baseSuperRender(<EEIndexProjectDetail />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('选择项目')).toBeInTheDocument();
  });

  it('should be executed "updateRecentlyProject" when the current project id is different from the next project id', async () => {
    const mockUpdateRecentlyProject = jest.fn();
    mockUseCurrentProject({ projectID: '1' });
    mockUseRecentlyOpenedProjects({
      currentProjectID: '1',
      updateRecentlyProject: mockUpdateRecentlyProject
    });

    const { baseElement } = baseSuperRender(<EEIndexProjectDetail />);
    expect(mockUpdateRecentlyProject).not.toHaveBeenCalled();

    expect(baseElement).toMatchSnapshot();

    cleanup();
    jest.clearAllTimers();

    const requestGetUserOpPermissionSpy = userCenter.getUserOpPermission();
    mockUseCurrentProject({ projectID: '1', projectName: 'test' });
    mockUseRecentlyOpenedProjects({
      currentProjectID: '2',
      updateRecentlyProject: mockUpdateRecentlyProject
    });

    baseSuperRender(<EEIndexProjectDetail />);
    expect(requestGetUserOpPermissionSpy).toHaveBeenCalledTimes(1);
    expect(mockUpdateRecentlyProject).toHaveBeenCalledTimes(1);
    expect(mockUpdateRecentlyProject).toHaveBeenCalledWith('1', 'test');

    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'permission/updateUserOperationPermissions',
      payload: userOpPermissionMockData
    });
  });
});
