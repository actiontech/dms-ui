import { useCallback } from 'react';
import { LocalStorageWrapper } from '@actiontech/shared';
import { StorageKey } from '@actiontech/shared/lib/enum';
import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';
import { cloneDeep, remove } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../store';
import {
  updateMemorizedAvailabilityZone,
  updateRecentlySelectedZoneRecord
} from '../../store/availabilityZone';

export const DEFAULT_MAX_SELECTED_ZONE_NUMBER = 3;

const useRecentlySelectedZone = () => {
  const {
    availabilityZone,
    recentlySelectedZoneRecord,
    availabilityZoneOptions
  } = useSelector((state: IReduxState) => ({
    availabilityZone: state.availabilityZone.memorizedAvailabilityZone,
    recentlySelectedZoneRecord:
      state.availabilityZone.recentlySelectedZoneRecord,
    availabilityZoneOptions: state.availabilityZone.availabilityZoneTips?.map(
      (zone) => ({
        label: zone.name,
        value: zone.uid
      })
    )
  }));

  const dispatch = useDispatch();

  const setAvailabilityZone = useCallback(
    (zone: IUidWithName | undefined) => {
      dispatch(
        updateMemorizedAvailabilityZone({
          memorizedAvailabilityZone: zone
        })
      );
    },
    [dispatch]
  );

  const setRecentlySelectedZoneRecord = useCallback(
    (record: IUidWithName[]) => {
      dispatch(
        updateRecentlySelectedZoneRecord({ recentlySelectedZoneRecord: record })
      );
    },
    [dispatch]
  );

  const setStorageRecentlySelectedZoneRecord = useCallback(
    (record: IUidWithName[]) => {
      LocalStorageWrapper.set(
        StorageKey.DMS_AVAILABILITY_ZONE,
        JSON.stringify(record)
      );
    },
    []
  );

  const updateRecentlySelectedZone = useCallback(
    (zone: IUidWithName) => {
      setAvailabilityZone(zone);

      const currentRecord = cloneDeep(recentlySelectedZoneRecord ?? []);
      if (currentRecord.some((v) => v.uid === zone.uid)) {
        remove(currentRecord, (v) => v.uid === zone.uid);
      }

      currentRecord.unshift(zone);

      if (currentRecord.length > DEFAULT_MAX_SELECTED_ZONE_NUMBER) {
        currentRecord.pop();
      }

      setRecentlySelectedZoneRecord(currentRecord);

      setStorageRecentlySelectedZoneRecord(currentRecord);
    },
    [
      recentlySelectedZoneRecord,
      setAvailabilityZone,
      setRecentlySelectedZoneRecord,
      setStorageRecentlySelectedZoneRecord
    ]
  );

  const verifyRecentlySelectedZoneRecord = (zoneTips: IUidWithName[]) => {
    // 如果当前选择的区域在已配置的区域中是不存在的，则从最近选择区域中移除并且删除当前选择的区域
    if (!zoneTips?.some((v) => v.uid === availabilityZone?.uid)) {
      setAvailabilityZone(undefined);
      const currentRecord = cloneDeep(recentlySelectedZoneRecord ?? []);
      currentRecord.forEach((i) => {
        if (i.uid === availabilityZone?.uid) {
          remove(currentRecord, (v) => v.uid === i.uid);
        }
      });
      setRecentlySelectedZoneRecord(currentRecord);

      setStorageRecentlySelectedZoneRecord(currentRecord);
    }

    // 如果当前选择的区域在已配置的区域中存在，但是name不相同，则更新name
    if (
      zoneTips?.some(
        (v) =>
          v.uid === availabilityZone?.uid && v.name !== availabilityZone?.name
      )
    ) {
      const name = zoneTips.find((v) => v.uid === availabilityZone?.uid)?.name;
      setAvailabilityZone({
        ...availabilityZone,
        name: zoneTips.find((v) => v.uid === availabilityZone?.uid)?.name
      });
      const currentRecord = cloneDeep(recentlySelectedZoneRecord ?? []);
      currentRecord.forEach((i) => {
        if (i.uid === availabilityZone?.uid) {
          i.name = name;
        }
      });
      setRecentlySelectedZoneRecord(currentRecord);

      setStorageRecentlySelectedZoneRecord(currentRecord);
    }
  };

  const initializeAvailabilityZone = useCallback(() => {
    const data = LocalStorageWrapper.get(StorageKey.DMS_AVAILABILITY_ZONE);
    try {
      const parsedData = JSON.parse(data || '[]');
      setRecentlySelectedZoneRecord(parsedData);
      setAvailabilityZone(parsedData?.[0] ?? undefined);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [setAvailabilityZone, setRecentlySelectedZoneRecord]);

  const clearRecentlySelectedZone = useCallback(() => {
    setRecentlySelectedZoneRecord([]);
    setAvailabilityZone(undefined);
    setStorageRecentlySelectedZoneRecord([]);
  }, [
    setAvailabilityZone,
    setRecentlySelectedZoneRecord,
    setStorageRecentlySelectedZoneRecord
  ]);

  return {
    availabilityZone,
    setAvailabilityZone,
    recentlySelectedZoneRecord,
    setRecentlySelectedZoneRecord,
    updateRecentlySelectedZone,
    initializeAvailabilityZone,
    verifyRecentlySelectedZoneRecord,
    availabilityZoneOptions,
    clearRecentlySelectedZone
  };
};

export default useRecentlySelectedZone;
