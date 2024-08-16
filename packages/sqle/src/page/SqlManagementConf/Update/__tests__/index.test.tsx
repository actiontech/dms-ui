import UpdateSqlManagementConf from '../';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockUseProjectBusinessTips } from '@actiontech/shared/lib/testUtil/mockHook/mockUseProjectBusinessTips';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import instanceAuditPlan from '../../../../testUtils/mockApi/instanceAuditPlan';
import {
  mockAuditPlanMetaData,
  mockAuditPlanDetailData
} from '../../../../testUtils/mockApi/instanceAuditPlan/data';
import configuration from '../../../../testUtils/mockApi/configuration';
import instance from '../../../../testUtils/mockApi/instance';
import {
  instanceInfoMockData,
  instanceTipsMockData
} from '../../../../testUtils/mockApi/instance/data';
import rule_template from '../../../../testUtils/mockApi/rule_template';
import { projectRuleTemplateList } from '../../../../testUtils/mockApi/rule_template/data';
import { superRender } from '../../../../testUtils/customRender';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { useParams, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn()
  };
});

describe('test sqle/SqlManagementConf/Update', () => {
  let updateInstanceAuditPlanSpy: jest.SpyInstance;
  let getAuditPlanMetaSpy: jest.SpyInstance;
  let getDriversSpy: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;
  let getProjectRuleTemplateTipSpy: jest.SpyInstance;
  let getInstanceSpy: jest.SpyInstance;
  let getGlobalRuleTemplateTipSpy: jest.SpyInstance;
  let getInstanceAuditPlanDetailSpy: jest.SpyInstance;

  const auditPlanId = '1';

  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const navigateSpy = jest.fn();

  beforeEach(() => {
    mockUseProjectBusinessTips();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    getInstanceAuditPlanDetailSpy =
      instanceAuditPlan.getInstanceAuditPlanDetail();
    updateInstanceAuditPlanSpy = instanceAuditPlan.updateInstanceAuditPlan();
    getAuditPlanMetaSpy = instanceAuditPlan.getAuditPlanMeta();
    getDriversSpy = configuration.getDrivers();
    getProjectRuleTemplateTipSpy = rule_template.getProjectRuleTemplateTips();
    getGlobalRuleTemplateTipSpy = rule_template.getRuleTemplateTips();
    getInstanceTipListSpy = instance.getInstanceTipList();
    getInstanceSpy = instance.getInstance();
    getInstanceSpy.mockClear();
    getInstanceSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...instanceInfoMockData,
          rule_template: {
            name: projectRuleTemplateList[0].rule_template_name,
            is_global_rule_template: true
          }
        }
      })
    );
    useParamsMock.mockReturnValue({ id: auditPlanId });
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render init snap shot', async () => {
    const { baseElement } = superRender(<UpdateSqlManagementConf />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('为数据源开启扫描任务')).toBeInTheDocument();
    expect(screen.getByText('返回智能扫描配置')).toBeInTheDocument();
    expect(screen.getByText('重 置')).toBeInTheDocument();
    expect(screen.getByText('提 交')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getInstanceAuditPlanDetailSpy).toHaveBeenCalledTimes(1);
    expect(getDriversSpy).toHaveBeenCalled();
    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalled();
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalled();
    expect(getInstanceTipListSpy).toHaveBeenCalled();
    expect(getAuditPlanMetaSpy).toHaveBeenCalled();
    expect(getInstanceSpy).toHaveBeenCalled();
    expect(getBySelector('#businessScope')).toBeDisabled();
    expect(getBySelector('#instanceType')).toBeDisabled();
    expect(getBySelector('#instanceId')).toBeDisabled();
    expect(screen.getByText('编辑扫描详情·自定义')).toBeInTheDocument();
    expect(
      screen.getByText('编辑扫描详情·MySQL库表元数据')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('business1')).toBeInTheDocument();
  });

  it('render update audit plan', async () => {
    const { baseElement } = superRender(<UpdateSqlManagementConf />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceAuditPlanDetailSpy).toHaveBeenCalledTimes(1);
    expect(getDriversSpy).toHaveBeenCalled();
    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalled();
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalled();
    expect(getInstanceTipListSpy).toHaveBeenCalled();
    expect(getAuditPlanMetaSpy).toHaveBeenCalled();
    expect(getInstanceSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    // cancel default
    fireEvent.click(screen.getByText('自定义'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.queryByText('编辑扫描详情·自定义')).not.toBeInTheDocument();

    const aliMysqlLog = mockAuditPlanMetaData[3];
    const planType = aliMysqlLog.audit_plan_type;
    await act(async () => {
      fireEvent.input(
        getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[0].key}`),
        {
          target: { value: 'test' }
        }
      );
      await jest.advanceTimersByTime(100);
    });
    await act(async () => {
      fireEvent.input(getAllBySelector('input[type="password"]')[0], {
        target: { value: '123' }
      });
      await jest.advanceTimersByTime(100);
    });
    await act(async () => {
      fireEvent.input(getAllBySelector('input[type="password"]')[1], {
        target: { value: '456' }
      });
      await jest.advanceTimersByTime(100);
    });
    await act(async () => {
      fireEvent.input(
        getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[3].key}`),
        {
          target: { value: '100' }
        }
      );
      await jest.advanceTimersByTime(100);
    });
    await act(async () => {
      fireEvent.input(
        getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[4].key}`),
        {
          target: { value: '200' }
        }
      );
      await jest.advanceTimersByTime(100);
    });
    await act(async () => {
      fireEvent.input(
        getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[5].key}`),
        {
          target: { value: 'test.com' }
        }
      );
      await jest.advanceTimersByTime(100);
    });
    fireEvent.mouseDown(getBySelector(`#${planType}_ruleTemplateName`));
    await act(async () => {
      fireEvent.click(getBySelector('div[title="default_MySQL1"]'));
      await jest.advanceTimersByTime(100);
    });

    expect(screen.getByTestId('audit_level_switch')).not.toBeChecked();
    expect(screen.getByTestId('row_examined_avg_switch')).toBeChecked();
    expect(screen.getByTestId('query_time_avg_switch')).toBeChecked();

    fireEvent.click(screen.getByTestId('row_examined_avg_switch'));
    fireEvent.click(screen.getByTestId('audit_level_switch'));

    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(updateInstanceAuditPlanSpy).toHaveBeenCalledTimes(1);
    expect(updateInstanceAuditPlanSpy).toHaveBeenNthCalledWith(1, {
      instance_audit_plan_id: auditPlanId,
      project_name: mockProjectInfo.projectName,
      audit_plans: [
        {
          audit_plan_params: [
            {
              key: 'collect_interval_minute',
              value: '61'
            },
            {
              key: 'collect_view',
              value: 'true'
            }
          ],
          audit_plan_type: 'mysql_schema_meta',
          rule_template_name: 'default_MySQL'
        },
        {
          audit_plan_params: [
            {
              key: 'db_instance_id',
              value: 'test'
            },
            {
              key: 'access_key_id',
              value: '123'
            },
            {
              key: 'access_key_secret',
              value: '456'
            },
            {
              key: 'first_sqls_scrapped_in_last_period_hours',
              value: '100'
            },
            {
              key: 'audit_sqls_scrapped_in_last_period_minute',
              value: '200'
            },
            {
              key: 'rds_path',
              value: 'test.com'
            }
          ],
          mark_high_priority_sql: true,
          high_priority_conditions: [
            {
              boolean_operator: '>',
              key: 'query_time_avg',
              value: '0.3'
            },
            {
              boolean_operator: '>',
              key: 'audit_level',
              value: 'warn'
            }
          ],
          audit_plan_type: 'ali_rds_mysql_slow_log',
          rule_template_name: 'default_MySQL1'
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      1,
      `/sqle/project/${mockProjectInfo.projectID}/sql-management-conf`
    );
  });
});
