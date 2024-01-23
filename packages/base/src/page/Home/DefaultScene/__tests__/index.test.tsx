import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import DefaultScene from '..';
import { superRender } from '../../../../testUtils/customRender';
import { fireEvent, screen } from '@testing-library/react';
import { ignoreComponentCustomAttr } from '@actiontech/shared/lib/testUtil/common';
import { useNavigate } from 'react-router-dom';
import { mockUseRecentlyOpenedProjects } from '../../../Nav/SideMenu/testUtils/mockUseRecentlyOpenedProjects';
import { RuleUrlParamKey } from 'sqle/src/page/Rule/hooks/useRuleFilterFormItem';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('test base/home/DefaultScene', () => {
  const navigateSpy = jest.fn();
  ignoreComponentCustomAttr();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });
  it('should match snapshot when role is admin', () => {
    mockUseCurrentUser();

    const { container } = superRender(<DefaultScene />);
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('查看审核规则'));
    expect(navigateSpy).not.toBeCalled();
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

    expect(navigateSpy).not.toBeCalled();
    expect(screen.getByText('选择项目')).toBeInTheDocument();
  });

  it('should execute navigate when clicked view rule list and current project id is not undefined', () => {
    mockUseRecentlyOpenedProjects({ currentProjectID: '1' });
    mockUseCurrentUser();
    superRender(<DefaultScene />);
    expect(screen.queryByText('选择项目')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('查看审核规则'));

    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).toBeCalledWith(
      `/sqle/rule?${RuleUrlParamKey.projectID}=1`
    );
    expect(screen.queryByText('选择项目')).not.toBeInTheDocument();
  });
});
