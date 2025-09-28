import { act, fireEvent, screen } from '@testing-library/react';
import SqlStatementResultTable from '..';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { sqleSuperRender } from '../../../../../../../../../testUtils/superRender';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { cleanup } from '@testing-library/react';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

describe('test TaskResultList/SQLStatementResultTable', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
  });
  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const openSpy = jest.spyOn(window, 'open');
    openSpy.mockImplementation(jest.fn());
    rule_template.getRuleList();
    const { baseElement } = sqleSuperRender(
      <SqlStatementResultTable
        taskId="1"
        dataSource={[
          {
            number: 1,
            exec_sql:
              "CREATE TABLE task (  id INT AUTO_INCREMENT PRIMARY KEY,  title VARCHAR(255) NOT NULL,  description TEXT,  status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);",
            audit_result: [
              {
                level: 'error',
                message: 'schema  不存在',
                rule_name: '',
                db_type: 'MySQL'
              },
              {
                level: 'error',
                message: '除了自增列及大字段列之外，每个列都必须添加默认值',
                rule_name: 'ddl_check_column_without_default',
                db_type: 'MySQL'
              },
              {
                level: 'error',
                message: '主键建议使用 BIGINT 无符号类型，即 BIGINT UNSIGNED',
                rule_name: 'ddl_check_pk_without_bigint_unsigned',
                db_type: 'MySQL'
              },
              {
                level: 'error',
                message: '新建表建议加入 IF NOT EXISTS，保证重复执行不报错',
                rule_name: 'ddl_check_table_without_if_not_exists',
                db_type: 'MySQL'
              }
            ],
            exec_status: 'initialized'
          }
        ]}
      />
    );

    expect(baseElement).toMatchSnapshot();

    fireEvent.click(getAllBySelector('.ant-typography-ellipsis')[0]);

    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getAllBySelector('.closed-icon-custom')[0]);

    fireEvent.click(getBySelector('.audit-result-wrapper'));

    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('分 析')).toBeInTheDocument();

    fireEvent.click(screen.getByText('分 析'));

    expect(openSpy).toHaveBeenCalledTimes(1);
  });

  it('should render exec result tooltip', async () => {
    rule_template.getRuleList();
    jest.useFakeTimers();
    const { baseElement } = sqleSuperRender(
      <SqlStatementResultTable
        taskId="1"
        dataSource={[
          {
            number: 1,
            exec_sql: 'SELECT * FROM ab.xx;',
            audit_result: [
              {
                level: 'error',
                message: 'schema ab 不存在',
                rule_name: '',
                db_type: 'MySQL'
              }
            ],
            exec_status: 'failed',
            exec_result:
              "exec sql failed: \nSELECT * FROM ab.xx; \nError 1049 (42000): Unknown database 'ab'"
          }
        ]}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });
});
