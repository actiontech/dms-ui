import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Row, Space } from 'antd';
import { PageHeader } from '@actiontech/dms-kit';
import { useTypedQuery } from '@actiontech/shared';
import { PERMISSIONS, usePermission } from '@actiontech/shared/lib/features';
import { SystemStyleWrapper } from './style';
import { initSystemModalStatus } from '../../store/system';
import { ModalName } from '../../data/ModalName';
import { SystemSegmentedKeyEnum } from './index.enum';
import PushNotification from './PushNotification';
import ProcessConnection from './ProcessConnection';
import GlobalSetting from './GlobalSetting';
import LoginConnection from './LoginConnection/index';
import AccessSetting from './AccessSetting';
import License from './License';
import PersonalizeSetting from './PersonalizeSetting';
import GitSSHConfig from './GitSSHConfig';
import DatabaseAccountPasswordPolicyForm from './DatabaseAccountPasswordPolicy';
import { ROUTE_PATHS } from '@actiontech/dms-kit';

const System = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const extractQueries = useTypedQuery();
  const { checkPagePermission } = usePermission();
  const canViewAccessSettings = checkPagePermission(
    PERMISSIONS.PAGES.BASE.ACCESS_SETTINGS
  );
  const options = useMemo(() => {
    const items = [
      // #if [sqle]
      {
        label: t('dmsSystem.tabPaneTitle.pushNotification'),
        value: SystemSegmentedKeyEnum.PushNotification,
        components: <PushNotification />
      },
      {
        label: t('dmsSystem.tabPaneTitle.processConnection'),
        value: SystemSegmentedKeyEnum.ProcessConnection,
        components: <ProcessConnection />
      },
      // #endif

      {
        label: t('dmsSystem.tabPaneTitle.loginConnection'),
        value: SystemSegmentedKeyEnum.LoginConnection,
        components: <LoginConnection />
      },
      {
        label: t('dmsSystem.tabPaneTitle.accessSettings'),
        value: SystemSegmentedKeyEnum.AccessSettings,
        components: <AccessSetting />
      },
      // #if [sqle]
      {
        label: t('dmsSystem.tabPaneTitle.globalConfiguration'),
        value: SystemSegmentedKeyEnum.GlobalConfiguration,
        components: <GlobalSetting />
      },
      // #endif

      // #if [ee]
      {
        label: t('dmsSystem.tabPaneTitle.license'),
        value: SystemSegmentedKeyEnum.License,
        components: <License />
      },
      {
        label: t('dmsSystem.tabPaneTitle.personalize'),
        value: SystemSegmentedKeyEnum.PersonalizeSetting,
        components: <PersonalizeSetting />
      },
      // #endif
      {
        label: t('dmsSystem.tabPaneTitle.gitSSH'),
        value: SystemSegmentedKeyEnum.GitSSHConfig,
        components: <GitSSHConfig />
      },
      // #if [provision]
      {
        label: t('dmsSystem.tabPaneTitle.databaseAccountPasswordPolicy'),
        value: SystemSegmentedKeyEnum.DatabaseAccountPasswordPolicy,
        components: <DatabaseAccountPasswordPolicyForm />
      }
      // #endif
    ];
    return items.filter(
      (item) =>
        item.value !== SystemSegmentedKeyEnum.AccessSettings ||
        canViewAccessSettings
    );
  }, [t, canViewAccessSettings]);
  const [activeTabKey, setActiveTabKey] = useState(options[0].value);
  const renderActiveTab = useCallback(() => {
    return options.find((item) => item.value === activeTabKey)?.components;
  }, [activeTabKey, options]);
  useEffect(() => {
    const urlSearchParams = extractQueries(ROUTE_PATHS.BASE.SYSTEM.index);
    if (urlSearchParams && urlSearchParams.active_tab) {
      const tabFromUrl = urlSearchParams.active_tab as SystemSegmentedKeyEnum;
      if (options.some((item) => item.value === tabFromUrl)) {
        setActiveTabKey(tabFromUrl);
      }
    }
  }, [extractQueries, options]);

  useEffect(() => {
    if (!options.some((item) => item.value === activeTabKey) && options[0]) {
      setActiveTabKey(options[0].value);
    }
  }, [activeTabKey, options]);

  // #if [ee]
  useEffect(() => {
    dispatch(
      initSystemModalStatus({
        modalStatus: {
          [ModalName.DMS_Import_License]: false
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endif

  return (
    <SystemStyleWrapper>
      <PageHeader title={t('dmsSystem.pageTitle')} />
      <Row className="system-tab-bar-wrapper" align={'middle'}>
        <Space size={4} className="system-tab-bar" wrap>
          {options.map((item) => (
            <button
              type="button"
              key={item.value}
              className={
                item.value === activeTabKey
                  ? 'ant-segmented-item ant-segmented-item-selected system-tab-item system-tab-item-active'
                  : 'ant-segmented-item system-tab-item'
              }
              title={item.label}
              onClick={() => setActiveTabKey(item.value)}
            >
              {item.label}
            </button>
          ))}
        </Space>
      </Row>
      <Row justify={'center'}>{renderActiveTab()}</Row>
    </SystemStyleWrapper>
  );
};
export default System;
