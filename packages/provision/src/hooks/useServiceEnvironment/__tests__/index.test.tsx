import auth from '../../../testUtil/mockApi/auth';
import { mockEnvironmentTagsData } from '../../../testUtil/mockApi/auth/data';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import useServiceOptions from '..';
import { act, cleanup } from '@testing-library/react';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('provision/hooks/useServiceEnviroment', () => {
  let authListEnvironmentTagsSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseCurrentProject();
    jest.useFakeTimers();
    authListEnvironmentTagsSpy = auth.authListEnvironmentTags();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get service environment data from request', async () => {
    const { result } = renderHooksWithRedux(useServiceOptions, {});

    expect(result.current.loading).toBeFalsy();
    expect(result.current.environmentList).toEqual([]);
    expect(result.current.environmentOptions).toEqual([]);

    act(() => {
      result.current.updateEnvironmentList({
        namespace_uid: mockProjectInfo.projectID
      });
    });

    expect(result.current.loading).toBeTruthy();
    expect(authListEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
    expect(authListEnvironmentTagsSpy).toHaveBeenCalledWith({
      namespace_uid: mockProjectInfo.projectID
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBeFalsy();
    expect(result.current.environmentList).toEqual(mockEnvironmentTagsData);
    expect(result.current.environmentOptions).toEqual(
      mockEnvironmentTagsData.map((environment) => ({
        label: environment.name,
        value: environment.uid
      }))
    );
  });

  it('should set environmentList to empty array when response code is not equal success code', async () => {
    authListEnvironmentTagsSpy.mockClear();
    authListEnvironmentTagsSpy.mockImplementation(() =>
      createSpyFailResponse({ data: { environment_tags: [] } })
    );

    const { result } = renderHooksWithRedux(useServiceOptions, {});
    act(() =>
      result.current.updateEnvironmentList({
        namespace_uid: mockProjectInfo.projectID
      })
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.environmentList).toEqual([]);
  });

  it('should set environmentList to empty array when response throw error', async () => {
    authListEnvironmentTagsSpy.mockClear();
    authListEnvironmentTagsSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { result } = renderHooksWithRedux(useServiceOptions, {});
    act(() =>
      result.current.updateEnvironmentList({
        namespace_uid: mockProjectInfo.projectID
      })
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.environmentList).toEqual([]);
  });
});
