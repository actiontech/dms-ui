import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../testUtils/superRender';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import CompanyNoticeBanner from '.';

const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? matches : false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  });
};

const triggerOverflow = (
  container: HTMLElement,
  textWidth = 800,
  containerWidth = 200
) => {
  Object.defineProperty(container, 'clientWidth', {
    configurable: true,
    get: () => containerWidth
  });

  const measureEl = container.querySelector('.notice-measure');
  if (measureEl) {
    Object.defineProperty(measureEl, 'scrollWidth', {
      configurable: true,
      get: () => textWidth
    });
  }
};

describe('base/page/Nav/CompanyNoticeBanner', () => {
  let requestGetCompanyNotice: jest.SpyInstance;
  let resizeCallback: (() => void) | null = null;

  beforeEach(() => {
    jest.useFakeTimers();
    mockMatchMedia(false);
    requestGetCompanyNotice = dms.getCompanyNotice();
    resizeCallback = null;

    global.ResizeObserver = class ResizeObserver {
      constructor(cb: ResizeObserverCallback) {
        resizeCallback = () => cb([], this as unknown as ResizeObserver);
      }
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
    expect(baseElement.querySelector('.notice-text')?.textContent).toBe(
      'notice'
    );
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
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetCompanyNotice).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(60 * 1000 + 3300));
    expect(requestGetCompanyNotice).toHaveBeenCalledTimes(2);
  });

  describe('marquee and detail modal', () => {
    it('should not show marquee animation when text does not overflow', async () => {
      const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
      await act(async () => jest.advanceTimersByTime(3300));

      expect(baseElement.querySelector('.notice-text')?.textContent).toBe(
        'notice'
      );
      expect(
        baseElement.querySelector('.notice-marquee-animate')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('查看全部')).not.toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('should show marquee animation when text overflows', async () => {
      const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
      await act(async () => jest.advanceTimersByTime(3300));

      const contentArea = baseElement.querySelector(
        '.notice-content-area'
      ) as HTMLElement;
      triggerOverflow(contentArea);

      if (resizeCallback) {
        act(resizeCallback);
      }
      await act(async () => jest.advanceTimersByTime(200));

      expect(
        baseElement.querySelector('.notice-marquee-animate')
      ).toBeInTheDocument();
      expect(screen.queryByText('查看全部')).not.toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('should open detail modal when content area is clicked', async () => {
      requestGetCompanyNotice.mockImplementation(() =>
        createSpySuccessResponse({
          data: { notice_str: 'test notice content' }
        })
      );

      const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
      await act(async () => jest.advanceTimersByTime(3300));

      fireEvent.click(baseElement.querySelector('.notice-content-area')!);
      await act(async () => jest.advanceTimersByTime(200));

      expect(
        screen.getAllByText('test notice content').length
      ).toBeGreaterThanOrEqual(1);
      expect(baseElement).toMatchSnapshot();
    });

    it('should close detail modal when close button is clicked', async () => {
      requestGetCompanyNotice.mockImplementation(() =>
        createSpySuccessResponse({
          data: { notice_str: 'test notice content' }
        })
      );

      const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
      await act(async () => jest.advanceTimersByTime(3300));

      fireEvent.click(baseElement.querySelector('.notice-content-area')!);
      await act(async () => jest.advanceTimersByTime(200));

      fireEvent.click(screen.getByText('关 闭'));
      await act(async () => jest.advanceTimersByTime(200));
      expect(baseElement).toMatchSnapshot();
    });

    it('should open detail modal via keyboard Enter on content area', async () => {
      requestGetCompanyNotice.mockImplementation(() =>
        createSpySuccessResponse({
          data: { notice_str: 'keyboard test notice' }
        })
      );

      const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
      await act(async () => jest.advanceTimersByTime(3300));

      fireEvent.keyDown(baseElement.querySelector('.notice-content-area')!, {
        key: 'Enter'
      });
      await act(async () => jest.advanceTimersByTime(200));
      expect(baseElement).toMatchSnapshot();
    });

    it('should show expand button when prefers reduced motion and text overflows', async () => {
      mockMatchMedia(true);

      requestGetCompanyNotice.mockImplementation(() =>
        createSpySuccessResponse({
          data: { notice_str: 'reduced motion notice content' }
        })
      );

      const { baseElement } = baseSuperRender(<CompanyNoticeBanner />);
      await act(async () => jest.advanceTimersByTime(3300));

      const contentArea = baseElement.querySelector(
        '.notice-content-area'
      ) as HTMLElement;
      triggerOverflow(contentArea);

      if (resizeCallback) {
        act(resizeCallback);
      }
      await act(async () => jest.advanceTimersByTime(200));

      expect(
        baseElement.querySelector('.notice-marquee-animate')
      ).not.toBeInTheDocument();
      expect(screen.getByText('查看全部')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });
  });
});
