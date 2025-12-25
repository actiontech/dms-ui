import { act, renderHook, cleanup } from '@testing-library/react';
import useProjectTips from '.';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import { mockProjectList } from '@actiontech/shared/lib/testUtil/mockApi/base/project/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('useProjectTips', () => {
  let getProjectListSpy: jest.SpyInstance;
  beforeEach(() => {
    getProjectListSpy = project.getProjectList();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get projects data from request', async () => {
    const { result } = renderHook(() => useProjectTips());
    expect(result.current.loading).toBe(false);
    expect(result.current.projectList).toEqual([]);

    act(() => {
      result.current.updateProjects();
    });

    expect(result.current.loading).toBeTruthy();
    expect(getProjectListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.projectList).toEqual(mockProjectList);
    expect(result.current.projectIDOptions).toEqual(
      mockProjectList.map((p) => ({
        label: p.name,
        value: p.uid
      }))
    );
    expect(result.current.loading).toBeFalsy();
  });

  it('should set list to empty array when response code is not equal success code', async () => {
    getProjectListSpy.mockClear();
    getProjectListSpy.mockImplementation(() =>
      createSpyFailResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useProjectTips());
    act(() => {
      result.current.updateProjects();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.projectList).toEqual([]);
    expect(result.current.projectIDOptions).toEqual([]);
  });

  it('should set list to empty array when response throw error', async () => {
    getProjectListSpy.mockClear();
    getProjectListSpy.mockImplementation(() =>
      createSpyErrorResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useProjectTips());
    act(() => {
      result.current.updateProjects();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.projectList).toEqual([]);
    expect(result.current.projectIDOptions).toEqual([]);
  });
});
