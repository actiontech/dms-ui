import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import RuleTemplateList from '.';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import {
  mockCurrentUserReturn,
  mockProjectInfo
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { projectRuleTemplateListMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template/data';
import { ModalName } from '../../../data/ModalName';
import { useDispatch, useSelector } from 'react-redux';
import { SystemRole } from '@actiontech/shared/lib/enum';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('sqle/RuleTemplate/List', () => {
  const dispatchSpy = jest.fn();
  let getProjectRuleTemplateListSpy: jest.SpyInstance;
  let mockUseCurrentUserSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUserSpy = mockUseCurrentUser();
    mockUseDbServiceDriver();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        ruleTemplate: {
          modalStatus: { [ModalName.Clone_Rule_Template]: false }
        },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
    getProjectRuleTemplateListSpy = rule_template.getProjectRuleTemplateList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = () => superRender(<RuleTemplateList />);

  it('should render project rule template list list when it first entered the page', async () => {
    const { baseElement } = customRender();
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(getProjectRuleTemplateListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(`共 ${projectRuleTemplateListMockData.length} 条数据`)
    ).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
    expect(
      getBySelector('.ant-segmented-group', baseElement)
    ).toBeInTheDocument();
  });

  it('should receive "Refresh_Rule_Template_List" event when click refresh icon', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = customRender();

    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getProjectRuleTemplateListSpy).toHaveBeenCalledTimes(2);
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Rule_Template_List
    );
  });

  it('should render public rule template list', async () => {
    const getRuleTemplateListSpy = rule_template.getRuleTemplateList();
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('公共规则模板'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getRuleTemplateListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('render action button with  permissions', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('导入规则模板')).toBeInTheDocument();
    expect(screen.getByText('创建规则模板')).toBeInTheDocument();

    cleanup();
    mockUseCurrentUserSpy.mockClear();
    mockUseCurrentUserSpy.mockImplementation(() => {
      return {
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
      };
    });
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('导入规则模板')).toBeInTheDocument();
    expect(screen.getByText('创建规则模板')).toBeInTheDocument();

    cleanup();
    mockUseCurrentUserSpy.mockClear();
    mockUseCurrentUserSpy.mockImplementation(() => {
      return {
        ...mockCurrentUserReturn,
        userRoles: {
          ...mockCurrentUserReturn.userRoles,
          [SystemRole.admin]: false,
          [SystemRole.systemAdministrator]: false
        }
      };
    });
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('导入规则模板')).not.toBeInTheDocument();
    expect(screen.queryByText('创建规则模板')).not.toBeInTheDocument();

    cleanup();
    mockUseCurrentUserSpy.mockClear();
    mockUseCurrentUserSpy.mockImplementation(() => {
      return {
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
            archived: true
          }
        ]
      };
    });
    getProjectRuleTemplateListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [projectRuleTemplateListMockData[0]] })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('克隆规则模板')).toBeInTheDocument();
    expect(screen.getByText('导出规则模板')).toBeInTheDocument();
  });
});
