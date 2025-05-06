import { renderHook, act } from '@testing-library/react';
import useRecentlySelectedZone, { DEFAULT_MAX_SELECTED_ZONE_NUMBER } from '..';
import { useSelector, useDispatch } from 'react-redux';
import { LocalStorageWrapper } from '@actiontech/shared';
import { StorageKey } from '@actiontech/shared/lib/enum';
import { cloneDeep } from 'lodash';
import {
  updateMemorizedAvailabilityZone,
  updateRecentlySelectedZoneRecord
} from '../../../store/availabilityZone';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('@actiontech/shared', () => ({
  ...jest.requireActual('@actiontech/shared'),
  LocalStorageWrapper: {
    get: jest.fn(),
    set: jest.fn()
  }
}));

describe('useRecentlySelectedZone', () => {
  const dispatchSpy = jest.fn();
  const mockZoneRecord = [
    { uid: 'zone-1', name: 'Zone 1' },
    { uid: 'zone-2', name: 'Zone 2' }
  ];
  const mockAvailabilityZone = mockZoneRecord[0];
  const mockAvailabilityZoneTips = [
    { uid: 'zone-1', name: 'Zone 1' },
    { uid: 'zone-2', name: 'Zone 2' },
    { uid: 'zone-3', name: 'Zone 3' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        availabilityZone: {
          memorizedAvailabilityZone: mockAvailabilityZone,
          recentlySelectedZoneRecord: mockZoneRecord,
          availabilityZoneTips: mockAvailabilityZoneTips
        }
      })
    );
  });

  it('should return correct state values from selector', () => {
    const { result } = renderHook(() => useRecentlySelectedZone());

    expect(result.current.availabilityZone).toEqual(mockAvailabilityZone);
    expect(result.current.recentlySelectedZoneRecord).toEqual(mockZoneRecord);
    expect(result.current.availabilityZoneOptions).toEqual([
      { label: 'Zone 1', value: 'zone-1' },
      { label: 'Zone 2', value: 'zone-2' },
      { label: 'Zone 3', value: 'zone-3' }
    ]);
  });

  it('should set availability zone correctly', () => {
    const { result } = renderHook(() => useRecentlySelectedZone());
    const newZone = { uid: 'zone-3', name: 'Zone 3' };

    act(() => {
      result.current.setAvailabilityZone(newZone);
    });

    expect(dispatchSpy).toHaveBeenCalledWith(
      updateMemorizedAvailabilityZone({
        memorizedAvailabilityZone: newZone
      })
    );
  });

  it('should set recently selected zone record correctly', () => {
    const { result } = renderHook(() => useRecentlySelectedZone());
    const newRecord = [{ uid: 'zone-3', name: 'Zone 3' }];

    act(() => {
      result.current.setRecentlySelectedZoneRecord(newRecord);
    });

    expect(dispatchSpy).toHaveBeenCalledWith(
      updateRecentlySelectedZoneRecord({
        recentlySelectedZoneRecord: newRecord
      })
    );
  });

  describe('updateRecentlySelectedZone', () => {
    it('should update with a new zone', () => {
      const { result } = renderHook(() => useRecentlySelectedZone());
      const newZone = { uid: 'zone-3', name: 'Zone 3' };

      act(() => {
        result.current.updateRecentlySelectedZone(newZone);
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateMemorizedAvailabilityZone({
          memorizedAvailabilityZone: newZone
        })
      );

      const expectedRecord = [newZone, ...mockZoneRecord];
      if (expectedRecord.length > DEFAULT_MAX_SELECTED_ZONE_NUMBER) {
        expectedRecord.pop();
      }

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateRecentlySelectedZoneRecord({
          recentlySelectedZoneRecord: expectedRecord
        })
      );

      expect(LocalStorageWrapper.set).toHaveBeenCalledWith(
        StorageKey.DMS_AVAILABILITY_ZONE,
        JSON.stringify(expectedRecord)
      );
    });

    it('should reorder existing zone when updating with an existing zone', () => {
      const { result } = renderHook(() => useRecentlySelectedZone());
      const existingZone = mockZoneRecord[1];

      act(() => {
        result.current.updateRecentlySelectedZone(existingZone);
      });

      const expectedRecord = [existingZone, mockZoneRecord[0]];

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateRecentlySelectedZoneRecord({
          recentlySelectedZoneRecord: expectedRecord
        })
      );
    });

    it('should limit record to DEFAULT_MAX_SELECTED_ZONE_NUMBER', () => {
      const longRecord = [
        { uid: 'zone-1', name: 'Zone 1' },
        { uid: 'zone-2', name: 'Zone 2' },
        { uid: 'zone-3', name: 'Zone 3' }
      ];

      (useSelector as jest.Mock).mockImplementation((selector) =>
        selector({
          availabilityZone: {
            memorizedAvailabilityZone: mockAvailabilityZone,
            recentlySelectedZoneRecord: longRecord,
            availabilityZoneTips: []
          }
        })
      );

      const { result } = renderHook(() => useRecentlySelectedZone());
      const newZone = { uid: 'zone-4', name: 'Zone 4' };

      act(() => {
        result.current.updateRecentlySelectedZone(newZone);
      });

      const expectedRecord = [newZone, ...longRecord].slice(
        0,
        DEFAULT_MAX_SELECTED_ZONE_NUMBER
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateRecentlySelectedZoneRecord({
          recentlySelectedZoneRecord: expectedRecord
        })
      );

      expect(expectedRecord.length).toBe(DEFAULT_MAX_SELECTED_ZONE_NUMBER);
    });
  });

  describe('verifyRecentlySelectedZoneRecord', () => {
    it('should remove zone not present in zoneTips', () => {
      const { result } = renderHook(() => useRecentlySelectedZone());
      const zoneTips = [mockZoneRecord[1]];

      act(() => {
        result.current.verifyRecentlySelectedZoneRecord(zoneTips);
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateMemorizedAvailabilityZone({
          memorizedAvailabilityZone: undefined
        })
      );

      const expectedRecord = [mockZoneRecord[1]];

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateRecentlySelectedZoneRecord({
          recentlySelectedZoneRecord: expectedRecord
        })
      );

      expect(LocalStorageWrapper.set).toHaveBeenCalledWith(
        StorageKey.DMS_AVAILABILITY_ZONE,
        JSON.stringify(expectedRecord)
      );
    });

    it('should update zone name when it differs in zoneTips', () => {
      const { result } = renderHook(() => useRecentlySelectedZone());
      const zoneTips = [
        { uid: mockZoneRecord[0].uid, name: 'Updated Zone 1' },
        mockZoneRecord[1]
      ];

      act(() => {
        result.current.verifyRecentlySelectedZoneRecord(zoneTips);
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateMemorizedAvailabilityZone({
          memorizedAvailabilityZone: {
            ...mockAvailabilityZone,
            name: 'Updated Zone 1'
          }
        })
      );

      const expectedRecord = cloneDeep(mockZoneRecord);
      expectedRecord[0].name = 'Updated Zone 1';

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateRecentlySelectedZoneRecord({
          recentlySelectedZoneRecord: expectedRecord
        })
      );

      expect(LocalStorageWrapper.set).toHaveBeenCalledWith(
        StorageKey.DMS_AVAILABILITY_ZONE,
        JSON.stringify(expectedRecord)
      );
    });
  });

  describe('initializeAvailabilityZone', () => {
    it('should initialize from localStorage data', () => {
      const storageData = [
        { uid: 'stored-zone-1', name: 'Stored Zone 1' },
        { uid: 'stored-zone-2', name: 'Stored Zone 2' }
      ];

      (LocalStorageWrapper.get as jest.Mock).mockReturnValue(
        JSON.stringify(storageData)
      );

      const { result } = renderHook(() => useRecentlySelectedZone());

      act(() => {
        result.current.initializeAvailabilityZone();
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateRecentlySelectedZoneRecord({
          recentlySelectedZoneRecord: storageData
        })
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateMemorizedAvailabilityZone({
          memorizedAvailabilityZone: storageData[0]
        })
      );
    });

    it('should handle empty localStorage data', () => {
      (LocalStorageWrapper.get as jest.Mock).mockReturnValue('[]');

      const { result } = renderHook(() => useRecentlySelectedZone());

      act(() => {
        result.current.initializeAvailabilityZone();
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateRecentlySelectedZoneRecord({
          recentlySelectedZoneRecord: []
        })
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateMemorizedAvailabilityZone({
          memorizedAvailabilityZone: undefined
        })
      );
    });

    it('should handle invalid localStorage data', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (LocalStorageWrapper.get as jest.Mock).mockReturnValue('invalid-json');

      const { result } = renderHook(() => useRecentlySelectedZone());

      act(() => {
        result.current.initializeAvailabilityZone();
      });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
