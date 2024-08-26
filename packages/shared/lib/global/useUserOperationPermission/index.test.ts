import { act, cleanup } from '@testing-library/react';
import { mockUseCurrentProject } from '../../testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '../../testUtil/mockHook/mockUseCurrentUser';
import User from '../../api/base/service/User';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '../../testUtil/mockApi';
import { IGetUserOpPermissionReply } from '../../api/base/service/common';
import {
  OpPermissionItemOpPermissionTypeEnum,
  OpPermissionItemRangeTypeEnum
} from '../../api/base/service/common.enum';
import { renderHooksWithRedux } from '../../testUtil/customRender';
import useUserOperationPermission from '.';
import {
  mockCurrentUserReturn,
  mockProjectInfo
} from '../../testUtil/mockHook/data';

const userOperationPermissionMockData: IGetUserOpPermissionReply['data'] = {
  is_admin: true,
  op_permission_list: [
    {
      range_uids: ['700300'],
      range_type: OpPermissionItemRangeTypeEnum.project,
      op_permission_type: OpPermissionItemOpPermissionTypeEnum.project_admin
    }
  ]
};

describe('global/hooks/useUserOperationPermission', () => {
  const getUserOpPermission = () => {
    const spy = jest.spyOn(User, 'GetUserOpPermission');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: userOperationPermissionMockData
      })
    );
    return spy;
  };
  let getUserOpPermissionSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    getUserOpPermissionSpy = getUserOpPermission();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get user operation permission from request', async () => {
    const { result } = renderHooksWithRedux(useUserOperationPermission, {});

    expect(result.current.loading).toBeFalsy();
    expect(result.current.userOperationPermission).toBeUndefined();
    expect(
      result.current.isHaveServicePermission(
        OpPermissionItemOpPermissionTypeEnum.auth_db_service_data
      )
    ).toBeFalsy();

    act(() => {
      result.current.updateUserOperationPermission();
    });

    expect(result.current.loading).toBeTruthy();
    expect(getUserOpPermissionSpy).toHaveBeenCalledTimes(1);
    expect(getUserOpPermissionSpy).toHaveBeenCalledWith({
      user_uid: mockCurrentUserReturn.uid,
      project_uid: mockProjectInfo.projectID
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBeFalsy();
    expect(result.current.userOperationPermission).toEqual(
      userOperationPermissionMockData
    );
    expect(
      result.current.isHaveServicePermission(
        OpPermissionItemOpPermissionTypeEnum.auth_db_service_data
      )
    ).toBeTruthy();
  });

  it('isHaveServicePermission should return true when user is project manager', async () => {
    getUserOpPermissionSpy.mockClear();
    getUserOpPermissionSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_admin: false,
          op_permission_list: [
            {
              range_uids: ['700300'],
              range_type: OpPermissionItemRangeTypeEnum.project,
              op_permission_type:
                OpPermissionItemOpPermissionTypeEnum.project_admin
            }
          ]
        }
      })
    );
    const { result } = renderHooksWithRedux(useUserOperationPermission, {});

    await act(async () => {
      result.current.updateUserOperationPermission();
    });
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.loading).toBeFalsy();
    expect(
      result.current.isHaveServicePermission(
        OpPermissionItemOpPermissionTypeEnum.auth_db_service_data
      )
    ).toBeTruthy();
  });

  it('isHaveServicePermission should return true when user have service permission', async () => {
    getUserOpPermissionSpy.mockClear();
    getUserOpPermissionSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_admin: false,
          op_permission_list: [
            {
              range_uids: ['123'],
              range_type: OpPermissionItemRangeTypeEnum.db_service,
              op_permission_type:
                OpPermissionItemOpPermissionTypeEnum.auth_db_service_data
            }
          ]
        }
      })
    );
    const { result } = renderHooksWithRedux(useUserOperationPermission, {});

    await act(async () => {
      result.current.updateUserOperationPermission();
    });
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.loading).toBeFalsy();
    expect(
      result.current.isHaveServicePermission(
        OpPermissionItemOpPermissionTypeEnum.auth_db_service_data,
        '123'
      )
    ).toBeTruthy();
  });

  it('when response code is not equal success code', async () => {
    getUserOpPermissionSpy.mockClear();
    getUserOpPermissionSpy.mockImplementation(() => createSpyFailResponse({}));

    const { result } = renderHooksWithRedux(useUserOperationPermission, {});

    await act(async () => {
      result.current.updateUserOperationPermission();
    });
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });

    expect(result.current.loading).toBeFalsy();
    expect(
      result.current.isHaveServicePermission(
        OpPermissionItemOpPermissionTypeEnum.auth_db_service_data
      )
    ).toBeFalsy();
  });
});
