import { baseSuperRenderHook } from '../../testUtils/superRender';
import useBrowserVersionTips from '.';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import { act, cleanup } from '@testing-library/react';

describe('useBrowserVersionTips', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });
  it('when current browser is not chrome', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
    );
    baseSuperRenderHook(useBrowserVersionTips);
    await act(async () => jest.advanceTimersByTime(300));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
  });

  it('chrome version less than 80', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.0.0 Safari/537.36'
    );
    baseSuperRenderHook(useBrowserVersionTips);
    await act(async () => jest.advanceTimersByTime(300));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
  });

  it('chrome version more than 80', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const userAgentGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    userAgentGetter.mockReturnValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.0.0 Safari/537.36'
    );
    baseSuperRenderHook(useBrowserVersionTips);
    await act(async () => jest.advanceTimersByTime(300));
    expect(eventEmitSpy).not.toHaveBeenCalled();
  });
});
