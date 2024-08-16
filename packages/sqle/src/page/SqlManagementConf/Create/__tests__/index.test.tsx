import CreateSqlManagementConf from '../';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockUseProjectBusinessTips } from '@actiontech/shared/lib/testUtil/mockHook/mockUseProjectBusinessTips';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import instanceAuditPlan from '../../../../testUtils/mockApi/instanceAuditPlan';
import { mockAuditPlanMetaData } from '../../../../testUtils/mockApi/instanceAuditPlan/data';
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

describe('test sqle/SqlManagementConf/Create', () => {
  let createInstanceAuditPlanSpy: jest.SpyInstance;
  let getAuditPlanMetaSpy: jest.SpyInstance;
  let getDriversSpy: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;
  let getProjectRuleTemplateTipSpy: jest.SpyInstance;
  let getInstanceSpy: jest.SpyInstance;
  let getGlobalRuleTemplateTipSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseProjectBusinessTips();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    createInstanceAuditPlanSpy = instanceAuditPlan.createInstanceAuditPlan();
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
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render init snap shot', async () => {
    const { baseElement } = superRender(<CreateSqlManagementConf />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('为数据源开启扫描任务')).toBeInTheDocument();
    expect(screen.getByText('返回智能扫描配置')).toBeInTheDocument();
    expect(screen.getByText('重 置')).toBeInTheDocument();
    expect(screen.getByText('提 交')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
  });

  it('render create audit plan', async () => {
    const { baseElement } = superRender(
      <CreateSqlManagementConf />,
      undefined,
      {
        routerProps: {
          initialEntries: ['/sqle/project/700300/sql-management-conf/create']
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#businessScope'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(getBySelector('div[title="business1"]'));

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceTipListSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      filter_by_business: 'business1'
    });

    fireEvent.mouseDown(getBySelector('#instanceType'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('span[title="mysql"]'));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(2);
    expect(getInstanceTipListSpy).toHaveBeenNthCalledWith(2, {
      project_name: mockProjectInfo.projectName,
      filter_by_business: 'business1',
      filter_db_type: 'mysql'
    });
    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalledTimes(2);
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalledTimes(2);
    expect(getAuditPlanMetaSpy).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(getBySelector('#instanceId'));
    await act(async () => jest.advanceTimersByTime(0));
    const instance = instanceTipsMockData[0];
    fireEvent.click(
      getBySelector(
        `div[title="${instance.instance_name}(${instance.host}:${instance.port})"]`
      )
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalledTimes(3);
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalledTimes(3);
    expect(getAuditPlanMetaSpy).toHaveBeenCalledTimes(2);
    expect(getAuditPlanMetaSpy).toHaveBeenNthCalledWith(2, {
      filter_instance_type: instance.instance_type,
      filter_instance_id: instance.instance_id
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();

    await act(async () => fireEvent.click(screen.getByText('全部')));

    await act(async () => jest.advanceTimersByTime(0));

    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(
        `编辑扫描详情·${mockAuditPlanMetaData[0].audit_plan_type_desc}`
      )
    ).toBeInTheDocument();

    // template
    fireEvent.mouseDown(
      getBySelector(
        `#${mockAuditPlanMetaData[0].audit_plan_type}_ruleTemplateName`
      )
    );
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () =>
      fireEvent.click(getBySelector('div[title="default_MySQL1"]'))
    );
    await act(async () => jest.advanceTimersByTime(0));

    // MySQL库表元数据
    const schemaMetaParamIntTarget = getBySelector(
      `#${mockAuditPlanMetaData[2].audit_plan_type}_${mockAuditPlanMetaData[2]?.audit_plan_params?.[0]?.key}`
    );
    expect(schemaMetaParamIntTarget).toHaveValue(
      mockAuditPlanMetaData[2]?.audit_plan_params?.[0]?.value
    );
    await act(async () => {
      fireEvent.input(schemaMetaParamIntTarget, {
        target: { value: '61' }
      });
      await jest.advanceTimersByTime(0);
    });
    const schemaMetaParamBoolTarget = getBySelector(
      `#${mockAuditPlanMetaData[2].audit_plan_type}_${mockAuditPlanMetaData[2]?.audit_plan_params?.[1]?.key}`
    );
    expect(schemaMetaParamBoolTarget).not.toBeChecked();
    await act(async () => fireEvent.click(schemaMetaParamBoolTarget));

    await act(async () => jest.advanceTimersByTime(0));

    expect(schemaMetaParamBoolTarget).toBeChecked();

    expect(screen.getAllByText('标记高优先级SQL')[0]).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('标记高优先级SQL')[0]);
    expect(
      screen.getByTestId(
        `${mockAuditPlanMetaData[3]?.high_priority_conditions?.[0].key}_switch`
      )
    ).toBeChecked();
    expect(
      screen.getByTestId(
        `${mockAuditPlanMetaData[3]?.high_priority_conditions?.[1].key}_switch`
      )
    ).toBeChecked();
    expect(
      screen.getByTestId(
        `${mockAuditPlanMetaData[3]?.high_priority_conditions?.[2].key}_switch`
      )
    ).toBeChecked();

    fireEvent.click(
      screen.getByTestId(
        `${mockAuditPlanMetaData[3]?.high_priority_conditions?.[0].key}_switch`
      )
    );

    expect(screen.getByText('编辑扫描详情·测试扫描类型')).toBeInTheDocument();
    fireEvent.mouseDown(getBySelector('#custom_plan_custom_plan_ENV'));
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => {
      fireEvent.click(getBySelector('div[title="PROD"]'));
      await jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(createInstanceAuditPlanSpy).toHaveBeenCalledTimes(1);
    expect(createInstanceAuditPlanSpy).toHaveBeenNthCalledWith(1, {
      instance_id: instance.instance_id,
      project_name: mockProjectInfo.projectName,
      audit_plans: [
        {
          audit_plan_params: [],
          audit_plan_type: 'default',
          rule_template_name: 'default_MySQL1'
        },
        {
          audit_plan_params: [],
          audit_plan_type: 'mysql_mybatis',
          rule_template_name: 'default_MySQL'
        },
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
              value: ''
            },
            {
              key: 'access_key_id',
              value: ''
            },
            {
              key: 'access_key_secret',
              value: ''
            },
            {
              key: 'first_sqls_scrapped_in_last_period_hours',
              value: ''
            },
            {
              key: 'audit_sqls_scrapped_in_last_period_minute',
              value: '0'
            },
            {
              key: 'rds_path',
              value: 'rds.aliyuncs.com'
            }
          ],
          high_priority_conditions: [
            {
              operator: '>',
              key: 'row_examined_avg',
              value: '100'
            },
            {
              operator: '>',
              key: 'audit_level',
              value: 'warn'
            }
          ],
          need_mark_high_priority_sql: true,
          audit_plan_type: 'ali_rds_mysql_slow_log',
          rule_template_name: 'default_MySQL'
        },
        {
          audit_plan_params: [],
          audit_plan_type: 'sql_file',
          rule_template_name: 'default_MySQL'
        },
        {
          audit_plan_params: [
            {
              key: 'custom_plan_ENV',
              value: 'PROD'
            }
          ],
          audit_plan_type: 'custom_plan',
          rule_template_name: 'default_MySQL'
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('创建SQL管控配置成功')).toBeInTheDocument();
    fireEvent.click(screen.getByText('重置表单'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(0));
  });

  it('create audit plan when current url has params', async () => {
    const instanceId = instanceTipsMockData[0].instance_id;
    const { baseElement } = superRender(
      <CreateSqlManagementConf />,
      undefined,
      {
        routerProps: {
          initialEntries: [
            `/sqle/project/700300/sql-management-conf/create?instance_id=${instanceId}&business=business2`
          ]
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalledTimes(2);
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalledTimes(2);
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceTipListSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName
    });
    expect(getAuditPlanMetaSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('#businessScope')).toBeDisabled();
    expect(getBySelector('#instanceType')).toBeDisabled();
    expect(getBySelector('#instanceId')).toBeDisabled();
    fireEvent.click(screen.getByText('自定义'));
    await act(async () => jest.advanceTimersByTime(0));
    const defaultType = mockAuditPlanMetaData[0];
    expect(
      screen.getByText(`编辑扫描详情·${defaultType.audit_plan_type_desc}`)
    ).toBeInTheDocument();
    fireEvent.mouseDown(
      getBySelector(`#${defaultType.audit_plan_type}_ruleTemplateName`)
    );
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => {
      fireEvent.click(getBySelector('div[title="default_MySQL1"]'));
      await jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('自定义'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.queryByText(`编辑扫描详情·${defaultType.audit_plan_type_desc}`)
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('阿里RDS MySQL慢日志'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText(`编辑扫描详情·阿里RDS MySQL慢日志`)
    ).toBeInTheDocument();
    const aliMysqlLog = mockAuditPlanMetaData[3];
    const planType = aliMysqlLog.audit_plan_type;
    await act(async () => {
      fireEvent.input(
        getBySelector(`#${planType}_${aliMysqlLog.audit_plan_params?.[0].key}`),
        {
          target: { value: 'test' }
        }
      );
      await jest.advanceTimersByTime(0);
    });
    await act(async () => {
      fireEvent.input(getAllBySelector('input[type="password"]')[0], {
        target: { value: '123' }
      });
      await jest.advanceTimersByTime(0);
    });
    await act(async () => {
      fireEvent.input(getAllBySelector('input[type="password"]')[1], {
        target: { value: '456' }
      });
      await jest.advanceTimersByTime(0);
    });
    fireEvent.mouseDown(getBySelector(`#${planType}_ruleTemplateName`));
    await act(async () => {
      fireEvent.click(getBySelector('div[title="default_MySQL1"]'));
      await jest.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(createInstanceAuditPlanSpy).toHaveBeenCalledTimes(1);
    expect(createInstanceAuditPlanSpy).toHaveBeenNthCalledWith(1, {
      instance_id: instanceId,
      project_name: mockProjectInfo.projectName,
      audit_plans: [
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
              value: ''
            },
            {
              key: 'audit_sqls_scrapped_in_last_period_minute',
              value: '0'
            },
            {
              key: 'rds_path',
              value: 'rds.aliyuncs.com'
            }
          ],
          audit_plan_type: 'ali_rds_mysql_slow_log',
          rule_template_name: 'default_MySQL1'
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('创建SQL管控配置成功')).toBeInTheDocument();
    fireEvent.click(screen.getByText('重置表单'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('business2')).toBeInTheDocument();
  });
});
