/**
 * @test_version ce
 */

import { screen, cleanup } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import WorkflowList from '..';

import { superRender } from '../../../../testUtils/customRender';
import user from '../../../../testUtils/mockApi/user';
import instance from '../../../../testUtils/mockApi/instance';
import execWorkflow from '../../../../testUtils/mockApi/execWorkflow';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';
import { ignoreComponentAutoCreatedListNoKey } from '@actiontech/shared/lib/testUtil/common';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/Workflow/List', () => {
  const navigateSpy = jest.fn();
  let RequestUserTipList: jest.SpyInstance;
  let RequestInstanceTipList: jest.SpyInstance;
  let RequestWorkflowList: jest.SpyInstance;
  let RequestBatchCancel: jest.SpyInstance;

  const customRender = () => {
    return superRender(<WorkflowList />);
  };
  ignoreComponentAutoCreatedListNoKey();

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
