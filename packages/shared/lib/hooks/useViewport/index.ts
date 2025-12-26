import { useEffect } from 'react';

export interface ViewportConfig {
  width?: string;
  initialScale?: number;
  maximumScale?: number;
  minimumScale?: number;
  userScalable?: boolean;
  viewportFit?: 'auto' | 'contain' | 'cover';
}

const defaultMobileConfig: ViewportConfig = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  minimumScale: 1.0,
  userScalable: false,
  viewportFit: 'cover'
};

const defaultDesktopConfig: ViewportConfig = {
  width: 'device-width',
  initialScale: 1.0,
  userScalable: true
};

/**
 * 动态设置viewport meta标签
 * @param isMobile - 是否为移动端
 * @param customConfig - 自定义配置，会覆盖默认配置
 */
export const useViewport = (
  isMobile?: boolean,
  customConfig?: ViewportConfig
) => {
  useEffect(() => {
    const config =
      customConfig || (isMobile ? defaultMobileConfig : defaultDesktopConfig);

    let viewport = document.querySelector('meta[name="viewport"]');

    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }

    const contentParts: string[] = [];

    if (config.width) {
      contentParts.push(`width=${config.width}`);
    }

    if (config.initialScale !== undefined) {
      contentParts.push(`initial-scale=${config.initialScale}`);
    }

    if (config.maximumScale !== undefined) {
      contentParts.push(`maximum-scale=${config.maximumScale}`);
    }

    if (config.minimumScale !== undefined) {
      contentParts.push(`minimum-scale=${config.minimumScale}`);
    }

    if (config.userScalable !== undefined) {
      contentParts.push(`user-scalable=${config.userScalable ? 'yes' : 'no'}`);
    }

    if (config.viewportFit) {
      contentParts.push(`viewport-fit=${config.viewportFit}`);
    }

    viewport.setAttribute('content', contentParts.join(', '));
  }, [isMobile, customConfig]);
};

export default useViewport;
