import { baseSuperRender } from '../../../../../../../testUtils/superRender';
import dbServices from '../../../../../../../testUtils/mockApi/dbServices';
import instance from 'sqle/src/testUtils/mockApi/instance';
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
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';
import MockDate from 'mockdate';

describe('test ExportSourceFormItem', () => {
  const getBaseFormFieldValueSpy = jest.fn();
  const setBaseFormFieldValueSpy = jest.fn();
  const customRender = () => {
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
        />
      </Form>
    );
  };
  let dbServiceTipsSpy: jest.SpyInstance;
  let schemaTipsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    dbServiceTipsSpy = dbServices.ListDBServicesTips();
    schemaTipsSpy = instance.getInstanceSchemas();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should set default workflow name when workflow is undefined', async () => {
    MockDate.set('2023-12-18 12:00:00');

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

    MockDate.reset();
  });
});
