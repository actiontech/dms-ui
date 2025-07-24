import { cleanup, fireEvent, renderHook, screen } from '@testing-library/react';
import StepItems from '..';
import { baseSuperRender } from '../../../../../../testUtils/superRender';
import { AdminUserDevopsSteps, NormalUserDevopsSteps } from '../index.data';
import { DataSourceManagerSegmentedKey } from '../../../../../DataSourceManagement/index.type';
import { useNavigate } from 'react-router-dom';
import { useTypedNavigate } from '@actiontech/shared';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});
const projectID = '1';

describe('test base/Home/StepItems', () => {
  const navigateSpy = jest.fn();
  const setOpenRulePageProjectSelectorModalSpy = jest.fn();

  const customRender = () => {
    const { result } = renderHook(() => useTypedNavigate());
    const steps_admin = AdminUserDevopsSteps({
      navigate: result.current,
      projectID,
      setOpenRulePageProjectSelectorModal:
        setOpenRulePageProjectSelectorModalSpy
    });
    return baseSuperRender(<StepItems steps={steps_admin} />);
  };
  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  it('should match snapshot', () => {
    const { container } = customRender();
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('查看列表')[0]);
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      1,
      `/project/${projectID}/db-services`
    );

    fireEvent.click(screen.getByText('添加数据源'));
    expect(navigateSpy).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      2,
      `/project/${projectID}/db-services/create`
    );

    fireEvent.click(screen.getAllByText('查看列表')[1]);
    expect(navigateSpy).toHaveBeenCalledTimes(3);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      3,
      `/data-source-management?active=${DataSourceManagerSegmentedKey.SyncDataSource}`
    );

    fireEvent.click(screen.getByText('新建同步任务'));
    expect(navigateSpy).toHaveBeenCalledTimes(4);
    expect(navigateSpy).toHaveBeenNthCalledWith(4, `/sync-data-source/create`);

    fireEvent.click(screen.getByText('查看成员'));
    expect(navigateSpy).toHaveBeenCalledTimes(5);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      5,
      `/project/${projectID}/member`
    );

    fireEvent.click(screen.getByText('进入SQL工作台'));
    expect(navigateSpy).toHaveBeenCalledTimes(6);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      6,
      `/project/${projectID}/cloud-beaver`
    );

    fireEvent.click(screen.getByText('查看审核规则'));
    expect(navigateSpy).toHaveBeenCalledTimes(7);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      7,
      `/sqle/rule?projectID=${projectID}`
    );

    fireEvent.click(screen.getByText('查看规则模板'));
    expect(navigateSpy).toHaveBeenCalledTimes(8);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      8,
      `/sqle/project/${projectID}/rule/template`
    );

    fireEvent.click(screen.getByText('查看SQL管控配置'));
    expect(navigateSpy).toHaveBeenCalledTimes(9);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      9,
      `/sqle/project/${projectID}/sql-management-conf`
    );

    fireEvent.click(screen.getByText('新建SQL审核'));
    expect(navigateSpy).toHaveBeenCalledTimes(10);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      10,
      `/sqle/project/${projectID}/sql-audit/create`
    );

    fireEvent.click(screen.getByText('配置审批流程模板'));
    expect(navigateSpy).toHaveBeenCalledTimes(11);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      11,
      `/sqle/project/${projectID}/progress`
    );

    fireEvent.click(screen.getByText('发起SQL工单'));
    expect(navigateSpy).toHaveBeenCalledTimes(12);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      12,
      `/sqle/project/${projectID}/exec-workflow/create`
    );

    fireEvent.click(screen.getByText('SQLE操作记录'));
    expect(navigateSpy).toHaveBeenCalledTimes(13);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      13,
      `/sqle/project/${projectID}/operation-record`
    );

    fireEvent.click(screen.getByText('发起导出工单'));
    expect(navigateSpy).toHaveBeenCalledTimes(14);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      14,
      `/project/${projectID}/data/export/create`
    );

    cleanup();
    jest.clearAllMocks();

    const steps_admin_not_project = AdminUserDevopsSteps({
      navigate: navigateSpy,
      projectID: '',
      setOpenRulePageProjectSelectorModal:
        setOpenRulePageProjectSelectorModalSpy
    });
    baseSuperRender(<StepItems steps={steps_admin_not_project} />);

    fireEvent.click(screen.getByText('查看审核规则'));
    expect(navigateSpy).toHaveBeenCalledTimes(0);
    expect(setOpenRulePageProjectSelectorModalSpy).toHaveBeenCalledTimes(1);
    expect(setOpenRulePageProjectSelectorModalSpy).toHaveBeenCalledWith(true);

    cleanup();

    const steps_normal = NormalUserDevopsSteps({
      navigate: navigateSpy,
      projectID: ''
    });

    const { container: normal_container } = baseSuperRender(
      <StepItems steps={steps_normal} />
    );

    expect(normal_container).toMatchSnapshot();
  });
});
