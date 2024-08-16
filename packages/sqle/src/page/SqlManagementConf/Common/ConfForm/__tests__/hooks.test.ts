import { Form } from 'antd';
import { useSqlManagementConfFormSharedStates } from '../hooks';
import instanceAuditPlan from '../../../../../testUtils/mockApi/instanceAuditPlan';
import { mockAuditPlanMetaData } from '../../../../../testUtils/mockApi/instanceAuditPlan/data';
import { act, renderHook } from '@testing-library/react';
import { AuditPlanParamResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('test SqlManagementConf/common/ConfForm/hooks', () => {
  let getAuditPlanMetasSpy: jest.SpyInstance;

  let resetFieldsSpy = jest.fn();
  let getFieldsValueSpy = jest.fn();
  beforeEach(() => {
    getAuditPlanMetasSpy = instanceAuditPlan.getAuditPlanMeta();
    jest.spyOn(Form, 'useForm').mockReturnValue([
      {
        resetFields: resetFieldsSpy,
        getFieldsValue: getFieldsValueSpy
      } as any
    ]);
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should not fetch scan type metas when ready is equal false', async () => {
    jest.spyOn(Form, 'useWatch').mockReturnValue(undefined);
    renderHook(() => useSqlManagementConfFormSharedStates());

    expect(getAuditPlanMetasSpy).toHaveBeenCalledTimes(0);
  });

  it('should fetch scan type metas data correctly based on selected instance type and id', async () => {
    jest
      .spyOn(Form, 'useWatch')
      .mockReturnValueOnce('MySQL')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce([])
      .mockReturnValueOnce('Oracle')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce([])
      .mockReturnValueOnce('Oracle')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce([]);

    const { result } = renderHook(() => useSqlManagementConfFormSharedStates());
    expect(getAuditPlanMetasSpy).toHaveBeenCalledTimes(2);
    expect(getAuditPlanMetasSpy).toHaveBeenNthCalledWith(1, {
      filter_instance_type: 'MySQL',
      filter_instance_id: '123'
    });
    expect(result.current.getScanTypeMetaPending).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAuditPlanMetasSpy).toHaveBeenNthCalledWith(2, {
      filter_instance_type: 'Oracle',
      filter_instance_id: '123'
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.getScanTypeMetaPending).toBeFalsy();
    expect(result.current.scanTypeMetas).toEqual(mockAuditPlanMetaData);
  });

  it('should reset form fields except for the freezing fields', async () => {
    getFieldsValueSpy.mockReturnValue({
      scanTypes: [],
      instanceId: '123',
      instanceName: 'mysql-1',
      instanceType: 'MySQL'
    });

    const { result } = renderHook(() => useSqlManagementConfFormSharedStates());

    await act(() => {
      result.current.resetFormExceptFreezingFields();
    });
    expect(getFieldsValueSpy).toHaveBeenCalledTimes(1);
    expect(resetFieldsSpy).toHaveBeenCalledTimes(1);
    expect(resetFieldsSpy).toHaveBeenNthCalledWith(1, ['scanTypes']);
  });

  it('should set submit loading state correctly', async () => {
    const { result } = renderHook(() => useSqlManagementConfFormSharedStates());
    expect(result.current.submitLoading).toBeFalsy();
    await act(() => {
      result.current.startSubmit();
    });
    expect(result.current.submitLoading).toBeTruthy();
    await act(() => {
      result.current.finishSubmit();
    });
    expect(result.current.submitLoading).toBeFalsy();
  });

  it('should compute selected scan type params based on scan type metas and selected types', async () => {
    jest
      .spyOn(Form, 'useWatch')
      .mockReturnValueOnce('MySQL')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce(['mysql_mybatis', 'ali_rds_mysql_slow_log'])
      .mockReturnValueOnce('MySQL')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce(['mysql_mybatis', 'ali_rds_mysql_slow_log'])
      .mockReturnValueOnce('MySQL')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce(['mysql_mybatis', 'ali_rds_mysql_slow_log']);

    const { result } = renderHook(() => useSqlManagementConfFormSharedStates());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.selectedScanTypeParams).toEqual([
      {
        mysql_mybatis: []
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
    ]);
  });

  it('should update submit success status after successful form submission', async () => {
    const { result } = renderHook(() => useSqlManagementConfFormSharedStates());
    expect(result.current.submitSuccessStatus).toBeFalsy();
    await act(() => {
      result.current.successfulSubmit();
    });
    expect(result.current.submitSuccessStatus).toBeTruthy();
    await act(() => {
      result.current.backToForm();
    });
    expect(result.current.submitSuccessStatus).toBeFalsy();
  });
});
