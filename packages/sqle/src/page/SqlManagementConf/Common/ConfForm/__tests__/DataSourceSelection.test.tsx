import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseProjectBusinessTips } from '@actiontech/shared/lib/testUtil/mockHook/mockUseProjectBusinessTips';
import { useSearchParams } from 'react-router-dom';
import { superRender } from '../../../../../testUtils/customRender';
import DataSourceSelection from '../DataSourceSelection';
import { ConfFormContextProvide, ConfFormContextType } from '../context';
import { URLSearchParams } from 'url';
import instance from '../../../../../testUtils/mockApi/instance';
import {
  act,
  cleanup,
  fireEvent,
  renderHook,
  screen
} from '@testing-library/react';
import { Form } from 'antd';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import configuration from '../../../../../testUtils/mockApi/configuration';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn()
  };
});

describe('test SqlManagementConf/common/ConfForm/DataSourceSelection', () => {
  let getInstanceTipsSpy: jest.SpyInstance;
  let getDriversSpy: jest.SpyInstance;
  const useSearchParamsSpy: jest.Mock = useSearchParams as jest.Mock;
  const customRender = (value: Partial<ConfFormContextType>) => {
    const { result } = renderHook(() => Form.useForm());
    return superRender(
      <ConfFormContextProvide
        value={{
          ...{
            submitLoading: false,
            scanTypeMetas: null,
            getScanTypeMetaPending: false,
            selectedScanTypeParams: []
          },
          ...value
        }}
      >
        <Form form={result.current[0]}>
          <DataSourceSelection />
        </Form>
      </ConfFormContextProvide>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    getInstanceTipsSpy = instance.getInstanceTipList();
    getDriversSpy = configuration.getDrivers();
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    mockUseProjectBusinessTips();
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        instance_id: '',
        business: ''
      })
    ]);
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', () => {
    const { container } = customRender({});
    expect(container).toMatchSnapshot();
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
  });

  it('should match snapshot when submitLoading is equal true', () => {
    const { container } = customRender({ submitLoading: true });
    expect(container).toMatchSnapshot();
  });

  it('should disable form items when submit is in progress or default value is present', async () => {
    customRender({ submitLoading: true });
    expect(getBySelector('#businessScope')).toBeDisabled();
    expect(getBySelector('#instanceType')).toBeDisabled();
    expect(getBySelector('#instanceId')).toBeDisabled();

    cleanup();
    customRender({
      defaultValue: {
        businessScope: 'business',
        instanceId: '123',
        instanceName: 'mysql-1',
        instanceType: 'MySQL',
        scanTypes: []
      }
    });
    expect(getBySelector('#businessScope')).toBeDisabled();
    expect(getBySelector('#instanceType')).toBeDisabled();
    expect(getBySelector('#instanceId')).toBeDisabled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipsSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceTipsSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      functional_module: 'create_audit_plan'
    });
  });

  it('should update instance list when business scope changes', async () => {
    customRender({});
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#businessScope'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="business1"]'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getInstanceTipsSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceTipsSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      filter_db_type: undefined,
      filter_by_business: 'business1',
      functional_module: 'create_audit_plan'
    });
  });

  it('should update instance list when instance type changes', async () => {
    customRender({});
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#businessScope'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="business1"]'));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#instanceType'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('span[title="mysql"]'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getInstanceTipsSpy).toHaveBeenCalledTimes(2);
    expect(getInstanceTipsSpy).toHaveBeenNthCalledWith(2, {
      project_name: mockProjectInfo.projectName,
      filter_db_type: 'mysql',
      filter_by_business: 'business1',
      functional_module: 'create_audit_plan'
    });
  });

  it('should set form fields from URL query parameters on component mount', async () => {
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        instance_id: '1739531854064652288',
        business: 'business1'
      })
    ]);

    const { container } = customRender({});
    expect(getBySelector('#businessScope')).toBeDisabled();
    expect(getBySelector('#instanceType')).toBeDisabled();
    expect(getBySelector('#instanceId')).toBeDisabled();
    expect(getInstanceTipsSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceTipsSpy).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      functional_module: 'create_audit_plan'
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
