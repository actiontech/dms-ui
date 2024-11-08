import { cleanup, act } from '@testing-library/react';
import sqlVersion from '../../../testUtils/mockApi/sql_version';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { superRender } from '../../../testUtils/customRender';
import VersionManagement from '..';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

describe('sqle/VersionManagement', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    sqlVersion.mockAllApi();
    mockUsePermission(
      { checkActionPermission: jest.fn().mockReturnValue(true) },
      { useSpyOnMockHooks: true }
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap shot', async () => {
    const { baseElement } = superRender(<VersionManagement />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
