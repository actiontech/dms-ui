import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { act, cleanup } from '@testing-library/react';
import dbAccountService from '../../testUtil/mockApi/dbAccountService';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import auth from '../../testUtil/mockApi/auth';
import DatabaseAccountPassword from './index';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import user from '../../testUtil/mockApi/user';

describe('provision/DatabaseAccountPassword/DatabaseAccountPassword', () => {
  let authListDBAccountSpy: jest.SpyInstance;
  let authListServicesSpy: jest.SpyInstance;

  beforeEach(() => {
    authListDBAccountSpy = dbAccountService.authListDBAccount();
    authListServicesSpy = auth.listServices();
    auth.mockAllApi();
    user.mockAllApi();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    mockUseCurrentProject();
    MockDate.set(dayjs('2024-06-01 12:00:00').valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
    MockDate.reset();
  });

  test('render init snap', async () => {
    const { baseElement } = superRender(<DatabaseAccountPassword />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });
});
