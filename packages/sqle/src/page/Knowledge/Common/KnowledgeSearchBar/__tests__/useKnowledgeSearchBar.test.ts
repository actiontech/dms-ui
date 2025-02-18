import { act, cleanup, renderHook } from '@testing-library/react';
import useKnowledgeSearchBar from '../hooks/useKnowledgeSearchBar';

describe('useKnowledgeSearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { result } = renderHook(() => useKnowledgeSearchBar());
    expect(result.current.searchText).toBe('');
    expect(result.current.selectedTags).toEqual([]);

    await act(async () => {
      result.current.setSearchText('test');
      result.current.setSelectedTags(['tag1', 'tag2']);
      jest.advanceTimersByTime(0);
    });

    expect(result.current.searchText).toBe('test');
    expect(result.current.selectedTags).toEqual(['tag1', 'tag2']);
  });
});
