import { act } from '@testing-library/react';
import { provisionSuperRenderHook } from '../../../testUtil/superRender';
import RecoilObservable from '../../../testUtil/RecoilObservable';
import useClearRecoilState from '../index';
import {
  DatabaseRoleFilteredDBServiceID,
  DatabaseRoleFilteredDBServiceName
} from '../../../store/databaseRole';

describe('useClearRecoilState', () => {
  const customRender = (
    initialDBServiceID?: string | null,
    initialDBServiceName?: string | null
  ) => {
    const dbServiceIDChange = jest.fn();
    const dbServiceNameChange = jest.fn();

    const renderReturn = provisionSuperRenderHook(
      () => useClearRecoilState(),
      undefined,
      {
        otherChildren: (
          <>
            <RecoilObservable
              state={DatabaseRoleFilteredDBServiceID}
              onChange={dbServiceIDChange}
            />
            <RecoilObservable
              state={DatabaseRoleFilteredDBServiceName}
              onChange={dbServiceNameChange}
            />
          </>
        ),
        recoilRootProps: {
          initializeState({ set }) {
            if (initialDBServiceID !== undefined) {
              set(DatabaseRoleFilteredDBServiceID, initialDBServiceID);
            }
            if (initialDBServiceName !== undefined) {
              set(DatabaseRoleFilteredDBServiceName, initialDBServiceName);
            }
          }
        }
      }
    );

    return {
      ...renderReturn,
      dbServiceIDChange,
      dbServiceNameChange
    };
  };

  it('should clear both database role filtered states when clearRecoilState is called', () => {
    const { result, dbServiceIDChange, dbServiceNameChange } = customRender(
      'test-service-id',
      'test-service-name'
    );

    act(() => {
      result.current.clearRecoilState();
    });

    expect(dbServiceIDChange).toHaveBeenCalledTimes(1);
    expect(dbServiceIDChange).toHaveBeenCalledWith(null);

    expect(dbServiceNameChange).toHaveBeenCalledTimes(1);
    expect(dbServiceNameChange).toHaveBeenCalledWith(null);
  });
});
