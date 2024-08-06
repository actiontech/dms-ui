import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseRecentlyOpenedProjects } from '../../../Nav/SideMenu/testUtils/mockUseRecentlyOpenedProjects';
import { superRender } from '../../../../testUtils/customRender';
import EEIndexProjectDetail from '../index.ee';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { cleanup, screen } from '@testing-library/react';

describe('test base/page/project/detail/ee', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot when the current project id and the next project id are both empty', () => {
    mockUseCurrentProject({ projectID: '' });
    mockUseRecentlyOpenedProjects({ currentProjectID: '' });

    const { baseElement } = superRender(<EEIndexProjectDetail />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('选择项目')).toBeInTheDocument();
  });

  it('should be executed "updateRecentlyProject" when the current project id is different from the next project id', () => {
    const mockUpdateRecentlyProject = jest.fn();
    mockUseCurrentProject({ projectID: '1' });
    mockUseRecentlyOpenedProjects({
      currentProjectID: '1',
      updateRecentlyProject: mockUpdateRecentlyProject
    });

    const { baseElement } = superRender(<EEIndexProjectDetail />);
    expect(mockUpdateRecentlyProject).not.toHaveBeenCalled();

    expect(baseElement).toMatchSnapshot();

    cleanup();
    jest.clearAllTimers();

    mockUseCurrentProject({ projectID: '1', projectName: 'test' });
    mockUseRecentlyOpenedProjects({
      currentProjectID: '2',
      updateRecentlyProject: mockUpdateRecentlyProject
    });

    superRender(<EEIndexProjectDetail />);
    expect(mockUpdateRecentlyProject).toHaveBeenCalledTimes(1);
    expect(mockUpdateRecentlyProject).toHaveBeenCalledWith('1', 'test');
  });
});
