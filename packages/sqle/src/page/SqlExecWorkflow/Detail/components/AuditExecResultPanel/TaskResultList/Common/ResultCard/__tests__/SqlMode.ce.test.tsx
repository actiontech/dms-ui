/**
 * @test_version ce
 */

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import SQLMode from '../SqlMode';
import { SqlExecuteResultCardProps } from '../index.type';
import { sqleSuperRender } from '../../../../../../../../../testUtils/superRender';
import rule_template from '../../../../../../../../../testUtils/mockApi/rule_template';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { AuditTaskSQLResV2BackupStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const projectID = '700300';
const taskId = 'task_id_1234';

describe('sqle/ExecWorkflow/AuditDetail/SqlMode ce', () => {
  const onUpdateDescriptionFn = jest.fn();

  const customRender = (
    params: Omit<
      SqlExecuteResultCardProps,
      'projectID' | 'taskId' | 'onUpdateDescription'
    >
  ) => {
    const someParams: Pick<
      SqlExecuteResultCardProps,
      'projectID' | 'taskId' | 'onUpdateDescription' | 'dbType'
    > = {
      projectID,
      taskId,
      onUpdateDescription: onUpdateDescriptionFn,
      dbType: 'MySQL'
    };
    return sqleSuperRender(<SQLMode {...someParams} {...params} />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    rule_template.getRuleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = customRender({
      number: 1,
      exec_sql: 'exec_sql cont',
      rollback_sqls: ['rollback_sql cont'],
      backup_strategy_tip: 'test tips',
      backup_strategy: AuditTaskSQLResV2BackupStrategyEnum.reverse_sql,
      associated_rollback_workflows: [
        {
          workflow_name: 'test_workflow_name',
          workflow_id: '1'
        }
      ]
    });
    fireEvent.click(screen.getByText('回滚语句'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.queryByText('基于反向SQL回滚')).not.toBeInTheDocument();
    expect(screen.queryByText('test tips')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});
