import { useBoolean, useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { updateSystemModalStatus } from '../../../store/system';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { Space, QRCode } from 'antd';
import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { ModalName } from '../../../data/ModalName';
import SystemBasicTitle from '../components/BasicTitle';
import ImportLicense from './Modal/ImportLicense';
import { LicenseColumn } from './index.data';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { DEFAULT_LANGUAGE } from '@actiontech/shared/lib/locale';

const License = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [
    collectLicenseLoading,
    { setTrue: startCollect, setFalse: collectFinish }
  ] = useBoolean();

  const { language } = useCurrentUser();

  const [qrCodeVisible, { setTrue: showQRCode, setFalse: hideQRCode }] =
    useBoolean();

  const [licenseData, setLicenseData] = useState<string>('');

  const {
    data,
    loading,
    refresh: refreshLicenseList
  } = useRequest(() => {
    // 这个接口后端无法获取用户信息，会默认使用 浏览器语言偏好的语言。为了防止出现语言不一致的问题，前端修改 Accept-Language 为当前用户设置的语言
    return Configuration.GetLicense({
      headers: { 'Accept-Language': `${language},${DEFAULT_LANGUAGE};` }
    }).then((res) => ({
      list: res?.data?.license ?? []
    }));
  });

  const collectLicense = () => {
    startCollect();
    Configuration.GetLicenseInfo({
      responseType: 'blob'
    })
      .then((res) => {
        if (
          res.data instanceof Blob &&
          res.data.type === 'application/octet-stream'
        ) {
          const blob = new Blob([res.data], { type: 'application/json' });
          blob.text().then((text) => {
            setLicenseData(text);
            showQRCode();
          });
        }
      })
      .finally(() => {
        collectFinish();
      });
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
          <BasicToolTips
            titleWidth={326}
            title={<QRCode value={licenseData} size={300} />}
            open={qrCodeVisible}
            trigger={['click']}
            onOpenChange={(open: boolean) => {
              if (!open) {
                hideQRCode();
              }
            }}
          >
            <BasicButton
              type="primary"
              onClick={collectLicense}
              loading={collectLicenseLoading}
            >
              {t('dmsSystem.license.collect')}
            </BasicButton>
          </BasicToolTips>
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
