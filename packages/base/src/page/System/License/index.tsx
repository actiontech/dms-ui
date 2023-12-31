import { useBoolean, useRequest } from 'ahooks';
import { Space } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import EmitterKey from '../../../data/EmitterKey';
import { updateSystemModalStatus } from '../../../store/system';
import EventEmitter from '../../../utils/EventEmitter';
import { Row } from 'antd';
import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { LicenseColumn } from './index.data';
import { IconTipGray } from '@actiontech/shared/lib/Icon';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { ModalName } from '../../../data/ModalName';
import ImportLicense from './Modal/ImportLicense';
import dms from '@actiontech/shared/lib/api/base/service/dms';

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
    <section className="system-form-wrapper">
      <Row
        className="config-title-wrapper has-border"
        justify={'space-between'}
        align={'middle'}
      >
        <Space>
          {t('dmsSystem.tabPaneTitle.license')}
          {/* todo: 此处提示语待产品给出后调整 */}
          <BasicToolTips title={t('dmsSystem.license.productName')}>
            <IconTipGray />
          </BasicToolTips>
        </Space>
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
      </Row>
      <ActiontechTable
        rowKey="name"
        columns={LicenseColumn}
        dataSource={data?.list}
        loading={loading}
        className="clear-padding-bottom"
      />
      <ImportLicense />
    </section>
  );
};

export default License;
