import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Row } from 'antd';
import { BasicSegmented, PageHeader } from '@actiontech/dms-kit';
import { useTypedQuery } from '@actiontech/shared';
import { SystemStyleWrapper } from './style';
import { initSystemModalStatus } from '../../store/system';
import { ModalName } from '../../data/ModalName';
import { SystemSegmentedKeyEnum } from './index.enum';
import PushNotification from './PushNotification';
import ProcessConnection from './ProcessConnection';
import GlobalSetting from './GlobalSetting';
import LoginConnection from './LoginConnection/index';
import License from './License';
import PersonalizeSetting from './PersonalizeSetting';
import GitSSHConfig from './GitSSHConfig';
import DatabaseAccountPasswordPolicyForm from './DatabaseAccountPasswordPolicy';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
const System = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const extractQueries = useTypedQuery();
  const options = useMemo(
    () => [
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
    ],
    [t]
  );
  const [activeTabKey, setActiveTabKey] = useState(options[0].value);
  const renderActiveTab = useCallback(() => {
    return options.find((item) => item.value === activeTabKey)?.components;
  }, [activeTabKey, options]);
  useEffect(() => {
    const urlSearchParams = extractQueries(ROUTE_PATHS.BASE.SYSTEM.index);
    if (urlSearchParams && urlSearchParams.active_tab) {
      setActiveTabKey(urlSearchParams.active_tab as SystemSegmentedKeyEnum);
    }
  }, [extractQueries]);

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
          value={activeTabKey}
          options={options}
          onChange={(value) => {
            setActiveTabKey(value as SystemSegmentedKeyEnum);
          }}
        />
      </Row>
      <Row justify={'center'}>{renderActiveTab()}</Row>
    </SystemStyleWrapper>
  );
};
export default System;
