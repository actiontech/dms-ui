/**
 * @test_version ce
 */

import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { SqlStatementFormItemProps } from '../index.type';
import { fireEvent, renderHook, screen } from '@testing-library/react';
import { Form } from 'antd';
import SqlStatementFormItem from '..';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';

describe('test SqlStatementFormItem', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);
  beforeEach(() => {
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const customRender = (params?: Partial<SqlStatementFormItemProps>) => {
    const { result } = renderHook(() => Form.useForm());
    return sqleSuperRender(
      <Form form={result.current[0]}>
        <SqlStatementFormItem
          fieldPrefixPath="1"
          isAuditing={{ set: jest.fn(), value: false }}
          auditAction={jest.fn()}
          isSameSqlForAll
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

    fireEvent.click(screen.getByText('上传ZIP文件'));

    expect(container).toMatchSnapshot();
  });
});
