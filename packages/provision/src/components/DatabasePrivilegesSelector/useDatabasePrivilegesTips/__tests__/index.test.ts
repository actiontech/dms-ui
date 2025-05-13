import { renderHook, act } from '@testing-library/react';
import useDatabasePrivilegesTips from '../index';
import auth from '../../../../testUtil/mockApi/auth';
import { AuthListOperationsDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('provision/useDatabasePrivilegesTips', () => {
  let authListOperationsSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    authListOperationsSpy = auth.authListOperations();
    authListOperationsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            uid: '600033',
            name: 'CREATE_USER',
            scope: ['Service', 'Instance']
          },
          {
            uid: '600020',
            name: 'CREATE_VIEW',
            scope: ['Table']
          },
          {
            uid: '600021',
            name: 'CREATE_VIEW2',
            scope: ['Database']
          }
        ]
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('request database role tips', async () => {
    const { result } = renderHook(() => useDatabasePrivilegesTips());
    expect(result.current.loading).toBeFalsy();

    await act(async () => {
      result.current.updateOperationPrivileges(
        AuthListOperationsDbTypeEnum.MySQL
      );
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.loading).toBeTruthy();

    await act(async () => jest.advanceTimersByTime(2900));
    expect(authListOperationsSpy).toHaveBeenCalledTimes(1);
    expect(result.current.systemPrivilegesOptions).toEqual([
      {
        value: '600033',
        label: 'CREATE_USER',
        scope: ['Service', 'Instance']
      }
    ]);
    expect(result.current.objectPrivilegesOptions).toEqual([
      {
        value: '600020',
        label: 'CREATE_VIEW',
        scope: ['Table']
      },
      {
        value: '600021',
        label: 'CREATE_VIEW2',
        scope: ['Database']
      }
    ]);
  });
});
