/**
 * @test_version ce
 */

import AuditResultList from '..';
import { AuditResultListProps } from '../index.type';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import { cleanup } from '@testing-library/react';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { mockSqlExecWorkflowTasksData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('sqle/ExecWorkflow/Common/AuditResultList ce', () => {
  const updateTaskRecordCountSpy = jest.fn();
  let requestGetAuditTaskSQLs: jest.SpyInstance;
  const customRender = (params: AuditResultListProps) => {
    return sqleSuperRender(
      <AuditResultList
        updateTaskRecordCount={updateTaskRecordCountSpy}
        {...params}
      />
    );
  };

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    execWorkflow.mockAllApi();
    requestGetAuditTaskSQLs = execWorkflow.getAuditTaskSQLs();
    mockUseCurrentProject();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = customRender({
      tasks: mockSqlExecWorkflowTasksData,
      allowSwitchBackupPolicy: true
    });
    expect(baseElement).toMatchSnapshot();
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledTimes(1);
  });
});
