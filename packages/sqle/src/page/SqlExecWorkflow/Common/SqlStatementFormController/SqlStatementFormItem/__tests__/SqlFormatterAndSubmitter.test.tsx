import { act, fireEvent, renderHook, screen } from '@testing-library/react';
import { Form, Input } from 'antd';
import SqlFormatterAndSubmitter from '../components/SqlFormatterAndSubmitter';
import { SqlFormatterAndSubmitterProps } from '../components/index.type';
import instance from '../../../../../../testUtils/mockApi/instance';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { superRender } from '../../../../../../testUtils/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { formatterSQL } from '@actiontech/shared/lib/utils/FormatterSQL';
import { SqlFiledInitialValue } from '../../../../../../data/common';

describe('test SqlFormatterAndSubmitter', () => {
  let getInstanceSpy: jest.SpyInstance;
  const auditActionSpy = jest.fn();
  beforeEach(() => {
    getInstanceSpy = instance.getInstance();
    jest.useFakeTimers();
    mockUseCurrentProject();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const customRender = (params: Partial<SqlFormatterAndSubmitterProps>) => {
    const { result } = renderHook(() => Form.useForm());

    return superRender(
      <Form form={result.current[0]}>
        <SqlFormatterAndSubmitter
          isAuditing={{ set: jest.fn(), value: false }}
          auditAction={auditActionSpy}
          fieldPrefixPath="1"
          databaseInfo={[
            { key: '1', instanceName: 'mysql-1', schemaName: 'test' }
          ]}
          currentSqlUploadType={AuditTaskResV1SqlSourceEnum.form_data}
          isSameSqlForAll
          {...params}
        />
        <Form.Item
          label="sql语句"
          name={[params.fieldPrefixPath ?? '1', 'form_data']}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    );
  };

  it('renders SqlFormatterAndSubmitter component', () => {
    customRender({
      fieldPrefixPath: '1',
      currentSqlUploadType: AuditTaskResV1SqlSourceEnum.zip_file
    });
    expect(screen.getByText('审 核')).toBeInTheDocument();
    expect(screen.queryByText('SQL美化')).not.toBeInTheDocument();
  });

  it('renders format button when currentSqlUploadType is form_data', () => {
    customRender({
      fieldPrefixPath: '1',
      currentSqlUploadType: AuditTaskResV1SqlSourceEnum.form_data
    });
    expect(screen.getByText('SQL美化')).toBeInTheDocument();
  });

  it('calls form.validateFields on submit button click', async () => {
    customRender({
      fieldPrefixPath: '1'
    });

    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(auditActionSpy).toHaveBeenCalledTimes(1);
  });

  it('formats SQL when format button is clicked and isSameSqlForAll equal true and instanceName is defined', async () => {
    customRender({ isSameSqlForAll: true });

    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: 'select 1' }
    });
    const formatButton = screen.getByText('SQL美化');
    fireEvent.click(formatButton);

    expect(getInstanceSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: 'mysql-1'
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('sql语句')).toHaveValue(
      formatterSQL('select 1', 'MySQL')
    );
  });

  it('formats SQL when format button is clicked and isSameSqlForAll equal true and instanceName is undefined', async () => {
    customRender({ isSameSqlForAll: true, databaseInfo: [] });

    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: 'select 1' }
    });
    const formatButton = screen.getByText('SQL美化');
    fireEvent.click(formatButton);

    expect(getInstanceSpy).toHaveBeenCalledTimes(0);

    expect(screen.getByLabelText('sql语句')).toHaveValue(
      formatterSQL('select 1')
    );
  });

  it('formats SQL when format button is clicked and isSameSqlForAll equal false and instanceName is defined', async () => {
    customRender({
      isSameSqlForAll: false,
      fieldPrefixPath: '2',
      databaseInfo: [
        { key: '1', instanceName: 'mysql-1', schemaName: 'test' },
        { key: '2', instanceName: 'mysql-2', schemaName: 'test' }
      ]
    });

    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: 'select 1' }
    });
    const formatButton = screen.getByText('SQL美化');
    fireEvent.click(formatButton);

    expect(getInstanceSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: 'mysql-2'
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText('sql语句')).toHaveValue(
      formatterSQL('select 1', 'MySQL')
    );
  });

  it('formats SQL when format button is clicked and form_data value is SqlFiledInitialValue', async () => {
    customRender({
      isSameSqlForAll: false,
      fieldPrefixPath: '2',
      databaseInfo: [
        { key: '1', instanceName: 'mysql-1', schemaName: 'test' },
        { key: '2', instanceName: 'mysql-2', schemaName: 'test' }
      ]
    });

    fireEvent.change(screen.getByLabelText('sql语句'), {
      target: { value: SqlFiledInitialValue }
    });
    const formatButton = screen.getByText('SQL美化');
    fireEvent.click(formatButton);

    expect(getInstanceSpy).toHaveBeenCalledTimes(0);
    expect(screen.getByLabelText('sql语句')).toHaveValue(SqlFiledInitialValue);
  });
});
