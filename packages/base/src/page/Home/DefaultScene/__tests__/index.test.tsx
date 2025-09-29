import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import DefaultScene from '..';
import { baseSuperRender } from '../../../../testUtils/superRender';
import { fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { mockUseRecentlyOpenedProjects } from '../../../Nav/SideMenu/testUtils/mockUseRecentlyOpenedProjects';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { SystemRole } from '@actiontech/dms-kit';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('test base/home/DefaultScene', () => {
  const navigateSpy = jest.fn();
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });
  it('should match snapshot when role is admin', () => {
    mockUseCurrentUser();

    const { container } = baseSuperRender(<DefaultScene />);
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('查看审核规则'));
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should match snapshot when role is not admin and global manager', () => {
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.certainProjectManager]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.auditAdministrator]: false,
        [SystemRole.projectDirector]: false
      }
    });

    const { container } = baseSuperRender(<DefaultScene />);
    expect(container).toMatchSnapshot();
  });

  it('should render modal when clicked view rule list and current project id is undefined', () => {
    mockUseCurrentUser();

    baseSuperRender(<DefaultScene />);
    expect(screen.queryByText('选择项目')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('查看审核规则'));

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(screen.getByText('选择项目')).toBeInTheDocument();
  });

  it('should execute navigate when clicked view rule list and current project id is not undefined', () => {
    mockUseRecentlyOpenedProjects({ currentProjectID: '1' });
    mockUseCurrentUser();
    baseSuperRender(<DefaultScene />);
    expect(screen.queryByText('选择项目')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('查看审核规则'));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(`/sqle/rule?projectID=1`);
    expect(screen.queryByText('选择项目')).not.toBeInTheDocument();
  });
});
