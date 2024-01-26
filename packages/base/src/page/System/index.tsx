import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Row } from 'antd';
import { BasicSegmented, PageHeader } from '@actiontech/shared';
import { SystemStyleWrapper } from './style';
import { initSystemModalStatus } from '../../store/system';
import { ModalName } from '../../data/ModalName';

// #if [sqle]
import PushNotification from './PushNotification';
import ProcessConnection from './ProcessConnection';
import GlobalSetting from './GlobalSetting';
// #endif

import LoginConnection from './LoginConnection/index';

// #if [ee]
import License from './License';
import PersonalizeSetting from './PersonalizeSetting';
// #endif

enum SystemSegmentedKeyEnum {
  PushNotification = 'push_notification',
  ProcessConnection = 'process_connection',
  LoginConnection = 'login_connection',
  GlobalConfiguration = 'global_configuration',
  License = 'license',
  PersonalizeSetting = 'personalize'
}

const System = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const options = useMemo(
    () => [
      // #if [sqle]
      {
        label: t('dmsSystem.tabPaneTitle.pushNotification'),
        value: 'push_notification',
        components: <PushNotification />
      },
      {
        label: t('dmsSystem.tabPaneTitle.processConnection'),
        value: 'process_connection',
        components: <ProcessConnection />
      },
      // #endif

      {
        label: t('dmsSystem.tabPaneTitle.loginConnection'),
        value: 'login_connection',
        components: <LoginConnection />
      },

      // #if [sqle]
      {
        label: t('dmsSystem.tabPaneTitle.globalConfiguration'),
        value: 'global_configuration',
        components: <GlobalSetting />
      },
      // #endif

      // #if [ee]
      {
        label: t('dmsSystem.tabPaneTitle.license'),
        value: 'license',
        components: <License />
      },
      {
        label: t('dmsSystem.tabPaneTitle.personalize'),
        value: 'personalize',
        components: <PersonalizeSetting />
      }
      // #endif
    ],
    [t]
  );

  const [activeTabKey, setActiveTabKey] = useState(
    options[0]?.value ?? SystemSegmentedKeyEnum.PushNotification
  );

  const renderActiveTab = useCallback(() => {
    return options.find((item) => item.value === activeTabKey)?.components;
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
      <Row className="segmented-wrapper" align={'middle'}>
        <BasicSegmented
          options={options}
          onChange={(value) => setActiveTabKey(value as SystemSegmentedKeyEnum)}
        />
      </Row>
      <Row justify={'center'}>{renderActiveTab()}</Row>
    </SystemStyleWrapper>
  );
};

export default System;
