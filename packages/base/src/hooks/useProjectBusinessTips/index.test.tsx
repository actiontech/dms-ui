import project from '../../testUtils/mockApi/project';
import { mockProjectTips } from '../../testUtils/mockApi/project/data';
import {
  cleanup,
  renderHook,
  act,
  render,
  fireEvent,
  screen
} from '@testing-library/react';
import useProjectBusinessTips from '.';
import { Select } from 'antd';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('useProjectBusinessTips', () => {
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

  it('should get project tips from request', async () => {
    const { result } = renderHook(() => useProjectBusinessTips());
    expect(result.current.loading).toBeFalsy();

    act(() => {
      result.current.updateProjectTips();
    });
    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.isFixedBusiness).toEqual(
      mockProjectTips[0].is_fixed_business
    );
    expect(result.current.projectBusiness).toEqual(mockProjectTips[0].business);
    expect(result.current.loading).toBeFalsy();
  });

  it('should get project tips from request when pass transfer projectId', async () => {
    const { result } = renderHook(() => useProjectBusinessTips());
    expect(result.current.loading).toBeFalsy();

    act(() => {
      result.current.updateProjectTips('123');
    });
    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getProjectTipsSpy).toHaveBeenCalledTimes(1);
    expect(getProjectTipsSpy).toHaveBeenCalledWith({ project_uid: '123' });
    expect(result.current.isFixedBusiness).toEqual(
      mockProjectTips[0].is_fixed_business
    );
    expect(result.current.projectBusiness).toEqual(mockProjectTips[0].business);
    expect(result.current.loading).toBeFalsy();
  });

  it('should set business to empty array when response code is not equal success code', async () => {
    getProjectTipsSpy.mockClear();
    getProjectTipsSpy.mockImplementation(() => createSpyFailResponse({}));
    const { result } = renderHook(() => useProjectBusinessTips());
    act(() => {
      result.current.updateProjectTips();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.projectBusiness).toEqual([]);
  });

  it('should set business to empty array when response throw error', async () => {
    getProjectTipsSpy.mockClear();
    getProjectTipsSpy.mockImplementation(() => createSpyErrorResponse({}));
    const { result } = renderHook(() => useProjectBusinessTips());
    act(() => {
      result.current.updateProjectTips();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.projectBusiness).toEqual([]);
  });

  it('should return options when use projectBusinessOption', async () => {
    const { result } = renderHook(() => useProjectBusinessTips());
    const { baseElement: baseElementWithOptions } = render(
      <Select
        data-testid="testId"
        value="test"
        options={result.current.projectBusinessOption()}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElementWithOptions).toMatchSnapshot();

    await act(() => {
      fireEvent.mouseDown(screen.getByText('test'));
      jest.runAllTimers();
    });

    await screen.findAllByText('test');
    expect(baseElementWithOptions).toMatchSnapshot();
  });
});
