import project from '../../../testUtils/mockApi/project';
import { mockEnvironmentTagsData } from '../../../testUtils/mockApi/project/data';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import useServiceOptions from '..';
import { act, cleanup } from '@testing-library/react';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('sqle/hooks/useServiceEnvironment', () => {
  let listEnvironmentTagsSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    listEnvironmentTagsSpy = project.listEnvironmentTags();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get service environment data from request', async () => {
    const { result } = superRenderHook(useServiceOptions, {});

    expect(result.current.loading).toBeFalsy();
    expect(result.current.environmentList).toEqual([]);
    expect(result.current.environmentOptions).toEqual([]);

    act(() => {
      result.current.updateEnvironmentList(mockProjectInfo.projectID);
    });

    expect(result.current.loading).toBeTruthy();
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
    expect(listEnvironmentTagsSpy).toHaveBeenCalledWith({
      page_size: 1000,
      project_uid: mockProjectInfo.projectID
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
    listEnvironmentTagsSpy.mockClear();
    listEnvironmentTagsSpy.mockImplementation(() =>
      createSpyFailResponse({ data: { environment_tags: [] } })
    );

    const { result } = superRenderHook(useServiceOptions, {});
    act(() => result.current.updateEnvironmentList(mockProjectInfo.projectID));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.environmentList).toEqual([]);
  });

  it('should set environmentList to empty array when response throw error', async () => {
    listEnvironmentTagsSpy.mockClear();
    listEnvironmentTagsSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { result } = superRenderHook(useServiceOptions, {});
    act(() => result.current.updateEnvironmentList(mockProjectInfo.projectID));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.environmentList).toEqual([]);
  });
});
