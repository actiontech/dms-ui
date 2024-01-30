import { useBoolean, useRequest } from 'ahooks';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { updateSystemModalStatus } from '../../../store/system';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

import { Space } from 'antd';
import { BasicButton } from '@actiontech/shared';
import { ModalName } from '../../../data/ModalName';
import SystemBasicTitle from '../components/BasicTitle';
import ImportLicense from './Modal/ImportLicense';
import { LicenseColumn } from './index.data';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';

const License = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [
    collectLicenseLoading,
    { setTrue: startCollect, setFalse: collectFinish }
  ] = useBoolean();

  const {
    data,
    loading,
    refresh: refreshLicenseList
  } = useRequest(() => {
    return dms.GetLicense().then((res) => ({ list: res?.data?.license ?? [] }));
  });

  const collectLicense = () => {
    startCollect();
    dms.GetLicenseInfo({ responseType: 'blob' }).finally(() => collectFinish());
  };

  const importLicense = () => {
    dispatch(
      updateSystemModalStatus({
        modalName: ModalName.DMS_Import_License,
        status: true
      })
    );
  };

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.DMS_Refresh_License_List,
      refreshLicenseList
    );
    return unsubscribe;
  }, [refreshLicenseList]);

  return (
    <SystemBasicTitle
      title={t('dmsSystem.tabPaneTitle.license')}
      // todo: 此处提示语待产品给出后调整
      titleTip={t('dmsSystem.license.productName')}
      titleExtra={
        <Space key="button-wrapper">
          <BasicButton
            type="primary"
            onClick={collectLicense}
            loading={collectLicenseLoading}
          >
            {t('dmsSystem.license.collect')}
          </BasicButton>
          <BasicButton type="primary" onClick={importLicense}>
            {t('dmsSystem.license.import')}
          </BasicButton>
        </Space>
      }
    >
      <>
        <ActiontechTable
          rowKey="name"
          columns={LicenseColumn}
          dataSource={data?.list}
          loading={loading}
          className="clear-padding-bottom"
        />
        <ImportLicense />
      </>
    </SystemBasicTitle>
  );
};

export default License;
