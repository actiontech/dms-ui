import { renderHooksWithReduxAndRouter } from '@actiontech/shared/lib/testUtil/customRender';
import { act } from '@testing-library/react';
import useGetRoleData from './useGetRoleData';
import user from '../../../testUtils/mockApi/userManagement';
import { roleListData } from '../../../testUtils/mockApi/userManagement/data';

describe('diagnosis/useGetRoleData', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    user.mockAllApi();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  const customRender = () => {
    return renderHooksWithReduxAndRouter(() => useGetRoleData(true), {});
  };

  it('request get user info success', async () => {
    const request = user.getRoleList();
    const { result } = customRender();
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.loading).toBe(false);
    expect(result.current.roleList?.data).toStrictEqual({
      code: 0,
      message: 'ok',
      data: roleListData
    });
    const roleOptions = roleListData.map((item) => ({
      label: item?.role_name ?? '',
      value: item?.id
    }));
    expect(result.current.roleOptions).toStrictEqual(roleOptions);
  });
});
