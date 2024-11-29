import useSecurityPolicy, { normalPolicy } from '.';
import { act, cleanup } from '@testing-library/react';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import passwordSecurityPolicy from '../../testUtil/mockApi/passwordSecurityPolicy';
import { passwordSecurityPolicyMockData } from '../../testUtil/mockApi/passwordSecurityPolicy/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('provision/hooks/useSecurityPolicy', () => {
  let authListPasswordSecurityPoliciesSpy: jest.SpyInstance;
  const mockSecurityPolicyOptions = passwordSecurityPolicyMockData.map((i) => ({
    value: i.uid,
    label: i.name
  }));

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    authListPasswordSecurityPoliciesSpy =
      passwordSecurityPolicy.authListPasswordSecurityPolicies();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get security policy data from request', async () => {
    const { result } = renderHooksWithRedux(() => useSecurityPolicy(), {});

    expect(result.current.loading).toBeFalsy();
    expect(result.current.securityPolicyList).toEqual([]);

    act(() => result.current.updateSecurityPolicyList());

    expect(result.current.loading).toBeTruthy();
    expect(authListPasswordSecurityPoliciesSpy).toHaveBeenCalledTimes(1);
    expect(authListPasswordSecurityPoliciesSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      page_size: 9999,
      page_index: 1
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBeFalsy();
    expect(result.current.securityPolicyList).toEqual(
      passwordSecurityPolicyMockData
    );

    expect(result.current.securityPolicyOptions()).toEqual([
      normalPolicy,
      ...mockSecurityPolicyOptions
    ]);
    expect(result.current.securityPolicyOptions(false)).toEqual(
      mockSecurityPolicyOptions
    );
  });

  it('should set securityPolicyList to empty array when response code is not equal success code', async () => {
    authListPasswordSecurityPoliciesSpy.mockClear();
    authListPasswordSecurityPoliciesSpy.mockImplementation(() =>
      createSpyFailResponse({})
    );

    const { result } = renderHooksWithRedux(() => useSecurityPolicy(), {});
    act(() => result.current.updateSecurityPolicyList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.securityPolicyList).toEqual([]);
  });

  it('should set securityPolicyList to empty array when response throw error', async () => {
    authListPasswordSecurityPoliciesSpy.mockClear();
    authListPasswordSecurityPoliciesSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { result } = renderHooksWithRedux(() => useSecurityPolicy(), {});
    act(() => result.current.updateSecurityPolicyList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.securityPolicyList).toEqual([]);
  });
});
