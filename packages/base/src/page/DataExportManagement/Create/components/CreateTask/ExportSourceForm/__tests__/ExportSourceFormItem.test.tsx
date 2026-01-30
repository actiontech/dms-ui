import { baseSuperRender } from '../../../../../../../testUtils/superRender';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import ExportSourceFormItem from '../ExportSourceFormItem';
import {
  act,
  cleanup,
  fireEvent,
  renderHook,
  screen
} from '@testing-library/react';
import { useForm } from 'antd/es/form/Form';
import { Form } from 'antd';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { ListDBServiceTipsFunctionalModuleEnum } from '@actiontech/shared/lib/api/base/service/DBService/index.enum';
import {
  getBySelector,
  selectOptionByIndex
} from '@actiontech/shared/lib/testUtil/customQuery';
import MockDate from 'mockdate';
import { compressToEncodedURIComponent } from 'lz-string';
import { TRANSIT_FROM_CONSTANT } from '@actiontech/dms-kit';
import { WrapperOptions } from '@actiontech/shared/lib/testUtil/superRender';
import { dbServicesTips } from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices/data';

describe('test ExportSourceFormItem', () => {
  const getBaseFormFieldValueSpy = jest.fn();
  const setBaseFormFieldValueSpy = jest.fn();
  const customRender = (options?: WrapperOptions) => {
    const { result } = renderHook(() => useForm());

    return baseSuperRender(
      <Form form={result.current[0]}>
        <ExportSourceFormItem
          sourceForm={result.current[0]}
          baseForm={
            {
              setFieldValue: setBaseFormFieldValueSpy,
              getFieldValue: getBaseFormFieldValueSpy
            } as any
          }
          methodForm={
            {
              setFieldValue: setBaseFormFieldValueSpy,
              getFieldValue: getBaseFormFieldValueSpy
            } as any
          }
        />
      </Form>,
      undefined,
      options
    );
  };
  let dbServiceTipsSpy: jest.SpyInstance;
  let schemaTipsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    MockDate.set('2023-12-18 12:00:00');
    dbServiceTipsSpy = dbServices.ListDBServicesTips();
    schemaTipsSpy = instance.getInstanceSchemas();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
  });

  it('should set default workflow name when workflow is undefined', async () => {
    customRender();

    expect(dbServiceTipsSpy).toHaveBeenCalledTimes(1);
    expect(dbServiceTipsSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      functional_module:
        ListDBServiceTipsFunctionalModuleEnum.create_export_task
    });
    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('数据源', 'test (127.0.0.1:3306)', 0);

    await act(async () => jest.advanceTimersByTime(0));
    expect(getBaseFormFieldValueSpy).toHaveBeenCalledTimes(1);
    expect(getBaseFormFieldValueSpy).toHaveBeenCalledWith('workflow_subject');

    expect(setBaseFormFieldValueSpy).toHaveBeenCalledTimes(1);
    expect(setBaseFormFieldValueSpy).toHaveBeenCalledWith(
      'workflow_subject',
      `test_20231218120000`
    );

    expect(schemaTipsSpy).toHaveBeenCalledTimes(1);
    expect(schemaTipsSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: 'test'
    });

    getBaseFormFieldValueSpy.mockReturnValue('name');
    selectOptionByIndex('数据源', 'test2 (localhost:3306)', 0);
    await act(async () => jest.advanceTimersByTime(0));

    expect(schemaTipsSpy).toHaveBeenCalledTimes(2);
    expect(schemaTipsSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: 'test2'
    });
    expect(setBaseFormFieldValueSpy).toHaveBeenCalledTimes(1);
  });

  it('should fill form fields when searchParams exist with valid compression data', async () => {
    const instanceName = dbServicesTips[0].name ?? '';
    const mockCompressionData = compressToEncodedURIComponent(
      JSON.stringify({
        databaseName: 'test_db',
        instanceName: instanceName,
        taskName: 'test_task_name',
        sql: 'SELECT * FROM table'
      })
    );

    customRender({
      routerProps: {
        initialEntries: [
          `/project/1/data/export/create?from=${TRANSIT_FROM_CONSTANT.odc_client}&compression_data=${mockCompressionData}`
        ]
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(setBaseFormFieldValueSpy).toHaveBeenCalledWith(
      'workflow_subject',
      'test_task_name'
    );
    expect(setBaseFormFieldValueSpy).toHaveBeenCalledWith(
      'sql',
      'SELECT * FROM table'
    );
    expect(screen.getByText('test_db')).toBeInTheDocument();
  });

  it('should handle invalid compression data gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    customRender({
      routerProps: {
        initialEntries: [
          `/project/1/data/export/create?from=${TRANSIT_FROM_CONSTANT.odc_client}&compression_data=invalid_data`
        ]
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
