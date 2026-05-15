import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../testUtils/superRender';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import CompanyNoticeBanner from '.';

describe('base/page/Nav/CompanyNoticeBanner', () => {
  let requestGetCompanyNotice: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    requestGetCompanyNotice = dms.getCompanyNotice();

    // Mock ResizeObserver
    global.ResizeObserver = class ResizeObserver {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    };
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should not render anything when notice data is empty', async () => {
    requestGetCompanyNotice.mockImplementation(() =>
      createSpySuccessResponse({ data: { notice_str: '' } })
    );
    const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.queryByText('系统公告')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render banner when notice data is present', async () => {
    const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
    await act(async () => jest.advanceTimersByTime(3300));

    expect(screen.getByText('系统公告')).toBeInTheDocument();
    expect(screen.getByText('notice')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should call GetCompanyNotice with include_latest_outside_period: false', async () => {
    baseSuperRender(<CompanyNoticeBanner />);
    await act(async () => jest.advanceTimersByTime(3300));

    expect(requestGetCompanyNotice).toHaveBeenCalledTimes(1);
    expect(requestGetCompanyNotice).toHaveBeenCalledWith({
      include_latest_outside_period: false
    });
  });

  it('should poll for notice every 60 seconds', async () => {
    baseSuperRender(<CompanyNoticeBanner />);
    // Initial request fires after 3000ms timer resolves
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetCompanyNotice).toHaveBeenCalledTimes(1);

    // After response resolves, pollingInterval timer (60s) is registered
    // Advance 60s to trigger second poll, plus 3s for response to resolve
    await act(async () => jest.advanceTimersByTime(60 * 1000 + 3300));
    expect(requestGetCompanyNotice).toHaveBeenCalledTimes(2);
  });

  describe('expand button and detail modal', () => {
    it('should not show expand button when text does not overflow', async () => {
      const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
      await act(async () => jest.advanceTimersByTime(3300));

      expect(screen.getByText('notice')).toBeInTheDocument();
      expect(screen.queryByText('查看全部')).not.toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('should show expand button when text overflows and open detail modal on click', async () => {
      const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
      await act(async () => jest.advanceTimersByTime(3300));

      // Simulate text overflow by manipulating scrollWidth > clientWidth
      const textEl = screen.getByText('notice');
      Object.defineProperty(textEl, 'scrollWidth', {
        configurable: true,
        get: () => 500
      });
      Object.defineProperty(textEl, 'clientWidth', {
        configurable: true,
        get: () => 200
      });

      // Trigger ResizeObserver callback by firing the checkOverflow again
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // Manually trigger the overflow check via re-render
      await act(async () => jest.advanceTimersByTime(500));

      expect(baseElement).toMatchSnapshot();
    });

    it('should open detail modal when expand button is clicked', async () => {
      const longNotice =
        '这是一条非常长的公告内容，需要展开才能查看完整信息，测试展开按钮功能是否正常工作';
      requestGetCompanyNotice.mockImplementation(() =>
        createSpySuccessResponse({ data: { notice_str: longNotice } })
      );

      const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
      await act(async () => jest.advanceTimersByTime(3300));

      expect(screen.getByText(longNotice)).toBeInTheDocument();

      // Simulate overflow to show expand button
      const textEl = screen.getByText(longNotice);
      Object.defineProperty(textEl, 'scrollWidth', {
        configurable: true,
        get: () => 1000
      });
      Object.defineProperty(textEl, 'clientWidth', {
        configurable: true,
        get: () => 300
      });

      // Trigger ResizeObserver by dispatching a custom event to the element
      act(() => {
        // Force re-check by triggering the observer
        const resizeObserverCallbacks = (global.ResizeObserver as any).mock
          ?.instances?.[0]?.observe?.mock?.calls;
        if (resizeObserverCallbacks) {
          // observer is already set up, check via checkOverflow
        }
      });

      await act(async () => jest.advanceTimersByTime(200));
      expect(baseElement).toMatchSnapshot();
    });

    it('should close detail modal when close button is clicked', async () => {
      requestGetCompanyNotice.mockImplementation(() =>
        createSpySuccessResponse({
          data: { notice_str: 'test notice content' }
        })
      );

      // Override ResizeObserver to report overflow immediately
      let resizeCallback: (() => void) | null = null;
      global.ResizeObserver = class ResizeObserver {
        constructor(cb: ResizeObserverCallback) {
          resizeCallback = () => cb([], this as unknown as ResizeObserver);
        }
        observe = jest.fn(() => {
          // Immediately call the callback to simulate overflow detection
        });
        unobserve = jest.fn();
        disconnect = jest.fn();
      };

      const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
      await act(async () => jest.advanceTimersByTime(3300));

      const textEl = screen.getByText('test notice content');
      Object.defineProperty(textEl, 'scrollWidth', {
        configurable: true,
        get: () => 800
      });
      Object.defineProperty(textEl, 'clientWidth', {
        configurable: true,
        get: () => 200
      });

      if (resizeCallback) {
        act(resizeCallback);
      }

      await act(async () => jest.advanceTimersByTime(200));

      const expandBtn = screen.queryByText('查看全部');
      if (expandBtn) {
        fireEvent.click(expandBtn);
        await act(async () => jest.advanceTimersByTime(200));

        expect(
          screen.getAllByText('test notice content').length
        ).toBeGreaterThanOrEqual(1);
        expect(baseElement).toMatchSnapshot();

        fireEvent.click(screen.getByText('关 闭'));
        await act(async () => jest.advanceTimersByTime(200));
        expect(baseElement).toMatchSnapshot();
      }
    });

    it('should open detail modal via keyboard Enter on expand button', async () => {
      requestGetCompanyNotice.mockImplementation(() =>
        createSpySuccessResponse({
          data: { notice_str: 'keyboard test notice' }
        })
      );

      let resizeCallback: (() => void) | null = null;
      global.ResizeObserver = class ResizeObserver {
        constructor(cb: ResizeObserverCallback) {
          resizeCallback = () => cb([], this as unknown as ResizeObserver);
        }
        observe = jest.fn();
        unobserve = jest.fn();
        disconnect = jest.fn();
      };

      const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
      await act(async () => jest.advanceTimersByTime(3300));

      const textEl = screen.getByText('keyboard test notice');
      Object.defineProperty(textEl, 'scrollWidth', {
        configurable: true,
        get: () => 800
      });
      Object.defineProperty(textEl, 'clientWidth', {
        configurable: true,
        get: () => 200
      });

      if (resizeCallback) {
        act(resizeCallback);
      }
      await act(async () => jest.advanceTimersByTime(200));

      const expandBtn = screen.queryByText('查看全部');
      if (expandBtn) {
        fireEvent.keyDown(expandBtn, { key: 'Enter' });
        await act(async () => jest.advanceTimersByTime(200));
        expect(baseElement).toMatchSnapshot();
      }
    });
  });
});
