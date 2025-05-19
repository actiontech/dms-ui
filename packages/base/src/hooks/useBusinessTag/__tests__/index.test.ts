import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import { mockBusinessTagsData } from '@actiontech/shared/lib/testUtil/mockApi/base/project/data';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import useBusinessTag from '..';
import { act, cleanup } from '@testing-library/react';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('base/hooks/useBusinessTag', () => {
  let listBusinessTagsSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    listBusinessTagsSpy = project.listBusinessTags();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get business tag data from request', async () => {
    const { result } = superRenderHook(useBusinessTag, {});

    expect(result.current.loading).toBeFalsy();
    expect(result.current.businessTagList).toEqual([]);
    expect(result.current.businessTagOptions).toEqual([]);

    act(() => {
      result.current.updateBusinessTagList();
    });

    expect(result.current.loading).toBeTruthy();
    expect(listBusinessTagsSpy).toHaveBeenCalledTimes(1);
    expect(listBusinessTagsSpy).toHaveBeenCalledWith({
      page_size: 1000
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBeFalsy();
    expect(result.current.businessTagList).toEqual(mockBusinessTagsData);
    expect(result.current.businessTagOptions).toEqual(
      mockBusinessTagsData.map((businessTag) => ({
        label: businessTag.name,
        value: businessTag.uid
      }))
    );
  });

  it('should set businessTagList to empty array when response code is not equal success code', async () => {
    listBusinessTagsSpy.mockClear();
    listBusinessTagsSpy.mockImplementation(() =>
      createSpyFailResponse({ data: { business_tags: [] } })
    );

    const { result } = superRenderHook(useBusinessTag, {});
    act(() => result.current.updateBusinessTagList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.businessTagList).toEqual([]);
  });

  it('should set businessTagList to empty array when response throw error', async () => {
    listBusinessTagsSpy.mockClear();
    listBusinessTagsSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { result } = superRenderHook(useBusinessTag, {});
    act(() => result.current.updateBusinessTagList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.businessTagList).toEqual([]);
  });

  it('should set businessTagList to empty array when request failed', async () => {
    listBusinessTagsSpy.mockClear();
    listBusinessTagsSpy.mockImplementation(() =>
      createSpyFailResponse({ data: [] })
    );
    const { result } = superRenderHook(useBusinessTag, {});
    act(() => result.current.updateBusinessTagList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.businessTagList).toEqual([]);
  });
});
