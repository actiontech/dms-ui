/**
 * @test_version ce
 */

import { Form } from 'antd';
import SqlStatementFormController from '..';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import { renderHook } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';

describe('test SqlStatementFormController ce', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);
  it('should match snapshot', () => {
    mockUseCurrentProject();
    const { result } = renderHook(() => Form.useForm());
    const { container } = sqleSuperRender(
      <Form form={result.current[0]}>
        <SqlStatementFormController
          activeKey="1"
          onChange={jest.fn()}
          isAuditing={{ set: jest.fn(), value: false }}
          auditAction={jest.fn()}
          isSameSqlForAll
          databaseInfo={[
            { key: '1', instanceName: 'mysql-1', schemaName: 'test' }
          ]}
          dbSourceInfoCollection={{ value: {}, set: jest.fn() }}
          isAtFormStep
        />
      </Form>
    );

    expect(container).toMatchSnapshot();
  });
});
