import dbAccountService from '@actiontech/shared/lib/testUtil/mockApi/provision/dbAccountService';
import auth from '@actiontech/shared/lib/testUtil/mockApi/provision/auth';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import DatabaseAccount from '..';
import { cleanup, act } from '@testing-library/react';
import user from '@actiontech/shared/lib/testUtil/mockApi/provision/user';

describe('provision/DatabaseAccount/DatabaseAccount', () => {
  beforeEach(() => {
    dbAccountService.mockAllApi();
    auth.mockAllApi();
    user.mockAllApi();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = superRender(<DatabaseAccount />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
