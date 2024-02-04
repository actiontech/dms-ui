import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen
} from '@testing-library/react';
import useCreateExportTaskForm from '../useCreateExportTaskForm';
import { Button, Form, Input } from 'antd';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCreateDataExportReduxManage } from '../../testUtils/mockUseCreateDataExportReduxManage';
import dbServices from '../../../../../testUtils/mockApi/dbServices';
import { DBServicesList } from '../../../../../testUtils/mockApi/global/data';
import { formatterSQL } from 'sqle/src/utils/FormatterSQL';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import dataExport from '../../../../../testUtils/mockApi/dataExport';
import { AddDataExportTaskResponseData } from '../../../../../testUtils/mockApi/dataExport/data';
import { useState } from 'react';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('test base/DataExport/Create/hooks/useCreateExportTaskForm', () => {
  const CustomCom = ({
    baseForm,
    sourceForm,
    methodForm,
    auditAction,
    auditLoading,
    formatSQLAction,
    resetAllForms
  }: ReturnType<typeof useCreateExportTaskForm>) => {
    const [auditResultValue, setAuditResultValue] = useState('');
    return (
      <>
        <Form form={baseForm}>
          <Form.Item name="name" label="name">
            <Input />
          </Form.Item>
        </Form>
        <Form form={sourceForm}>
          <Form.Item name="dbService" label="dbService">
            <Input />
          </Form.Item>
          <Form.Item name="schema" label="schema">
            <Input />
          </Form.Item>
        </Form>
        <Form form={methodForm}>
          <Form.Item name="sql" label="sql">
            <Input.TextArea />
          </Form.Item>
        </Form>

        <div data-testid="audit-result-content">
          audit action return value: {auditResultValue ?? ''}
        </div>

        <Button onClick={formatSQLAction}>formatSQLAction</Button>
        <Button
          loading={auditLoading}
          onClick={() => {
            auditAction().then((res) =>
              res ? setAuditResultValue('true') : setAuditResultValue('false')
            );
          }}
        >
          auditAction
        </Button>
        <Button
          onClick={() => {
            resetAllForms();
          }}
        >
          resetAllForms
        </Button>
      </>
    );
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCreateDataExportReduxManage();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should format sql when executed "formatSQLAction"', async () => {
    const listDbServiceSpy = dbServices.ListDBServices();

    const { result } = renderHook(() => useCreateExportTaskForm());

    render(<CustomCom {...result.current} />);

    fireEvent.change(screen.getByLabelText('sql'), {
      target: { value: 'select 1;' }
    });

    fireEvent.click(screen.getByText('formatSQLAction'));
    expect(listDbServiceSpy).toBeCalledTimes(0);
    expect(screen.getByLabelText('sql')).toHaveValue(formatterSQL('select 1;'));

    fireEvent.change(screen.getByLabelText('dbService'), {
      target: { value: '100' }
    });
    fireEvent.change(screen.getByLabelText('sql'), {
      target: { value: 'select 2;' }
    });

    fireEvent.click(screen.getByText('formatSQLAction'));
    expect(listDbServiceSpy).toBeCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByLabelText('sql')).toHaveValue(
      formatterSQL('select 2;', DBServicesList[0].db_type)
    );
  });

  it('should execute "auditAction" when clicked audit button', async () => {
    const addDataExportTaskSpy = dataExport.AddDataExportTask();
    const updateAuditLoadingSpy = jest.fn();
    const updateFormValuesSpy = jest.fn();
    const updateTaskIDsSpy = jest.fn();
    const auditLoading = false;

    mockUseCreateDataExportReduxManage({
      auditLoading,
      updateAuditLoading: updateAuditLoadingSpy,
      updateFormValues: updateFormValuesSpy,
      updateTaskIDs: updateTaskIDsSpy
    });

    const { result } = renderHook(() => useCreateExportTaskForm());

    render(<CustomCom {...result.current} />);
    fireEvent.change(screen.getByLabelText('name'), {
      target: { value: 'name' }
    });
    fireEvent.change(screen.getByLabelText('dbService'), {
      target: { value: '100' }
    });
    fireEvent.change(screen.getByLabelText('schema'), {
      target: { value: 'schema' }
    });
    fireEvent.change(screen.getByLabelText('sql'), {
      target: { value: 'select 1;' }
    });

    fireEvent.click(screen.getByText('auditAction'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateAuditLoadingSpy).toBeCalledTimes(1);
    expect(updateAuditLoadingSpy).toBeCalledWith(true);

    expect(addDataExportTaskSpy).toBeCalledTimes(1);
    expect(addDataExportTaskSpy).toBeCalledWith({
      project_uid: mockProjectInfo.projectID,
      data_export_tasks: [
        {
          database_name: 'schema',
          db_service_uid: '100',
          export_sql: 'select 1;'
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateFormValuesSpy).toBeCalledTimes(1);
    expect(updateFormValuesSpy).toBeCalledWith({
      baseValues: {
        name: 'name'
      },
      methodValues: {
        sql: 'select 1;'
      },
      sourceValues: {
        dbService: '100',
        schema: 'schema'
      }
    });
    expect(updateTaskIDsSpy).toBeCalledTimes(1);
    expect(updateTaskIDsSpy).toBeCalledWith(
      AddDataExportTaskResponseData?.data_export_task_uids
    );

    expect(updateAuditLoadingSpy).toBeCalledTimes(2);
    expect(updateAuditLoadingSpy).toBeCalledWith(false);
    expect(screen.getByTestId('audit-result-content')).toHaveTextContent(
      'audit action return value: true'
    );

    cleanup();
    addDataExportTaskSpy.mockImplementation(() => createSpyFailResponse({}));
    render(<CustomCom {...result.current} />);
    fireEvent.click(screen.getByText('auditAction'));
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByTestId('audit-result-content')).toHaveTextContent(
      'audit action return value: false'
    );
  });

  it('should rest all forms when executed "resetAllForm"', async () => {
    const { result } = renderHook(() => useCreateExportTaskForm());

    render(<CustomCom {...result.current} />);

    fireEvent.change(screen.getByLabelText('name'), {
      target: { value: 'name' }
    });
    fireEvent.change(screen.getByLabelText('dbService'), {
      target: { value: '100' }
    });
    fireEvent.change(screen.getByLabelText('schema'), {
      target: { value: 'schema' }
    });
    fireEvent.change(screen.getByLabelText('sql'), {
      target: { value: 'select 1;' }
    });

    fireEvent.click(screen.getByText('resetAllForms'));
    expect(screen.getByLabelText('name')).toHaveValue('');
    expect(screen.getByLabelText('dbService')).toHaveValue('');
    expect(screen.getByLabelText('schema')).toHaveValue('');
    expect(screen.getByLabelText('sql')).toHaveValue('');
  });
});
