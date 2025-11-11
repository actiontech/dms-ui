import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen
} from '@testing-library/react';
import useCreateExportTaskForm from '../useCreateExportTaskForm';
import { Button, Form, Input, Switch } from 'antd';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCreateDataExportReduxManage } from '../../testUtils/mockUseCreateDataExportReduxManage';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import { DBServicesList } from '@actiontech/shared/lib/testUtil/mockApi/base/global/data';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import dataExport from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport';
import { AddDataExportTaskResponseData } from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport/data';
import { useState } from 'react';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { formatterSQL, FormatLanguageSupport } from '@actiontech/dms-kit';
import { isSupportLanguage } from '@actiontech/dms-kit';

jest.mock('@actiontech/dms-kit', () => ({
  ...jest.requireActual('@actiontech/dms-kit'),
  isSupportLanguage: jest.fn()
}));

describe('test base/DataExport/Create/hooks/useCreateExportTaskForm', () => {
  const CustomCom = ({
    baseForm,
    sourceForm,
    methodForm,
    auditAction,
    auditLoading,
    formatSQLAction,
    resetAllForms,
    dbType = FormatLanguageSupport.MySQL
  }: ReturnType<typeof useCreateExportTaskForm> & {
    dbType?: string;
  }) => {
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
          <Form.Item name="dbType" initialValue={dbType} label="dbType">
            <Input />
          </Form.Item>
        </Form>
        <Form form={methodForm}>
          <Form.Item name="sql" label="sql">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="formatted" label="formatted" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="originSql" label="originSql">
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
    const { result } = renderHook(() => useCreateExportTaskForm());

    render(<CustomCom {...result.current} />);

    fireEvent.change(screen.getByLabelText('sql'), {
      target: { value: 'select 1;' }
    });
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.change(screen.getByLabelText('dbService'), {
      target: { value: '100' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(screen.getByLabelText('sql'), {
      target: { value: 'select 2;' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('formatSQLAction'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByLabelText('sql')).toHaveValue(
      formatterSQL('select 2;', DBServicesList[0].db_type)
    );
  });

  it('should execute "auditAction" when clicked audit button', async () => {
    (isSupportLanguage as jest.Mock).mockImplementation(() => true);
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

    expect(updateAuditLoadingSpy).toHaveBeenCalledTimes(1);
    expect(updateAuditLoadingSpy).toHaveBeenCalledWith(true);

    expect(addDataExportTaskSpy).toHaveBeenCalledTimes(1);
    expect(addDataExportTaskSpy).toHaveBeenCalledWith({
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
    expect(updateFormValuesSpy).toHaveBeenCalledTimes(1);
    expect(updateFormValuesSpy).toHaveBeenCalledWith({
      baseValues: {
        name: 'name'
      },
      methodValues: {
        sql: 'select 1;'
      },
      sourceValues: {
        dbService: '100',
        schema: 'schema',
        dbType: 'mysql'
      }
    });
    expect(updateTaskIDsSpy).toHaveBeenCalledTimes(1);
    expect(updateTaskIDsSpy).toHaveBeenCalledWith(
      AddDataExportTaskResponseData?.data_export_task_uids
    );

    expect(updateAuditLoadingSpy).toHaveBeenCalledTimes(2);
    expect(updateAuditLoadingSpy).toHaveBeenCalledWith(false);
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
