import UpdateSqlManagementConf from '../';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockUseProjectBusinessTips } from '@actiontech/shared/lib/testUtil/mockHook/mockUseProjectBusinessTips';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import instanceAuditPlan from '@actiontech/shared/lib/testUtil/mockApi/sqle/instanceAuditPlan';
import {
  mockAuditPlanMetaData,
  mockAuditPlanDetailData
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/instanceAuditPlan/data';
import configuration from '@actiontech/shared/lib/testUtil/mockApi/sqle/configuration';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import {
  instanceInfoMockData,
  instanceTipsMockData
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance/data';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { projectRuleTemplateList } from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template/data';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AuditPlanParamResV1TypeEnum,
  HighPriorityConditionResV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';

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
  let listEnvironmentTagsSpy: jest.SpyInstance;
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
    listEnvironmentTagsSpy = project.listEnvironmentTags();
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
    const { baseElement } = sqleSuperRender(<UpdateSqlManagementConf />);
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
    expect(listEnvironmentTagsSpy).toHaveBeenCalled();
    expect(getBySelector('#environmentTag')).toBeDisabled();
    expect(getBySelector('#instanceType')).toBeDisabled();
    expect(getBySelector('#instanceId')).toBeDisabled();
    expect(screen.getByText('编辑扫描详情·自定义')).toBeInTheDocument();
    expect(
      screen.getByText('编辑扫描详情·MySQL库表元数据')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('environment-1')).toBeInTheDocument();
  });

  it('render update audit plan', async () => {
    const { baseElement } = sqleSuperRender(<UpdateSqlManagementConf />);
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));
    // cancel default
    fireEvent.click(screen.getByText('自定义'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.queryByText('编辑扫描详情·自定义')).not.toBeInTheDocument();

    const aliMysqlLog = mockAuditPlanMetaData[3];
    const planType = aliMysqlLog.audit_plan_type;
    fireEvent.input(
      getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[0].key}`),
      {
        target: { value: 'test' }
      }
    );
    fireEvent.input(getAllBySelector('input[type="password"]')[0], {
      target: { value: '123' }
    });
    fireEvent.input(getAllBySelector('input[type="password"]')[1], {
      target: { value: '456' }
    });
    fireEvent.input(
      getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[3].key}`),
      {
        target: { value: '100' }
      }
    );
    fireEvent.input(
      getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[4].key}`),
      {
        target: { value: '200' }
      }
    );
    fireEvent.input(
      getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[5].key}`),
      {
        target: { value: 'test.com' }
      }
    );
    fireEvent.mouseDown(getBySelector(`#${planType}_ruleTemplateName`));
    fireEvent.click(getBySelector('div[title="default_MySQL1"]'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByTestId('audit_level_switch')).not.toBeChecked();
    expect(screen.getByTestId('row_examined_avg_switch')).toBeChecked();
    expect(screen.getByTestId('query_time_avg_switch')).toBeChecked();

    fireEvent.click(screen.getByTestId('row_examined_avg_switch'));
    fireEvent.click(screen.getByTestId('audit_level_switch'));

    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
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
          need_mark_high_priority_sql: true,
          high_priority_conditions: [
            {
              operator: '>',
              key: 'query_time_avg',
              value: '0.3'
            },
            {
              operator: '>',
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

  it('should not update the password field if it is empty', async () => {
    getInstanceAuditPlanDetailSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          environment: '1',
          instance_type: 'MySQL',
          instance_name: 'mysql-1',
          instance_id: '1739531854064652288',
          audit_plans: [
            {
              audit_plan_params: [],
              audit_plan_type: {
                audit_plan_id: 9,
                type: 'default',
                desc: '自定义'
              },
              rule_template_name: 'default_MySQL1'
            },
            {
              audit_plan_params: [
                {
                  key: 'collect_interval_minute',
                  desc: '采集周期（分钟）',
                  value: '61',
                  type: AuditPlanParamResV1TypeEnum.int
                },
                {
                  key: 'collect_view',
                  desc: '是否采集视图信息',
                  value: 'true',
                  type: AuditPlanParamResV1TypeEnum.bool
                }
              ],
              audit_plan_type: {
                audit_plan_id: 10,
                type: 'mysql_schema_meta',
                desc: 'MySQL库表元数据'
              },
              rule_template_name: 'default_MySQL'
            },
            {
              audit_plan_params: [
                {
                  key: 'db_instance_id',
                  desc: '实例ID',
                  value: '1',
                  type: AuditPlanParamResV1TypeEnum.string
                },
                {
                  key: 'access_key_id',
                  desc: 'Access Key ID',
                  value: '',
                  type: AuditPlanParamResV1TypeEnum.password
                },
                {
                  key: 'access_key_secret',
                  desc: 'Access Key Secret',
                  value: '',
                  type: AuditPlanParamResV1TypeEnum.password
                },
                {
                  key: 'first_sqls_scrapped_in_last_period_hours',
                  desc: '启动任务时拉取慢日志时间范围(单位:小时,最大31天)',
                  value: '1',
                  type: AuditPlanParamResV1TypeEnum.int
                },
                {
                  key: 'audit_sqls_scrapped_in_last_period_minute',
                  desc: '审核过去时间段内抓取的SQL（分钟）',
                  value: '0',
                  type: AuditPlanParamResV1TypeEnum.int
                },
                {
                  key: 'rds_path',
                  desc: 'RDS Open API地址',
                  value: 'rds.aliyuncs.com',
                  type: AuditPlanParamResV1TypeEnum.string
                }
              ],
              need_mark_high_priority_sql: true,
              high_priority_conditions: [
                {
                  key: 'query_time_avg',
                  desc: '平均查询时间',
                  value: '0.3',
                  type: HighPriorityConditionResV1TypeEnum.int,
                  enums_value: undefined,
                  operator: {
                    operator_value: '\u003e',
                    operator_enums_value: [
                      {
                        value: '\u003e',
                        desc: '大于'
                      },
                      {
                        value: '=',
                        desc: '等于'
                      },
                      {
                        value: '\u003c',
                        desc: '小于'
                      }
                    ]
                  }
                },
                {
                  key: 'row_examined_avg',
                  desc: '平均扫描行数',
                  value: '0.5',
                  type: HighPriorityConditionResV1TypeEnum.int,
                  enums_value: undefined,
                  operator: {
                    operator_value: '\u003e',
                    operator_enums_value: [
                      {
                        value: '\u003e',
                        desc: '大于'
                      },
                      {
                        value: '=',
                        desc: '等于'
                      },
                      {
                        value: '\u003c',
                        desc: '小于'
                      }
                    ]
                  }
                }
              ],
              rule_template_name: 'default_MySQL',
              audit_plan_type: {
                audit_plan_id: 11,
                type: 'ali_rds_mysql_slow_log',
                desc: '阿里RDS MySQL慢日志'
              }
            }
          ]
        }
      })
    );
    const { baseElement } = sqleSuperRender(<UpdateSqlManagementConf />);
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('自定义'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.queryByText('编辑扫描详情·自定义')).not.toBeInTheDocument();

    const aliMysqlLog = mockAuditPlanMetaData[3];
    const planType = aliMysqlLog.audit_plan_type;
    fireEvent.input(
      getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[0].key}`),
      {
        target: { value: 'test' }
      }
    );
    fireEvent.input(
      getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[3].key}`),
      {
        target: { value: '100' }
      }
    );
    fireEvent.input(
      getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[4].key}`),
      {
        target: { value: '200' }
      }
    );
    fireEvent.input(
      getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[5].key}`),
      {
        target: { value: 'test.com' }
      }
    );
    fireEvent.mouseDown(getBySelector(`#${planType}_ruleTemplateName`));
    fireEvent.click(getBySelector('div[title="default_MySQL1"]'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByTestId('audit_level_switch')).not.toBeChecked();
    expect(screen.getByTestId('row_examined_avg_switch')).toBeChecked();
    expect(screen.getByTestId('query_time_avg_switch')).toBeChecked();

    fireEvent.click(screen.getByTestId('row_examined_avg_switch'));
    fireEvent.click(screen.getByTestId('audit_level_switch'));

    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
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
          need_mark_high_priority_sql: true,
          high_priority_conditions: [
            {
              operator: '>',
              key: 'query_time_avg',
              value: '0.3'
            },
            {
              operator: '>',
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
