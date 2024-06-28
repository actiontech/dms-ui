import { act, fireEvent } from '@testing-library/react';
import SqlStatementResultTable from '..';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { superRender } from '../../../../../../../../../testUtils/customRender';
import rule_template from '../../../../../../../../../testUtils/mockApi/rule_template';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { cleanup } from '@testing-library/react';

describe('test TaskResultList/SQLStatementResultTable', () => {
  beforeEach(() => {
    mockUseCurrentUser();
  });
  afterEach(() => {
    cleanup();
  });

  it('should match snapshot', async () => {
    rule_template.getRuleList();
    jest.useFakeTimers();
    const { baseElement } = superRender(
      <SqlStatementResultTable
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

    jest.useRealTimers();
  });
});
