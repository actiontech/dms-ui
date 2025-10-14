import React, { useState, useCallback } from 'react';
import { Dropdown, Input, Popconfirm } from 'antd';
import { EnvironmentFilled } from '@actiontech/icons';
import {
  AvailabilityZoneSelectorStyleWrapper,
  AvailabilityZoneMenuStyleWrapper
} from './style';
import { BasicEmpty } from '@actiontech/dms-kit';
import { useTypedNavigate } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { ROUTE_PATHS } from '@actiontech/dms-kit';

type AvailabilityZoneSelectorProps = {
  zoneTips?: IUidWithName[];
  availabilityZone?: IUidWithName;
  updateRecentlySelectedZone: (zone: IUidWithName) => void;
};

const AvailabilityZoneSelector: React.FC<AvailabilityZoneSelectorProps> = ({
  zoneTips,
  availabilityZone,
  updateRecentlySelectedZone
}) => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();
  const [searchText, setSearchText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const filteredZones = useCallback(() => {
    return (
      zoneTips?.filter((zone) =>
        zone.name?.toLowerCase().includes(searchText.toLowerCase())
      ) ?? []
    );
  }, [searchText, zoneTips]);
  const handleSelectZone = (zone: IUidWithName) => {
    updateRecentlySelectedZone(zone);
    setDropdownOpen(false);
    EventEmitter.emit(EmitterKey.DMS_Sync_Project_Archived_Status);
    EventEmitter.emit(EmitterKey.DMS_Reload_Initial_Data);
    navigate(ROUTE_PATHS.BASE.HOME);
  };
  const customDropdownRender = () => {
    const zones = filteredZones();
    return (
      <AvailabilityZoneMenuStyleWrapper>
        <div className="search-container">
          <Input
            placeholder={t('common.search')}
            bordered={false}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="divider" />
        {zones.length > 0 ? (
          <div className="zones-container">
            {zones.map((zone) => {
              if (zone?.uid !== availabilityZone?.uid) {
                return (
                  <Popconfirm
                    key={zone.uid}
                    title={t('dmsMenu.availabilityZone.switchAvailabilityZone')}
                    onConfirm={() => handleSelectZone(zone)}
                    placement="right"
                  >
                    <div
                      className={`zone-item ${
                        availabilityZone?.uid === zone.uid ? 'selected' : ''
                      }`}
                    >
                      <EnvironmentFilled
                        className="icon"
                        color="currentColor"
                      />
                      <span>{zone.name}</span>
                    </div>
                  </Popconfirm>
                );
              }
              return (
                <div
                  key={zone.uid}
                  className={`zone-item ${
                    availabilityZone?.uid === zone.uid ? 'selected' : ''
                  }`}
                >
                  <EnvironmentFilled className="icon" color="currentColor" />
                  <span>{zone.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-container">
            <BasicEmpty />
          </div>
        )}
      </AvailabilityZoneMenuStyleWrapper>
    );
  };
  return (
    <Dropdown
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      trigger={['click']}
      dropdownRender={customDropdownRender}
      placement="bottomRight"
    >
      <AvailabilityZoneSelectorStyleWrapper>
        <EnvironmentFilled />
        <div
          className="text"
          title={
            availabilityZone?.name || t('dmsMenu.availabilityZone.pleaseSelect')
          }
        >
          {availabilityZone?.name || t('dmsMenu.availabilityZone.pleaseSelect')}
        </div>
      </AvailabilityZoneSelectorStyleWrapper>
    </Dropdown>
  );
};
export default AvailabilityZoneSelector;
