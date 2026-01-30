import { renderHook } from '@testing-library/react';
import useViewport, { ViewportConfig } from '.';

describe('useViewport', () => {
  let viewportElement: HTMLMetaElement | null;

  beforeEach(() => {
    // 清理已存在的 viewport meta 标签
    viewportElement = document.querySelector('meta[name="viewport"]');
    if (viewportElement) {
      viewportElement.remove();
    }
  });

  afterEach(() => {
    // 清理测试后的 viewport meta 标签
    viewportElement = document.querySelector('meta[name="viewport"]');
    if (viewportElement) {
      viewportElement.remove();
    }
  });

  it('should create viewport meta tag if it does not exist', () => {
    renderHook(() => useViewport());

    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).toBeInTheDocument();
    expect(viewport?.getAttribute('name')).toBe('viewport');
  });

  it('should set desktop config by default when isMobile is false', () => {
    renderHook(() => useViewport(false));

    const viewport = document.querySelector('meta[name="viewport"]');
    const content = viewport?.getAttribute('content');

    expect(content).toContain('width=device-width');
    expect(content).toContain('initial-scale=1');
    expect(content).toContain('user-scalable=yes');
    expect(content).not.toContain('maximum-scale');
    expect(content).not.toContain('minimum-scale');
  });

  it('should set mobile config when isMobile is true', () => {
    renderHook(() => useViewport(true));

    const viewport = document.querySelector('meta[name="viewport"]');
    const content = viewport?.getAttribute('content');

    expect(content).toContain('width=device-width');
    expect(content).toContain('initial-scale=1');
    expect(content).toContain('maximum-scale=1');
    expect(content).toContain('minimum-scale=1');
    expect(content).toContain('user-scalable=no');
    expect(content).toContain('viewport-fit=cover');
  });

  it('should use existing viewport meta tag if it exists', () => {
    // 预先创建一个 viewport meta 标签
    const existingViewport = document.createElement('meta');
    existingViewport.setAttribute('name', 'viewport');
    existingViewport.setAttribute('content', 'initial-content');
    document.head.appendChild(existingViewport);

    renderHook(() => useViewport(false));

    const viewports = document.querySelectorAll('meta[name="viewport"]');
    expect(viewports.length).toBe(1);
    expect(viewports[0]).toBe(existingViewport);
    expect(viewports[0].getAttribute('content')).not.toBe('initial-content');
  });

  it('should apply custom config when provided', () => {
    const customConfig: ViewportConfig = {
      width: '1024px',
      initialScale: 0.5,
      maximumScale: 2.0,
      minimumScale: 0.5,
      userScalable: true,
      viewportFit: 'contain'
    };

    renderHook(() => useViewport(false, customConfig));

    const viewport = document.querySelector('meta[name="viewport"]');
    const content = viewport?.getAttribute('content');

    expect(content).toContain('width=1024px');
    expect(content).toContain('initial-scale=0.5');
    expect(content).toContain('maximum-scale=2');
    expect(content).toContain('minimum-scale=0.5');
    expect(content).toContain('user-scalable=yes');
    expect(content).toContain('viewport-fit=contain');
  });

  it('should override default config with custom config', () => {
    const customConfig: ViewportConfig = {
      width: '800px',
      initialScale: 1.5
    };

    renderHook(() => useViewport(true, customConfig));

    const viewport = document.querySelector('meta[name="viewport"]');
    const content = viewport?.getAttribute('content');

    expect(content).toContain('width=800px');
    expect(content).toContain('initial-scale=1.5');
  });

  it('should handle partial custom config', () => {
    const customConfig: ViewportConfig = {
      maximumScale: 3.0
    };

    renderHook(() => useViewport(false, customConfig));

    const viewport = document.querySelector('meta[name="viewport"]');
    const content = viewport?.getAttribute('content');

    expect(content).toContain('maximum-scale=3');
  });

  it('should set userScalable to no when false', () => {
    const customConfig: ViewportConfig = {
      userScalable: false
    };

    renderHook(() => useViewport(false, customConfig));

    const viewport = document.querySelector('meta[name="viewport"]');
    const content = viewport?.getAttribute('content');

    expect(content).toContain('user-scalable=no');
  });

  it('should set userScalable to yes when true', () => {
    const customConfig: ViewportConfig = {
      userScalable: true
    };

    renderHook(() => useViewport(false, customConfig));

    const viewport = document.querySelector('meta[name="viewport"]');
    const content = viewport?.getAttribute('content');

    expect(content).toContain('user-scalable=yes');
  });

  it('should update viewport when isMobile changes', () => {
    const { rerender } = renderHook(({ isMobile }) => useViewport(isMobile), {
      initialProps: { isMobile: false }
    });

    let viewport = document.querySelector('meta[name="viewport"]');
    let content = viewport?.getAttribute('content');

    expect(content).toContain('user-scalable=yes');
    expect(content).not.toContain('viewport-fit');

    // 切换到移动端
    rerender({ isMobile: true });

    viewport = document.querySelector('meta[name="viewport"]');
    content = viewport?.getAttribute('content');

    expect(content).toContain('user-scalable=no');
    expect(content).toContain('viewport-fit=cover');
  });

  it('should update viewport when customConfig changes', () => {
    const { rerender } = renderHook(
      ({ config }) => useViewport(false, config),
      { initialProps: { config: { width: '800px' } as ViewportConfig } }
    );

    let viewport = document.querySelector('meta[name="viewport"]');
    let content = viewport?.getAttribute('content');

    expect(content).toContain('width=800px');

    // 更新配置
    rerender({ config: { width: '1024px' } as ViewportConfig });

    viewport = document.querySelector('meta[name="viewport"]');
    content = viewport?.getAttribute('content');

    expect(content).toContain('width=1024px');
  });

  it('should handle undefined values correctly', () => {
    const customConfig: ViewportConfig = {
      width: 'device-width'
      // 其他属性未定义
    };

    renderHook(() => useViewport(false, customConfig));

    const viewport = document.querySelector('meta[name="viewport"]');
    const content = viewport?.getAttribute('content');

    expect(content).toBe('width=device-width');
  });

  it('should handle viewportFit auto value', () => {
    const customConfig: ViewportConfig = {
      viewportFit: 'auto'
    };

    renderHook(() => useViewport(false, customConfig));

    const viewport = document.querySelector('meta[name="viewport"]');
    const content = viewport?.getAttribute('content');

    expect(content).toContain('viewport-fit=auto');
  });

  it('should use desktop config when isMobile is undefined', () => {
    renderHook(() => useViewport());

    const viewport = document.querySelector('meta[name="viewport"]');
    const content = viewport?.getAttribute('content');

    expect(content).toContain('width=device-width');
    expect(content).toContain('initial-scale=1');
    expect(content).toContain('user-scalable=yes');
  });

  it('should format content with comma and space separator', () => {
    const customConfig: ViewportConfig = {
      width: 'device-width',
      initialScale: 1.0,
      userScalable: false
    };

    renderHook(() => useViewport(false, customConfig));

    const viewport = document.querySelector('meta[name="viewport"]');
    const content = viewport?.getAttribute('content');

    // 验证格式为 "key=value, key=value"
    expect(content).toMatch(/^[\w-]+=[\w.-]+(?:, [\w-]+=[\w.-]+)*$/);
  });
});
