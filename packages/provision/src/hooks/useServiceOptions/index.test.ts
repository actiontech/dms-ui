import auth from '../../testUtil/mockApi/auth';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import useServiceOptions from '.';
import { act, cleanup } from '@testing-library/react';
import { instanceList } from '../../testUtil/mockApi/auth/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  OpPermissionItemOpPermissionTypeEnum,
  OpPermissionItemRangeTypeEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('provision/hooks/useServiceOptions', () => {
  let authListServicesSpy: jest.SpyInstance;
  const business = 'business-1';
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver({
      getLogoUrlByDbType: jest.fn().mockReturnValue('')
    });
    jest.useFakeTimers();
    authListServicesSpy = auth.listServices();
    mockUsePermission(
      {
        moduleFeatureSupport: { sqlOptimization: false },
        userOperationPermissions: {
          is_admin: false,
          op_permission_list: [
            {
              range_uids: [instanceList[0].uid],
              range_type: OpPermissionItemRangeTypeEnum.db_service,
              op_permission_type:
                OpPermissionItemOpPermissionTypeEnum.auth_db_service_data
            }
          ]
          // todo 类型问题后续在 dms-ui 上修复后删除此处的  any
        } as any
      },
      { mockSelector: true }
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get service data from request', async () => {
    const { result } = renderHooksWithRedux(useServiceOptions, {});

    expect(result.current.loading).toBeFalsy();
    expect(result.current.serviceList).toEqual([]);
    expect(result.current.serviceOptions).toEqual([]);
    expect(result.current.serviceNameOptions).toEqual([]);

    act(() => {
      result.current.updateServiceList(business);
    });

    expect(result.current.loading).toBeTruthy();
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    expect(authListServicesSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 999,
      filter_by_namespace: mockProjectInfo.projectID,
      business
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBeFalsy();
    expect(result.current.serviceList).toEqual(instanceList);
    expect(result.current.serviceOptions).toMatchSnapshot();
    expect(result.current.serviceNameOptions).toMatchSnapshot();
  });

  it('should get service data from request when isNeedFilterByOperationPermission is true', async () => {
    const { result } = renderHooksWithRedux(() => useServiceOptions(true), {});

    act(() => {
      result.current.updateServiceList(business);
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBeFalsy();
    expect(result.current.serviceList).toEqual(instanceList);
    expect(result.current.serviceOptions).toMatchSnapshot();
    expect(result.current.serviceNameOptions).toMatchSnapshot();
  });

  it('should set serviceList to empty array when response code is not equal success code', async () => {
    authListServicesSpy.mockClear();
    authListServicesSpy.mockImplementation(() =>
      createSpyFailResponse({ data: [] })
    );

    const { result } = renderHooksWithRedux(useServiceOptions, {});
    act(() => result.current.updateServiceList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.serviceList).toEqual([]);
  });

  it('should set serviceList to empty array when response throw error', async () => {
    authListServicesSpy.mockClear();
    authListServicesSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { result } = renderHooksWithRedux(useServiceOptions, {});
    act(() => result.current.updateServiceList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.serviceList).toEqual([]);
  });
});
