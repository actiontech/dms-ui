import ScanTypesSelection from '../ScanTypesSelection';
import {
  sqleSuperRender,
  sqleSuperRenderHook
} from '../../../../../testUtils/superRender';
import { ConfFormContextProvide, SelectScanTypeParamsType } from '../context';
import { Form } from 'antd';
import instance from '../../../../../testUtils/mockApi/instance';
import { mockAuditPlanMetaData } from '../../../../../testUtils/mockApi/instanceAuditPlan/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { AuditPlanParamResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('test SqlManagementConf/ScanTypesSelection', () => {
  let getInstanceSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    getInstanceSpy = instance.getInstance();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (
    selectedScanTypeParams: SelectScanTypeParamsType = []
  ) => {
    const { result } = sqleSuperRenderHook(() => Form.useForm());
    const { baseElement } = sqleSuperRender(
      <ConfFormContextProvide
        value={{
          submitLoading: false,
          scanTypeMetas: mockAuditPlanMetaData,
          getScanTypeMetaPending: false,
          selectedScanTypeParams
        }}
      >
        <Form form={result.current[0]}>
          <ScanTypesSelection />
        </Form>
      </ConfFormContextProvide>
    );
    return { baseElement, form: result.current[0] };
  };

  it('render init snap shot', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render scan type field when selectedScanTypeParams is not empty', async () => {
    const formWatchSpy = jest.spyOn(Form, 'useWatch');
    formWatchSpy.mockImplementation(() => 'MySQL');
    const { baseElement } = customRender([
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
    ]);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getInstanceSpy).toHaveBeenCalledTimes(1);
  });

  it('render select All type', async () => {
    const formWatchSpy = jest.spyOn(Form, 'useWatch');
    formWatchSpy.mockImplementation(() => 'MySQL');
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('全部'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getAllBySelector('.toggle-token-item-checked')).toHaveLength(
      mockAuditPlanMetaData.length + 1
    );
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('全部'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  it('render select item type', async () => {
    const formWatchSpy = jest.spyOn(Form, 'useWatch');
    formWatchSpy.mockImplementation(() => 'MySQL');
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('MySQL库表元数据'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getAllBySelector('.toggle-token-item-checked')).toHaveLength(1);
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('全部'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getAllBySelector('.toggle-token-item-checked')).toHaveLength(
      mockAuditPlanMetaData.length + 1
    );
    fireEvent.click(screen.getByText('MySQL库表元数据'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getAllBySelector('.toggle-token-item-checked')).toHaveLength(
      mockAuditPlanMetaData.length - 1
    );
  });

  it('render form rule validator', async () => {
    const formWatchSpy = jest.spyOn(Form, 'useWatch');
    formWatchSpy.mockImplementation(() => 'MySQL');
    const rejectSpy = jest.spyOn(Promise, 'reject');
    rejectSpy.mockImplementation(() => Promise.resolve());
    const { form } = customRender();
    await act(async () => {
      form.validateFields();
      await jest.advanceTimersByTime(100);
    });
    expect(rejectSpy).toHaveBeenCalledTimes(1);
    expect(rejectSpy).toHaveBeenNthCalledWith(1, '请选择一项扫描任务');
  });
});
