import { act, renderHook } from '@testing-library/react';
import useConfigSwitchControls from '../useConfigSwitchControls';
import { Form } from 'antd';

describe('test useConfigSwitchControls', () => {
  const mockSetValue = jest.fn();
  const customRender = () => {
    return renderHook(() =>
      useConfigSwitchControls({ setFieldValue: mockSetValue } as any, 'enabled')
    );
  };
  it('should manage the configuration switch popover open state correctly', async () => {
    const mockUseWatch = jest.spyOn(Form, 'useWatch');
    mockUseWatch.mockReturnValue(false);

    const { result, unmount } = customRender();

    expect(result.current.configSwitchPopoverOpenState).toBeFalsy();

    await act(async () => {
      result.current.onConfigSwitchPopoverOpen(true);
    });
    expect(result.current.configSwitchPopoverOpenState).toBeFalsy();
    unmount();
    mockUseWatch.mockClear();
    mockUseWatch.mockReturnValue(true);

    const { result: reRenderResult } = customRender();

    await act(async () => {
      reRenderResult.current.onConfigSwitchPopoverOpen(true);
    });
    expect(mockSetValue).toHaveBeenCalledTimes(1);
    expect(mockSetValue).toHaveBeenCalledWith('enabled', true);
    expect(reRenderResult.current.configSwitchPopoverOpenState).toBeTruthy();

    await act(async () => {
      reRenderResult.current.onConfigSwitchPopoverOpen(false);
    });
    expect(reRenderResult.current.configSwitchPopoverOpenState).toBeFalsy();
  });

  it('should generate the correct configuration switch popover title based on modification flag', async () => {
    const { result } = customRender();

    expect(
      result.current.generateConfigSwitchPopoverTitle(false)
    ).toMatchSnapshot();

    expect(
      result.current.generateConfigSwitchPopoverTitle(true)
    ).toMatchSnapshot();

    expect(
      result.current.generateConfigSwitchPopoverTitle(true, (flag) =>
        flag ? 'true' : 'false'
      )
    ).toBe('true');

    expect(
      result.current.generateConfigSwitchPopoverTitle(false, (flag) =>
        flag ? 'true' : 'false'
      )
    ).toBe('false');

    expect(
      result.current.generateConfigSwitchPopoverTitle(false, 'custom-title')
    ).toBe('custom-title');
  });

  it('should trigger the appropriate callback when the configuration switch popover state changes', () => {
    const mockStartModify = jest.fn();
    const { result } = customRender();
    result.current.handleConfigSwitchChange(false, mockStartModify);
    expect(mockStartModify).not.toHaveBeenCalled();

    result.current.handleConfigSwitchChange(true, mockStartModify);
    expect(mockStartModify).toHaveBeenCalledTimes(1);
  });
});
