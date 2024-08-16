import ConfForm from '../';
import { cleanup, act, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockUseProjectBusinessTips } from '@actiontech/shared/lib/testUtil/mockHook/mockUseProjectBusinessTips';
import {
  mockAuditPlanMetaData,
  mockAuditPlanDetailData
} from '../../../../../testUtils/mockApi/instanceAuditPlan/data';
import configuration from '../../../../../testUtils/mockApi/configuration';
import instance from '../../../../../testUtils/mockApi/instance';
import { instanceInfoMockData } from '../../../../../testUtils/mockApi/instance/data';
import rule_template from '../../../../../testUtils/mockApi/rule_template';
import { projectRuleTemplateList } from '../../../../../testUtils/mockApi/rule_template/data';
import {
  superRender,
  renderHooksWithTheme
} from '../../../../../testUtils/customRender';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { FormStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { ConfFormContextProvide, SelectScanTypeParamsType } from '../context';
import { Form } from 'antd';
import { SqlManagementConfFormFields } from '../index.type';
import { AuditPlanParamResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('test sqle/SqlManagementConf/ConfForm', () => {
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
    cleanup();
  });

  const customRender = (
    selectedScanTypeParams: SelectScanTypeParamsType = [],
    defaultValue?: SqlManagementConfFormFields
  ) => {
    const { result } = renderHooksWithTheme(() => Form.useForm());
    const { baseElement } = superRender(
      <ConfFormContextProvide
        value={{
          submitLoading: false,
          scanTypeMetas: mockAuditPlanMetaData,
          getScanTypeMetaPending: false,
          selectedScanTypeParams,
          defaultValue
        }}
      >
        <FormStyleWrapper colon={false} form={result.current[0]}>
          <ConfForm />
        </FormStyleWrapper>
      </ConfFormContextProvide>
    );
    return { baseElement, form: result.current[0] };
  };

  it('render init snap shot', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
  });

  it('render snap shot when defaultValue is defined', async () => {
    const { baseElement } = customRender(
      [
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
        }
      ],
      {
        businessScope: mockAuditPlanDetailData.business!,
        instanceType: mockAuditPlanDetailData.instance_type!,
        instanceName: mockAuditPlanDetailData.instance_name!,
        instanceId: mockAuditPlanDetailData.instance_id!,
        scanTypes: ['mysql_schema_meta'],
        mysql_schema_meta: {
          collect_interval_minute: '61',
          collect_view: false,
          ruleTemplateName: 'default_MySQL',
          prioritySqlConditions: {},
          markHighPrioritySql: false
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getDriversSpy).toHaveBeenCalled();
    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalled();
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalled();
    expect(getInstanceTipListSpy).toHaveBeenCalled();
    expect(getInstanceSpy).toHaveBeenCalled();
    expect(getBySelector('#businessScope')).toBeDisabled();
    expect(getBySelector('#instanceType')).toBeDisabled();
    expect(getBySelector('#instanceId')).toBeDisabled();
    expect(screen.getByText('MySQL库表元数据')).toBeInTheDocument();
  });
});
