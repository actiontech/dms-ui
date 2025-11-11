/**
 * @test_version ce
 */

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import SQLMode from '../SqlMode';
import { SqlExecuteResultCardProps } from '../index.type';
import { sqleSuperRender } from '../../../../../../../../../testUtils/superRender';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
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
      exec_sql: 'exec_sql cont'
    });
    expect(baseElement).toMatchSnapshot();
  });
});
