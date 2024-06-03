import dbAccountService from '../../testUtil/mockApi/dbAccountService';
import passwordSecurityPolicy from '../../testUtil/mockApi/passwordSecurityPolicy';
import auth from '../../testUtil/mockApi/auth';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import DatabaseAccount from '.';
import { cleanup, act } from '@testing-library/react';

describe('provision/DatabaseAccount/DatabaseAccount', () => {
  beforeEach(() => {
    dbAccountService.mockAllApi();
    passwordSecurityPolicy.mockAllApi();
    auth.mockAllApi();
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
