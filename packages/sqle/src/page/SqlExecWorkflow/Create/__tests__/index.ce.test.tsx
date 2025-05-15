/**
 * @test_version ce
 */

import { screen, cleanup } from '@testing-library/react';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import CreateSqlExecWorkflow from '..';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';
import execWorkflow from '../../../../testUtils/mockApi/execWorkflow';
import instance from '../../../../testUtils/mockApi/instance';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('sqle/SqlExecWorkflow/Create ce', () => {
  const customRender = () => {
    return sqleSuperRender(<CreateSqlExecWorkflow />);
  };
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED,
    UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE,
    UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER
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
