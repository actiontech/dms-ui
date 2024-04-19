/**
 * @test_version ce
 */
import project from '../../testUtils/mockApi/project';
import {
  cleanup,
  renderHook,
  act,
} from '@testing-library/react';
import useProjectTips from '.';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('useProjectTips CE', () => {
  let getProjectTipsSpy: jest.SpyInstance;
  beforeEach(() => {
    getProjectTipsSpy = project.getProjectTips();
    mockUseCurrentProject();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('have not sent request', async () => {
    const { result } = renderHook(() => useProjectTips());
    expect(result.current.loading).toBeFalsy();

    act(() => {
      result.current.updateProjectTips();
    });
   
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getProjectTipsSpy).not.toHaveBeenCalled();
    expect(result.current.isFixedBusiness).toEqual(
     false
    );
    expect(result.current.projectBusiness).toEqual([]);
    expect(result.current.loading).toBeFalsy();
  });
});
