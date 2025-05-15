/**
 * @test_version ce
 */

import { screen, cleanup } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import WorkflowList from '..';

import { sqleSuperRender } from '../../../../testUtils/superRender';
import user from '../../../../testUtils/mockApi/user';
import instance from '../../../../testUtils/mockApi/instance';
import execWorkflow from '../../../../testUtils/mockApi/execWorkflow';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('sqle/Workflow/List', () => {
  const navigateSpy = jest.fn();
  let RequestUserTipList: jest.SpyInstance;
  let RequestInstanceTipList: jest.SpyInstance;
  let RequestWorkflowList: jest.SpyInstance;
  let RequestBatchCancel: jest.SpyInstance;

  const customRender = () => {
    return sqleSuperRender(<WorkflowList />);
  };
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    mockDatabaseType();
    RequestUserTipList = user.getUserTipList();
    RequestInstanceTipList = instance.getInstanceTipList();
    RequestWorkflowList = execWorkflow.getWorkflows();
    RequestBatchCancel = execWorkflow.batchCancelWorkflows();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUsePermission(undefined, { mockSelector: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render click export btn', async () => {
    customRender();

    expect(screen.queryByText('导出工单')).not.toBeInTheDocument();
  });
});
