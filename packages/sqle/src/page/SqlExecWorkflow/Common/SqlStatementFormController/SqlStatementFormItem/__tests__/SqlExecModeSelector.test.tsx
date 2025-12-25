import { Form } from 'antd';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import task from '@actiontech/shared/lib/testUtil/mockApi/sqle/task';
import SqlExecModeSelector from '../components/SqlExecModeSelector';
import { act, fireEvent, renderHook, screen } from '@testing-library/react';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SqlExecModeSelectorProps } from '../components/index.type';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

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
    return sqleSuperRender(
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

  it('should disabled the execute mode selector when file mode execute SQL is not supported', async () => {
    customRender({
      currentSqlUploadType: AuditTaskResV1SqlSourceEnum.zip_file
    });
    expect(screen.queryByText('选择上线模式')).toBeInTheDocument();
    expect(
      getAllBySelector('.actiontech-mode-switcher-item-disabled')[0]
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.mouseOver(getBySelector('.actiontech-mode-switcher'));
      await jest.advanceTimersByTime(300);
    });

    expect(
      screen.getByText('当前支持MySQL、Oracle、PG类型数据源按文件模式上线')
    ).toBeInTheDocument();
  });

  it('should not render the execute mode selector when the upload type is form data', async () => {
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
