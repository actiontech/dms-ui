import { RecoilState, RecoilValue, useRecoilCallback } from 'recoil';

interface ISyncRecoilStore {
  get?: <T>(atom: RecoilValue<T>) => T;
  set?: <T>(
    atom: RecoilState<T>,
    valOrUpdater: T | ((currVal: T) => T)
  ) => void;
  reset?: (atom: RecoilState<any>) => void;
}

const SyncRecoilStore: ISyncRecoilStore = {};

/**
 * you must add this component in your app before you call any method which export from this file.
 */
const SyncRecoil = () => {
  SyncRecoilStore.get = useRecoilCallback<[atom: RecoilValue<any>], any>(
    ({ snapshot }) => {
      return function <T>(atom: RecoilValue<T>) {
        return snapshot.getLoadable(atom).contents;
      };
    },
    []
  );

  useRecoilCallback(({ set }) => {
    SyncRecoilStore.set = set;

    return async () => {
      return undefined;
    };
  })();

  SyncRecoilStore.reset = useRecoilCallback(({ reset }) => reset, []);

  return null;
};

export default SyncRecoil;

export function getRecoil<T>(atom: RecoilValue<T>): T {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return SyncRecoilStore.get!(atom);
}

export function setRecoil<T>(
  atom: RecoilState<T>,
  valOrUpdater: T | ((curVal: T) => T)
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  SyncRecoilStore.set!(atom, valOrUpdater);
}
