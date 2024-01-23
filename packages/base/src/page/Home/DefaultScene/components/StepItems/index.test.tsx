import { cleanup, fireEvent, screen } from '@testing-library/react';
import StepItems from '.';
import { superRender } from '../../../../../testUtils/customRender';
import { AdminUserDevopsSteps, NormalUserDevopsSteps } from './index.data';
import { RuleUrlParamKey } from 'sqle/src/page/Rule/hooks/useRuleFilterFormItem';

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
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).toBeCalledWith(`/project/${projectID}/db-services`);

    fireEvent.click(screen.getByText('添加数据源'));
    expect(navigateSpy).toBeCalledTimes(2);
    expect(navigateSpy).toBeCalledWith(
      `/project/${projectID}/db-services/create`
    );

    fireEvent.click(screen.getAllByText('查看列表')[1]);
    expect(navigateSpy).toBeCalledTimes(3);
    expect(navigateSpy).toBeCalledWith(`/project/${projectID}/syncDataSource`);

    fireEvent.click(screen.getByText('新建同步任务'));
    expect(navigateSpy).toBeCalledTimes(4);
    expect(navigateSpy).toBeCalledWith(
      `/project/${projectID}/syncDataSource/create`
    );

    fireEvent.click(screen.getByText('查看成员'));
    expect(navigateSpy).toBeCalledTimes(5);
    expect(navigateSpy).toBeCalledWith(`/project/${projectID}/member`);

    fireEvent.click(screen.getByText('进入SQL工作台'));
    expect(navigateSpy).toBeCalledTimes(6);
    expect(navigateSpy).toBeCalledWith(`/cloudBeaver`);

    fireEvent.click(screen.getByText('查看审核规则'));
    expect(navigateSpy).toBeCalledTimes(7);
    expect(navigateSpy).toBeCalledWith(
      `/sqle/rule?${RuleUrlParamKey.projectID}=${projectID}`
    );

    fireEvent.click(screen.getByText('查看规则模板'));
    expect(navigateSpy).toBeCalledTimes(8);
    expect(navigateSpy).toBeCalledWith(
      `/sqle/project/${projectID}/rule/template`
    );

    fireEvent.click(screen.getByText('查看智能扫描'));
    expect(navigateSpy).toBeCalledTimes(9);
    expect(navigateSpy).toBeCalledWith(`/sqle/project/${projectID}/auditPlan`);

    fireEvent.click(screen.getByText('新建SQL审核'));
    expect(navigateSpy).toBeCalledTimes(10);
    expect(navigateSpy).toBeCalledWith(
      `/sqle/project/${projectID}/sqlAudit/create`
    );

    fireEvent.click(screen.getByText('配置审批流程模板'));
    expect(navigateSpy).toBeCalledTimes(11);
    expect(navigateSpy).toBeCalledWith(`/sqle/project/${projectID}/progress`);

    fireEvent.click(screen.getByText('发起SQL工单'));
    expect(navigateSpy).toBeCalledTimes(12);
    expect(navigateSpy).toBeCalledWith(
      `/sqle/project/${projectID}/order/create`
    );

    fireEvent.click(screen.getByText('SQLE操作记录'));
    expect(navigateSpy).toBeCalledTimes(13);
    expect(navigateSpy).toBeCalledWith(
      `/sqle/project/${projectID}/operationRecord`
    );

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
    expect(navigateSpy).toBeCalledTimes(0);
    expect(setOpenRulePageProjectSelectorModalSpy).toBeCalledTimes(1);
    expect(setOpenRulePageProjectSelectorModalSpy).toBeCalledWith(true);

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
