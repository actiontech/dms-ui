import { StorageKey } from '@actiontech/shared/lib/enum';
import { GlobalToken } from '.';
import { ResetRecoilState, snapshot_UNSTABLE } from 'recoil';
import { LocalStorageWrapper } from '@actiontech/shared';

jest.mock('~/utils/LocalStorageWrapper', () => {
  return {
    getOrDefault: jest.fn().mockReturnValue('token1'),
    set: jest.fn()
  };
});

describe('store/global', () => {
  it('globalToken should read default value from localStorage', async () => {
    const snapshot = snapshot_UNSTABLE();
    expect(snapshot.getLoadable(GlobalToken).valueOrThrow()).toBe('token1');
  });

  it('should set token into localStorage into localStorage', async () => {
    const snapshot = snapshot_UNSTABLE(({ set }) =>
      set(GlobalToken, 'newToken')
    );
    expect(snapshot.getLoadable(GlobalToken).valueOrThrow()).toBe('newToken');
    expect(LocalStorageWrapper.set).toBeCalledTimes(1);
    expect(LocalStorageWrapper.set).toBeCalledWith(
      StorageKey.Token,
      'newToken'
    );
  });

  it('globalToken should ignore reset operator', async () => {
    let _reset!: ResetRecoilState;
    const snapshot = snapshot_UNSTABLE(({ reset, set }) => {
      _reset = reset;
      set(GlobalToken, 'temp');
    });
    expect(snapshot.getLoadable(GlobalToken).valueOrThrow()).toBe('temp');
    _reset(GlobalToken);
    expect(snapshot.getLoadable(GlobalToken).valueOrThrow()).toBe('temp');
  });
});
