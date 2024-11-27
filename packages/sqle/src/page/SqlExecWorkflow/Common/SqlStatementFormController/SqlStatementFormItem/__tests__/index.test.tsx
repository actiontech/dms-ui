import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { SqlStatementFormItemProps } from '../index.type';
import { act, fireEvent, renderHook, screen } from '@testing-library/react';
import { Form } from 'antd';
import SqlStatementFormItem from '..';
import { superRender } from '../../../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { SQL_EDITOR_PLACEHOLDER_VALUE } from '@actiontech/shared/lib/data/common';

describe('test SqlStatementFormItem', () => {
  beforeEach(() => {
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const customRender = (params?: Partial<SqlStatementFormItemProps>) => {
    const { result } = renderHook(() => Form.useForm());
    return superRender(
      <Form form={result.current[0]}>
        <SqlStatementFormItem
          fieldPrefixPath="1"
          isAuditing={{ set: jest.fn(), value: false }}
          auditAction={jest.fn()}
          isSameSqlForAll
          isSupportFileModeExecuteSql
          databaseInfo={[
            { key: '1', instanceName: 'mysql-1', schemaName: 'test' }
          ]}
          isAtFormStep
          {...params}
        />
      </Form>
    );
  };

  it('renders SqlStatementFormItem component', () => {
    const { container } = customRender();

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('上传ZIP文件'));

    expect(container).toMatchSnapshot();
    expect(screen.queryByText('选择上线模式')).toBeInTheDocument();
  });

  it('resets form fields on upload type change when clearSqlContentFormWhenChangeUploadType is true', async () => {
    customRender({
      clearSqlContentFormWhenChangeUploadType: true,
      fieldPrefixPath: 'prefix'
    });

    await act(async () => {
      fireEvent.input(getBySelector('input.custom-monaco-editor'), {
        target: { value: 'SELECT 1' }
      });
    });

    fireEvent.click(screen.getByText('上传SQL文件'));

    fireEvent.click(screen.getByText('输入SQL语句'));

    expect(getBySelector('input.custom-monaco-editor')).toHaveValue(
      SQL_EDITOR_PLACEHOLDER_VALUE
    );
  });

  it('render backup switcher', () => {
    customRender({});
    expect(screen.getByText('是否选择开启备份')).toBeInTheDocument();
    fireEvent.click(screen.getByText('上传SQL文件'));
    expect(screen.getByText('是否选择开启备份')).toBeInTheDocument();
    fireEvent.click(screen.getByText('文件模式'));
    expect(screen.queryByText('是否选择开启备份')).not.toBeInTheDocument();
  });
});
