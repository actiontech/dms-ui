/**
 * @test_version ce
 */

import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { superRender } from '../../../../testUtils/customRender';
import CreateSqlExecWorkflow from '..';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';
import execWorkflow from '../../../../testUtils/mockApi/execWorkflow';
import instance from '../../../../testUtils/mockApi/instance';
import { useSelector } from 'react-redux';
import { SOURCE_WORKFLOW_PATH_KEY } from '../../../../data/common';
import {
  AuditTaskResV1SqlSourceEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('sqle/SqlExecWorkflow/Create ce', () => {
  const customRender = () => {
    return superRender(<CreateSqlExecWorkflow />);
  };
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED,
    UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE
  ]);

  beforeEach(() => {
    MockDate.set(dayjs('2023-12-18 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    mockDatabaseType();
    mockUseCurrentProject();
    mockUseCurrentUser();
    execWorkflow.mockAllApi();
    instance.getInstanceTipList();
    (useSelector as jest.Mock).mockImplementation(() => jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
    cleanup();
  });

  it('should snapshot render initial workflow creation UI', async () => {
    const { baseElement } = customRender();

    expect(baseElement).toMatchSnapshot();

    expect(screen.queryByText('添加数据源')).not.toBeInTheDocument();
  });
});
