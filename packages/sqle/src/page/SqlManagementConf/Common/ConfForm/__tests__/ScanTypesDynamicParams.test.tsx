import ScanTypesDynamicParams from '../ScanTypesDynamicParams';
import {
  sqleSuperRender,
  sqleSuperRenderHook
} from '../../../../../testUtils/superRender';
import { ConfFormContextProvide, SelectScanTypeParamsType } from '../context';
import { Form } from 'antd';
import {
  mockAuditPlanMetaData,
  mockAuditPlanDetailData
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/instanceAuditPlan/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { cleanup, act } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { AuditPlanParamResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { SqlManagementConfFormFields } from '../index.type';

describe('test SqlManagementConf/ScanTypesDynamicParams', () => {
  let getProjectRuleTemplateTipSpy: jest.SpyInstance;
  let getGlobalRuleTemplateTipSpy: jest.SpyInstance;
  const formWatchSpy = jest.spyOn(Form, 'useWatch');

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    getProjectRuleTemplateTipSpy = rule_template.getProjectRuleTemplateTips();
    getGlobalRuleTemplateTipSpy = rule_template.getRuleTemplateTips();
    formWatchSpy.mockImplementation(() => 'MySQL');
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const selectedScanTypeParamsMock: SelectScanTypeParamsType = [
    {
      mysql_schema_meta: [
        {
          desc: '采集周期（分钟）',
          key: 'collect_interval_minute',
          type: AuditPlanParamResV1TypeEnum.int,
          value: '60'
        },
        {
          desc: '是否采集视图信息',
          key: 'collect_view',
          type: AuditPlanParamResV1TypeEnum.bool,
          value: '0'
        }
      ]
    },
    {
      ali_rds_mysql_slow_log: [
        {
          key: 'db_instance_id',
          desc: '实例ID',
          value: '',
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
          value: '',
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
      ]
    }
  ];

  const customRender = (
    submitLoading = false,
    selectedScanTypeParams: SelectScanTypeParamsType = selectedScanTypeParamsMock,
    defaultValue?: SqlManagementConfFormFields
  ) => {
    const { result } = sqleSuperRenderHook(() => Form.useForm());
    return sqleSuperRender(
      <ConfFormContextProvide
        value={{
          submitLoading,
          scanTypeMetas: mockAuditPlanMetaData,
          getScanTypeMetaPending: false,
          selectedScanTypeParams,
          defaultValue
        }}
      >
        <Form form={result.current[0]}>
          <ScanTypesDynamicParams />
        </Form>
      </ConfFormContextProvide>
    );
  };

  it('render init snap shot', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
  });

  it('render submitLoading is true', async () => {
    const { baseElement } = customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(
      getBySelector('#mysql_schema_meta_collect_interval_minute')
    ).toBeDisabled();
    expect(getBySelector('#mysql_schema_meta_collect_view')).toBeDisabled();
    expect(getBySelector('#mysql_schema_meta_ruleTemplateName')).toBeDisabled();
  });

  it('render defaultValue is defined', async () => {
    const { baseElement } = customRender(false, selectedScanTypeParamsMock, {
      environmentTag: mockAuditPlanDetailData.environment!,
      instanceType: mockAuditPlanDetailData.instance_type!,
      instanceName: mockAuditPlanDetailData.instance_name!,
      instanceId: mockAuditPlanDetailData.instance_id!,
      scanTypes: ['mysql_schema_meta'],
      mysql_schema_meta: {
        collect_interval_minute: '61',
        collect_view: false,
        ruleTemplateName: 'default_MySQL',
        markHighPrioritySql: false,
        prioritySqlConditions: {}
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render param key is empty string', async () => {
    const { baseElement } = customRender(false, [
      {
        '': [
          {
            desc: '采集周期（分钟）',
            key: 'collect_interval_minute',
            type: AuditPlanParamResV1TypeEnum.int,
            value: '60'
          }
        ]
      }
    ]);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render mysql_slow_log params', async () => {
    formWatchSpy
      .mockImplementation(() => 'MySQL')
      .mockImplementation(() => '0');
    customRender(false, [
      {
        mysql_slow_log: [
          {
            key: 'collect_interval_minute',
            desc: '采集周期（分钟，仅对 mysql.slow_log 有效）',
            value: '60',
            type: AuditPlanParamResV1TypeEnum.int,
            enums_value: undefined
          },
          {
            key: 'slow_log_collect_input',
            desc: '采集来源',
            value: '0',
            type: AuditPlanParamResV1TypeEnum.int,
            enums_value: [
              {
                value: '0',
                desc: '从slow.log 文件采集,需要适配scanner'
              },
              {
                value: '1',
                desc: '从mysql.slow_log 表采集'
              }
            ]
          },
          {
            key: 'first_sqls_scrapped_in_last_period_hours',
            desc: '启动任务时拉取慢日志时间范围(单位:小时，仅对 mysql.slow_log 有效)',
            value: '1',
            type: AuditPlanParamResV1TypeEnum.int
          }
        ]
      }
    ]);

    expect(
      getBySelector('#mysql_slow_log_collect_interval_minute').parentElement
        ?.parentElement?.parentElement?.parentElement?.parentElement
    ).toHaveClass('ant-form-item-hidden');
    expect(
      getBySelector('#mysql_slow_log_first_sqls_scrapped_in_last_period_hours')
        .parentElement?.parentElement?.parentElement?.parentElement
        ?.parentElement
    ).toHaveClass('ant-form-item-hidden');

    cleanup();

    formWatchSpy
      .mockImplementation(() => 'MySQL')
      .mockImplementation(() => '1');

    customRender(false, [
      {
        mysql_slow_log: [
          {
            key: 'collect_interval_minute',
            desc: '采集周期（分钟，仅对 mysql.slow_log 有效）',
            value: '60',
            type: AuditPlanParamResV1TypeEnum.int,
            enums_value: undefined
          },
          {
            key: 'slow_log_collect_input',
            desc: '采集来源',
            value: '0',
            type: AuditPlanParamResV1TypeEnum.int,
            enums_value: [
              {
                value: '0',
                desc: '从slow.log 文件采集,需要适配scanner'
              },
              {
                value: '1',
                desc: '从mysql.slow_log 表采集'
              }
            ]
          },
          {
            key: 'first_sqls_scrapped_in_last_period_hours',
            desc: '启动任务时拉取慢日志时间范围(单位:小时，仅对 mysql.slow_log 有效)',
            value: '1',
            type: AuditPlanParamResV1TypeEnum.int
          }
        ]
      }
    ]);

    expect(
      getBySelector('#mysql_slow_log_collect_interval_minute').parentElement
        ?.parentElement?.parentElement?.parentElement?.parentElement
    ).not.toHaveClass('ant-form-item-hidden');
    expect(
      getBySelector('#mysql_slow_log_first_sqls_scrapped_in_last_period_hours')
        .parentElement?.parentElement?.parentElement?.parentElement
        ?.parentElement
    ).not.toHaveClass('ant-form-item-hidden');
  });
});
