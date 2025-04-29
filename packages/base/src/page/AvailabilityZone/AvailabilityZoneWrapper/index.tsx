import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Space } from 'antd';
import { BasicModal, BasicSelect, BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { useTypedNavigate } from '@actiontech/shared';
import useRecentlySelectedZone from '../../../hooks/useRecentlySelectedZone';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';

const AvailabilityZoneWrapper: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useTypedNavigate();

  const { availabilityZoneOptions } = useSelector((state: IReduxState) => ({
    availabilityZoneOptions: state.availabilityZone.availabilityZoneTips.map(
      (zone) => ({
        label: zone.name,
        value: zone.uid
      })
    )
  }));

  const { availabilityZone, updateRecentlySelectedZone } =
    useRecentlySelectedZone();

  const [zoneModalVisible, setZoneModalVisible] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string>();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  useEffect(() => {
    if (!availabilityZone) {
      const { pathname, search } = location;
      setPendingPath(pathname + search);
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
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
  };

  const isZoneConfigured = !!availabilityZoneOptions?.length;
  const isMemoriredZoneNotInOptions = useMemo(
    () =>
      !availabilityZoneOptions?.some((v) => v.value === availabilityZone?.uid),
    [availabilityZoneOptions, availabilityZone]
  );

  if (isZoneConfigured && isMemoriredZoneNotInOptions) {
    return (
      <BasicModal
        title={t('availabilityZone.wrapper.modalTitle')}
        open={zoneModalVisible}
        footer={
          <Space>
            <BasicButton onClick={onModalCancel}>
              {t('common.cancel')}
            </BasicButton>
            <BasicButton
              onClick={onModalOk}
              disabled={!selectedZone}
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
