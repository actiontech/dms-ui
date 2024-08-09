import ScanTypesDynamicParams from '../ScanTypesDynamicParams';
import {
  superRender,
  renderHooksWithTheme
} from '../../../../../testUtils/customRender';
import { ConfFormContextProvide, SelectScanTypeParamsType } from '../context';
import { Form } from 'antd';
import {
  mockAuditPlanMetaData,
  mockAuditPlanDetailData
} from '../../../../../testUtils/mockApi/instanceAuditPlan/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { cleanup, act } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { AuditPlanParamResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import rule_template from '../../../../../testUtils/mockApi/rule_template';
import { SqlManagementConfFormFields } from '../index.type';

describe('test SqlManagementConf/ScanTypesDynamicParams', () => {
  let getProjectRuleTemplateTipSpy: jest.SpyInstance;
  let getGlobalRuleTemplateTipSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    getProjectRuleTemplateTipSpy = rule_template.getProjectRuleTemplateTips();
    getGlobalRuleTemplateTipSpy = rule_template.getRuleTemplateTips();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const selectedScanTypeParamsMock = [
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
  ];

  const customRender = (
    submitLoading = false,
    selectedScanTypeParams: SelectScanTypeParamsType = selectedScanTypeParamsMock,
    defaultValue?: SqlManagementConfFormFields
  ) => {
    const formWatchSpy = jest.spyOn(Form, 'useWatch');
    formWatchSpy.mockImplementation(() => 'MySQL');
    const { result } = renderHooksWithTheme(() => Form.useForm());
    return superRender(
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
      businessScope: mockAuditPlanDetailData.business,
      instanceType: mockAuditPlanDetailData.instance_type,
      instanceName: mockAuditPlanDetailData.instance_name,
      instanceId: mockAuditPlanDetailData.instance_id,
      scanTypes: ['mysql_schema_meta'],
      mysql_schema_meta: {
        collect_interval_minute: '61',
        collect_view: false,
        ruleTemplateName: 'default_MySQL'
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
});
