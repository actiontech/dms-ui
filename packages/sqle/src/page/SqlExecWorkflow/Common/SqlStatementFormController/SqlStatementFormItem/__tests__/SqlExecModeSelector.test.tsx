import { Form } from 'antd';
import { superRender } from '../../../../../../testUtils/customRender';
import task from '../../../../../../testUtils/mockApi/task';
import SqlExecModeSelector from '../components/SqlExecModeSelector';
import { act, fireEvent, renderHook, screen } from '@testing-library/react';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SqlExecModeSelectorProps } from '../components/index.type';

describe('test SqlExecModeSelector', () => {
  let getSqlFileOrderMethodSpy: jest.SpyInstance;
  beforeEach(() => {
    getSqlFileOrderMethodSpy = task.getSqlFileOrderMethod();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const customRender = (params?: Partial<SqlExecModeSelectorProps>) => {
    const { result } = renderHook(() => Form.useForm());
    return superRender(
      <Form form={result.current[0]}>
        <SqlExecModeSelector
          fieldPrefixPath="prefix"
          isSupportFileModeExecuteSql={false}
          currentSqlUploadType={AuditTaskResV1SqlSourceEnum.form_data}
          {...params}
        />
      </Form>
    );
  };

  it('should not render the execute mode selector when file mode execute SQL is not supported', () => {
    customRender({
      currentSqlUploadType: AuditTaskResV1SqlSourceEnum.zip_file
    });
    expect(screen.queryByText('选择上线模式')).not.toBeInTheDocument();
  });

  it('should not render the execute mode selector when the upload type is form data', () => {
    customRender({
      isSupportFileModeExecuteSql: true,
      currentSqlUploadType: AuditTaskResV1SqlSourceEnum.form_data
    });
    expect(screen.queryByText('选择上线模式')).not.toBeInTheDocument();
  });

  it('should render the execute mode selector for SQL file upload with supported file mode execute SQL', () => {
    customRender({
      isSupportFileModeExecuteSql: true,
      currentSqlUploadType: AuditTaskResV1SqlSourceEnum.sql_file
    });
    expect(screen.queryByText('选择上线模式')).toBeInTheDocument();

    expect(getSqlFileOrderMethodSpy).not.toHaveBeenCalled();
  });

  it('should trigger SQL file order method fetch on file mode click for zip upload type', async () => {
    customRender({
      isSupportFileModeExecuteSql: true,
      currentSqlUploadType: AuditTaskResV1SqlSourceEnum.zip_file
    });
    expect(screen.queryByText('选择上线模式')).toBeInTheDocument();

    fireEvent.click(screen.getByText('文件模式'));

    expect(getSqlFileOrderMethodSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));
  });
});
