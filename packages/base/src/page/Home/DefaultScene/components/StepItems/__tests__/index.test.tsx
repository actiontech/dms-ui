import { cleanup, fireEvent, screen } from '@testing-library/react';
import StepItems from '..';
import { superRender } from '../../../../../../testUtils/customRender';
import { AdminUserDevopsSteps, NormalUserDevopsSteps } from '../index.data';
import { RuleUrlParamKey } from '@actiontech/shared/lib/types/common.type';
import { DataSourceManagerSegmentedKey } from '../../../../../DataSourceManagement/index.type';

describe('test base/Home/StepItems', () => {
  it('should match snapshot', () => {
    const projectID = '1';
    const navigateSpy = jest.fn();
    const setOpenRulePageProjectSelectorModalSpy = jest.fn();
    const steps_admin = AdminUserDevopsSteps({
      navigate: navigateSpy,
      projectID,
      setOpenRulePageProjectSelectorModal:
        setOpenRulePageProjectSelectorModalSpy
    });
    const { container } = superRender(<StepItems steps={steps_admin} />);
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('查看列表')[0]);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/project/${projectID}/db-services`
    );

    fireEvent.click(screen.getByText('添加数据源'));
    expect(navigateSpy).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/project/${projectID}/db-services/create`
    );

    fireEvent.click(screen.getAllByText('查看列表')[1]);
    expect(navigateSpy).toHaveBeenCalledTimes(3);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/data-source-management?active=${DataSourceManagerSegmentedKey.SyncDataSource}`
    );

    fireEvent.click(screen.getByText('新建同步任务'));
    expect(navigateSpy).toHaveBeenCalledTimes(4);
    expect(navigateSpy).toHaveBeenCalledWith(`/sync-data-source/create`);

    fireEvent.click(screen.getByText('查看成员'));
    expect(navigateSpy).toHaveBeenCalledTimes(5);
    expect(navigateSpy).toHaveBeenCalledWith(`/project/${projectID}/member`);

    fireEvent.click(screen.getByText('进入SQL工作台'));
    expect(navigateSpy).toHaveBeenCalledTimes(6);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/project/${projectID}/cloud-beaver`
    );

    fireEvent.click(screen.getByText('查看审核规则'));
    expect(navigateSpy).toHaveBeenCalledTimes(7);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/rule?${RuleUrlParamKey.projectID}=${projectID}`
    );

    fireEvent.click(screen.getByText('查看规则模板'));
    expect(navigateSpy).toHaveBeenCalledTimes(8);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/rule/template`
    );

    fireEvent.click(screen.getByText('查看智能扫描'));
    expect(navigateSpy).toHaveBeenCalledTimes(9);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/audit-plan`
    );

    fireEvent.click(screen.getByText('新建SQL审核'));
    expect(navigateSpy).toHaveBeenCalledTimes(10);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/sql-audit/create`
    );

    fireEvent.click(screen.getByText('配置审批流程模板'));
    expect(navigateSpy).toHaveBeenCalledTimes(11);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/progress`
    );

    fireEvent.click(screen.getByText('发起SQL工单'));
    expect(navigateSpy).toHaveBeenCalledTimes(12);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/exec-workflow/create`
    );

    fireEvent.click(screen.getByText('SQLE操作记录'));
    expect(navigateSpy).toHaveBeenCalledTimes(13);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/operation-record`
    );

    fireEvent.click(screen.getByText('发起导出工单'));
    expect(navigateSpy).toHaveBeenCalledTimes(14);
    expect(navigateSpy).toHaveBeenCalledWith(
      `project/${projectID}/data/export/create`
    );

    fireEvent.click(screen.getByText('账号列表'));
    expect(navigateSpy).toHaveBeenCalledTimes(15);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/provision/project/${projectID}/database-account`
    );

    fireEvent.click(screen.getByText('临期列表'));
    expect(navigateSpy).toHaveBeenCalledTimes(16);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/provision/project/${projectID}/database-account-password`
    );

    fireEvent.click(screen.getByText('授权审计'));
    expect(navigateSpy).toHaveBeenCalledTimes(17);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/provision/project/${projectID}/audit/auth`
    );

    fireEvent.click(screen.getByText('权限模板审计'));
    expect(navigateSpy).toHaveBeenCalledTimes(18);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/provision/project/${projectID}/audit/template`
    );

    // fireEvent.click(screen.getByText('数据源操作审计'));
    // expect(navigateSpy).toHaveBeenCalledTimes(19);
    // expect(navigateSpy).toHaveBeenCalledWith(
    //   `/provision/project/${projectID}/audit/service`
    // );

    cleanup();
    jest.clearAllMocks();

    const steps_admin_not_project = AdminUserDevopsSteps({
      navigate: navigateSpy,
      projectID: undefined,
      setOpenRulePageProjectSelectorModal:
        setOpenRulePageProjectSelectorModalSpy
    });
    superRender(<StepItems steps={steps_admin_not_project} />);

    fireEvent.click(screen.getByText('查看审核规则'));
    expect(navigateSpy).toHaveBeenCalledTimes(0);
    expect(setOpenRulePageProjectSelectorModalSpy).toHaveBeenCalledTimes(1);
    expect(setOpenRulePageProjectSelectorModalSpy).toHaveBeenCalledWith(true);

    cleanup();

    const steps_normal = NormalUserDevopsSteps({
      navigate: navigateSpy
    });

    const { container: normal_container } = superRender(
      <StepItems steps={steps_normal} />
    );

    expect(normal_container).toMatchSnapshot();
  });
});
