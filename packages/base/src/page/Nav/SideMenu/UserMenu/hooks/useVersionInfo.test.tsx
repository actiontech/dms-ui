import useVersionInfo from './useVersionInfo';

import { act, cleanup, renderHook } from '@testing-library/react';
import dms from '../../../../../testUtils/mockApi/global';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('base/page/Nav/SideMenu/useVersionInfo', () => {
  let requestGetBasicInfo: jest.SpyInstance;
  const customRender = () => {
    return renderHook(() => useVersionInfo());
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestGetBasicInfo = dms.getBasicInfo();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should execute when api return version', async () => {
    const { result } = customRender();

    expect(result.current.dmsVersion).toBe('');
    expect(result.current.sqleVersion).toBe('');

    requestGetBasicInfo.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          components: [
            {
              name: 'dms',
              version: 'main-ce 081d27e60fc072e12a9a3b02190bd434ca2be50f'
            },
            {
              name: 'sqle',
              version: 'main-ce d845a2bc4e20d8ef973cb7574a16c53f62b19b33'
            }
          ]
        }
      })
    );
    await act(async () => {
      result.current.updateVersionInfo();
      await act(async () => jest.advanceTimersByTime(3300));
    });
    expect(result.current.dmsVersion).toBe('main-ce 081d27e60f');
    expect(result.current.sqleVersion).toBe('main-ce d845a2bc4e');
  });

  it('should execute when api no version', async () => {
    const { result } = customRender();

    expect(result.current.dmsVersion).toBe('');
    expect(result.current.sqleVersion).toBe('');

    requestGetBasicInfo.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          components: [
            {
              name: 'dms'
            },
            {
              name: 'sqle'
            }
          ]
        }
      })
    );
    await act(async () => {
      result.current.updateVersionInfo();
      await act(async () => jest.advanceTimersByTime(3300));
    });
    expect(result.current.dmsVersion).toBe('');
    expect(result.current.sqleVersion).toBe('');
  });

  it('should execute get basic info for no data', async () => {
    const { result } = customRender();

    expect(result.current.dmsVersion).toBe('');
    expect(result.current.sqleVersion).toBe('');

    requestGetBasicInfo.mockImplementation(() => createSpySuccessResponse({}));
    await act(async () => {
      result.current.updateVersionInfo();
      await act(async () => jest.advanceTimersByTime(3300));
    });
    expect(result.current.dmsVersion).toBe('');
    expect(result.current.sqleVersion).toBe('');
  });

  it('should execute when api return special version', async () => {
    const { result } = customRender();

    expect(result.current.dmsVersion).toBe('');
    expect(result.current.sqleVersion).toBe('');

    requestGetBasicInfo.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          components: [
            {
              name: 'dms',
              version: 'main-ce'
            },
            {
              name: 'sqle',
              version: 'main-ce'
            }
          ]
        }
      })
    );
    await act(async () => {
      result.current.updateVersionInfo();
      await act(async () => jest.advanceTimersByTime(3300));
    });
    expect(result.current.dmsVersion).toBe('main-ce');
    expect(result.current.sqleVersion).toBe('main-ce');
  });
});
