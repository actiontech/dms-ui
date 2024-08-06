import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import DefaultScene from '..';
import { superRender } from '../../../../testUtils/customRender';
import { fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { mockUseRecentlyOpenedProjects } from '../../../Nav/SideMenu/testUtils/mockUseRecentlyOpenedProjects';
import { RuleUrlParamKey } from '@actiontech/shared/lib/types/common.type';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

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

    const { container } = superRender(<DefaultScene />);
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('查看审核规则'));
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should match snapshot when role is not admin', () => {
    mockUseCurrentUser({ isAdmin: false });

    const { container } = superRender(<DefaultScene />);
    expect(container).toMatchSnapshot();
  });

  it('should render modal when clicked view rule list and current project id is undefined', () => {
    mockUseCurrentUser();

    superRender(<DefaultScene />);
    expect(screen.queryByText('选择项目')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('查看审核规则'));

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(screen.getByText('选择项目')).toBeInTheDocument();
  });

  it('should execute navigate when clicked view rule list and current project id is not undefined', () => {
    mockUseRecentlyOpenedProjects({ currentProjectID: '1' });
    mockUseCurrentUser();
    superRender(<DefaultScene />);
    expect(screen.queryByText('选择项目')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('查看审核规则'));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/rule?${RuleUrlParamKey.projectID}=1`
    );
    expect(screen.queryByText('选择项目')).not.toBeInTheDocument();
  });
});
