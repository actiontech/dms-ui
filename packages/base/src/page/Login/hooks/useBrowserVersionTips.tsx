import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import { notification } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const NotificationKey = 'browser_version_tips';

const useBrowserVersionTips = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    let flag = false;
    if (!userAgent.includes('chrome')) {
      flag = true;
    }

    const versionReg = /chrome\/(.*)\s/g;
    const chromeVersion = versionReg.exec(userAgent);
    if (Array.isArray(chromeVersion) && chromeVersion.length) {
      const version = chromeVersion[1].split('.')[0];
      if (Number(version) < 80) {
        flag = true;
      }
    }

    if (flag) {
      notification.destroy(NotificationKey);
      eventEmitter.emit(EmitterKey.OPEN_GLOBAL_NOTIFICATION, 'warning', {
        message: t('dmsLogin.browserVersionTile'),
        key: NotificationKey,
        description: t('dmsLogin.browserVersionDesc'),
        duration: null
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useBrowserVersionTips;
