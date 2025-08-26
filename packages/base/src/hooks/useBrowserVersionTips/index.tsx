import { notification } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { eventEmitter } from '@actiontech/dms-kit/es/utils/EventEmitter';
import EmitterKey from '@actiontech/dms-kit/es/data/EmitterKey';

const notificationKey = 'dmsLoginBrowserVersionTips';

const useBrowserVersionTips = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    let isNotSupportBrowser = false;
    const versionReg = /chrome\/(.*)\s/g;
    const chromeVersion = versionReg.exec(userAgent);
    if (!userAgent.includes('chrome')) {
      isNotSupportBrowser = true;
    } else if (Array.isArray(chromeVersion) && chromeVersion.length) {
      const version = chromeVersion[1].split('.')[0];
      if (Number(version) < 80) {
        isNotSupportBrowser = true;
      }
    }

    if (isNotSupportBrowser) {
      // 因为Login, user/bind/, Nav等都会引入此hooks，所以为了防止出现多个提示，这里加上destroy操作
      notification.destroy(notificationKey);
      eventEmitter.emit(EmitterKey.OPEN_GLOBAL_NOTIFICATION, 'warning', {
        key: notificationKey,
        message: t('dmsLogin.browserVersionTile'),
        description: t('dmsLogin.browserVersionDesc'),
        duration: null
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useBrowserVersionTips;
