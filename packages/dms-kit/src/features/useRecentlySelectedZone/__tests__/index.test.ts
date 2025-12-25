import { act } from '@testing-library/react';
import { superRenderHook } from '../../../testUtil/superRender';
import useRecentlySelectedZone, {
  DEFAULT_MAX_SELECTED_ZONE_NUMBER
} from '../index';
import { StorageKey } from '../../../enum';
import LocalStorageWrapper from '../../../utils/LocalStorageWrapper';
import { eventEmitter } from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

type Zone = { uid: string; name: string };
const storage = LocalStorageWrapper;

describe('useRecentlySelectedZone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem(StorageKey.DMS_AVAILABILITY_ZONE, JSON.stringify([]));
  });

  it('should initialize from storage', () => {
    const initial: Zone[] = [
      { uid: 'u1', name: 'zone-1' },
      { uid: 'u2', name: 'zone-2' }
    ];
    localStorage.setItem(
      StorageKey.DMS_AVAILABILITY_ZONE,
      JSON.stringify(initial)
    );

    const { result } = superRenderHook(() => useRecentlySelectedZone<Zone>());
    expect(result.current.availabilityZone).toEqual(initial[0]);
  });

  it('should update record: move to front, unique, trim to max, and emit', () => {
    const eventEmitterSpy = jest.spyOn(eventEmitter, 'emit');
    const { result } = superRenderHook(() => useRecentlySelectedZone<Zone>());
    const z1 = { uid: 'u1', name: 'zone-1' };
    const z2 = { uid: 'u2', name: 'zone-2' };
    const z3 = { uid: 'u3', name: 'zone-3' };
    const z4 = { uid: 'u4', name: 'zone-4' };

    act(() => result.current.updateRecentlySelectedZone(z1));
    act(() => result.current.updateRecentlySelectedZone(z2));
    act(() => result.current.updateRecentlySelectedZone(z3));
    act(() => result.current.updateRecentlySelectedZone(z1));

    act(() => result.current.updateRecentlySelectedZone(z4));

    const saved: Zone[] = JSON.parse(
      storage.get(StorageKey.DMS_AVAILABILITY_ZONE) || '[]'
    );
    expect(saved[0]).toEqual(z4);
    expect(saved).toHaveLength(DEFAULT_MAX_SELECTED_ZONE_NUMBER);
    expect(saved.map((i: Zone) => i.uid)).toEqual(['u4', 'u1', 'u3']);
    expect(eventEmitterSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_SYNC_CURRENT_AVAILABILITY_ZONE,
      z4
    );

    eventEmitterSpy.mockRestore();
  });

  it('should verify: remove current when not in tips', () => {
    const initial: Zone[] = [
      { uid: 'u1', name: 'zone-1' },
      { uid: 'u2', name: 'zone-2' }
    ];
    localStorage.setItem(
      StorageKey.DMS_AVAILABILITY_ZONE,
      JSON.stringify(initial)
    );

    const { result } = superRenderHook(() => useRecentlySelectedZone<Zone>());
    expect(result.current.availabilityZone?.uid).toBe('u1');

    act(() =>
      result.current.verifyRecentlySelectedZoneRecord([
        { uid: 'u2', name: 'zone-2' }
      ])
    );
    expect(result.current.availabilityZone).toBeUndefined();
    const saved: Zone[] = JSON.parse(
      storage.get(StorageKey.DMS_AVAILABILITY_ZONE) || '[]'
    );
    expect(saved.map((i: Zone) => i.uid)).toEqual(['u2']);
  });

  it('should verify: update name when uid exists but name changed', () => {
    const initial: Zone[] = [
      { uid: 'u1', name: 'old' },
      { uid: 'u2', name: 'z2' }
    ];
    localStorage.setItem(
      StorageKey.DMS_AVAILABILITY_ZONE,
      JSON.stringify(initial)
    );
    const { result } = superRenderHook(() => useRecentlySelectedZone<Zone>());
    expect(result.current.availabilityZone?.name).toBe('old');

    act(() =>
      result.current.verifyRecentlySelectedZoneRecord([
        { uid: 'u1', name: 'new' },
        { uid: 'u2', name: 'z2' }
      ])
    );

    const saved: Zone[] = JSON.parse(
      storage.get(StorageKey.DMS_AVAILABILITY_ZONE) || '[]'
    );
    expect(saved.find((i: Zone) => i.uid === 'u1')?.name).toBe('new');
  });

  it('should clearRecentlySelectedZone: reset state and storage', () => {
    const initial: Zone[] = [{ uid: 'u1', name: 'zone-1' }];
    localStorage.setItem(
      StorageKey.DMS_AVAILABILITY_ZONE,
      JSON.stringify(initial)
    );
    const { result } = superRenderHook(() => useRecentlySelectedZone<Zone>());
    expect(result.current.availabilityZone).toBeDefined();

    act(() => result.current.clearRecentlySelectedZone());
    expect(result.current.availabilityZone).toBeUndefined();
    const saved = JSON.parse(
      storage.get(StorageKey.DMS_AVAILABILITY_ZONE) || '[]'
    );
    expect(saved).toEqual([]);
  });

  it('should set availability zone when DMS_SYNC_CURRENT_AVAILABILITY_ZONE event is emitted', async () => {
    const zone = { uid: 'u1', name: 'zone-1' };
    const { result } = superRenderHook(() => useRecentlySelectedZone<Zone>());
    expect(result.current.availabilityZone).toBeUndefined();
    act(() =>
      eventEmitter.emit(EmitterKey.DMS_SYNC_CURRENT_AVAILABILITY_ZONE, zone)
    );
    expect(result.current.availabilityZone).toEqual(zone);
  });
});
