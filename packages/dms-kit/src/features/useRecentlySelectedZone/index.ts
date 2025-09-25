import { useCallback, useState, useEffect } from 'react';
import { LocalStorageWrapper } from '../../utils';
import { StorageKey } from '../../enum';
import { cloneDeep, remove } from 'lodash';
import EmitterKey from '../../data/EmitterKey';
import { eventEmitter } from '../../utils/EventEmitter';

export const DEFAULT_MAX_SELECTED_ZONE_NUMBER = 3;

const useRecentlySelectedZone = <T extends { uid?: string; name?: string }>({
  manualInit = false
}: { manualInit?: boolean } = {}) => {
  const [availabilityZone, setAvailabilityZone] = useState<T>();

  const setStorageRecentlySelectedZoneRecord = useCallback((record: T[]) => {
    LocalStorageWrapper.set(
      StorageKey.DMS_AVAILABILITY_ZONE,
      JSON.stringify(record)
    );
  }, []);

  const getStorageZoneRecord = useCallback(() => {
    const data = LocalStorageWrapper.get(StorageKey.DMS_AVAILABILITY_ZONE);
    try {
      const parsedData: T[] = JSON.parse(data || '[]');
      return parsedData;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return [];
    }
  }, []);

  const updateRecentlySelectedZone = useCallback(
    (zone: T) => {
      setAvailabilityZone(zone);
      const parsedData = getStorageZoneRecord();
      eventEmitter.emit(EmitterKey.DMS_SYNC_CURRENT_AVAILABILITY_ZONE, zone);
      const currentReocrd = cloneDeep(parsedData);
      if (currentReocrd.some((v) => v.uid === zone.uid)) {
        remove(currentReocrd, (v) => v.uid === zone.uid);
      }

      currentReocrd.unshift(zone);

      if (currentReocrd.length > DEFAULT_MAX_SELECTED_ZONE_NUMBER) {
        currentReocrd.pop();
      }

      setStorageRecentlySelectedZoneRecord(currentReocrd);
    },
    [
      setAvailabilityZone,
      setStorageRecentlySelectedZoneRecord,
      getStorageZoneRecord
    ]
  );

  const verifyRecentlySelectedZoneRecord = (zoneTips: T[]) => {
    // 如果当前选择的区域在已配置的区域中是不存在的，则从最近选择区域中移除并且删除当前选择的区域
    const parsedData = getStorageZoneRecord();
    if (!zoneTips?.some((v) => v.uid === availabilityZone?.uid)) {
      setAvailabilityZone(undefined);
      const currentReocrd = cloneDeep(parsedData);
      currentReocrd.forEach((i) => {
        if (i.uid === availabilityZone?.uid) {
          remove(currentReocrd, (v) => v.uid === i.uid);
        }
      });
      setStorageRecentlySelectedZoneRecord(currentReocrd);
    }

    // 如果当前选择的区域在已配置的区域中存在，但是name不相同，则更新name
    if (
      zoneTips?.some(
        (v) =>
          v.uid === availabilityZone?.uid && v.name !== availabilityZone?.name
      )
    ) {
      const name = zoneTips.find((v) => v.uid === availabilityZone?.uid)?.name;
      const currentReocrd = cloneDeep(parsedData);
      currentReocrd.forEach((i) => {
        if (i.uid === availabilityZone?.uid) {
          i.name = name;
        }
      });
      setStorageRecentlySelectedZoneRecord(currentReocrd);
    }
  };

  const initializeAvailabilityZone = useCallback(() => {
    const parsedData = getStorageZoneRecord();
    setAvailabilityZone(parsedData?.[0] ?? undefined);
  }, [getStorageZoneRecord]);

  const clearRecentlySelectedZone = useCallback(() => {
    setAvailabilityZone(undefined);
    setStorageRecentlySelectedZoneRecord([]);
  }, [setAvailabilityZone, setStorageRecentlySelectedZoneRecord]);

  useEffect(() => {
    if (!manualInit) {
      initializeAvailabilityZone();
    }
  }, [initializeAvailabilityZone, manualInit]);

  return {
    availabilityZone,
    updateRecentlySelectedZone,
    initializeAvailabilityZone,
    verifyRecentlySelectedZoneRecord,
    clearRecentlySelectedZone,
    setAvailabilityZone
  };
};

export default useRecentlySelectedZone;
