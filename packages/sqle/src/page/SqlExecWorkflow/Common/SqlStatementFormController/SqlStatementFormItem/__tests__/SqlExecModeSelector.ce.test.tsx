/**
 * @test_version ce
 */

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

  it('should not trigger SQL file order method fetch on file mode click for zip upload type', async () => {
    const { container } = customRender({
      isSupportFileModeExecuteSql: true,
      currentSqlUploadType: AuditTaskResV1SqlSourceEnum.zip_file
    });
    expect(screen.queryByText('选择上线模式')).toBeInTheDocument();

    fireEvent.click(screen.getByText('文件模式'));

    expect(container).toMatchSnapshot();

    expect(getSqlFileOrderMethodSpy).toHaveBeenCalledTimes(0);
  });
});
