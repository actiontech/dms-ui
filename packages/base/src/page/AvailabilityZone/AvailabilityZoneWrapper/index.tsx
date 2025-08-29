import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Space } from 'antd';
import { BasicModal, BasicSelect, BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { useTypedNavigate } from '@actiontech/shared';
import useRecentlySelectedZone from '../../../hooks/useRecentlySelectedZone';
import { useRef } from 'react';
import { useUserInfo } from '@actiontech/shared/lib/features';

const AvailabilityZoneWrapper: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useTypedNavigate();

  const {
    availabilityZone,
    updateRecentlySelectedZone,
    availabilityZoneOptions
  } = useRecentlySelectedZone();

  const [zoneModalVisible, setZoneModalVisible] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string>();
  const pendingPath = useRef<string | null>(null);
  const { refreshProjectListAsync, getUserInfoLoading, updateUserInfo } =
    useUserInfo();

  useEffect(() => {
    if (!availabilityZone) {
      const { pathname, search } = location;
      pendingPath.current = pathname + search;
      setZoneModalVisible(true);
    }
  }, [location, availabilityZone]);

  const onModalCancel = () => {
    navigate(-1);
  };

  const onModalOk = () => {
    updateRecentlySelectedZone({
      uid: selectedZone ?? '',
      name:
        availabilityZoneOptions.find((zone) => zone?.value === selectedZone)
          ?.label ?? ''
    });
    setZoneModalVisible(false);
    // refreshProjectListAsync();
    updateUserInfo();
    // refreshProjectListAsync().then(() => {
    // if (pendingPath.current) {
    //   navigate(pendingPath.current);
    //   pendingPath.current = null;
    // }
    // });
  };

  const isZoneConfigured = !!availabilityZoneOptions?.length;
  const isMemorizedZoneNotInOptions = useMemo(
    () =>
      !availabilityZoneOptions?.some((v) => v.value === availabilityZone?.uid),
    [availabilityZoneOptions, availabilityZone]
  );

  console.log(isZoneConfigured && isMemorizedZoneNotInOptions);

  if (isZoneConfigured && isMemorizedZoneNotInOptions) {
    return (
      <BasicModal
        title={t('availabilityZone.wrapper.modalTitle')}
        open={zoneModalVisible}
        footer={
          <Space>
            <BasicButton onClick={onModalCancel} disabled={getUserInfoLoading}>
              {t('common.cancel')}
            </BasicButton>
            <BasicButton
              onClick={onModalOk}
              disabled={!selectedZone}
              loading={getUserInfoLoading}
              type="primary"
            >
              {t('common.ok')}
            </BasicButton>
          </Space>
        }
        closable={false}
      >
        <div>
          <p>{t('availabilityZone.wrapper.modalTips')}</p>
          <BasicSelect
            options={availabilityZoneOptions}
            value={selectedZone}
            onChange={setSelectedZone}
            className="full-width-element"
          />
        </div>
      </BasicModal>
    );
  }

  return <Outlet />;
};

export default AvailabilityZoneWrapper;
