import { renderHook, act } from '@testing-library/react';
import useDBAuthRoleTips from './index';
import dbRole from '@actiontech/shared/lib/testUtil/mockApi/provision/dbRole';
import { mockDBRoleTips } from '@actiontech/shared/lib/testUtil/mockApi/provision/dbRole/data';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('provision/hooks/useDBAuthRoleTips', () => {
  let authListDBRoleTipsSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    authListDBRoleTipsSpy = dbRole.authListDBRoleTips();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('request database role tips', async () => {
    const { result } = renderHook(() => useDBAuthRoleTips());
    expect(result.current.loading).toBeFalsy();

    await act(async () => {
      result.current.updateDBAuthRoleTips('123', mockProjectInfo.projectID);
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.loading).toBeTruthy();

    await act(async () => jest.advanceTimersByTime(2900));
    expect(result.current.loading).toBeFalsy();
    expect(authListDBRoleTipsSpy).toHaveBeenCalledTimes(1);
    expect(result.current.dbAuthRoles).toEqual(mockDBRoleTips);
    const options = mockDBRoleTips.map((v) => ({
      label: v.db_role?.name,
      value: v.db_role?.uid
    }));
    expect(result.current.dbAuthRoleOptions).toEqual(options);
  });
});
