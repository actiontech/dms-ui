import { act } from '@testing-library/react';
import { ModalName } from '~/data/enum';
import { AuthListModalStatus } from '~/store/auth/list';
import { superRenderHooks } from '~/testUtil/customRender';
import RecoilObservable from '~/testUtil/RecoilObservable';
import useModalStatus from '.';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';

describe('useModalStatus', () => {
  const customRender = (initModalStatus?: ModalStatus, name?: ModalName) => {
    const authListModalStatusChange = jest.fn();
    const renderReturn = superRenderHooks(
      () => useModalStatus(AuthListModalStatus, name),
      {
        otherChildren: (
          <RecoilObservable
            state={AuthListModalStatus}
            onChange={authListModalStatusChange}
          />
        ),
        recoilRootProps: {
          initializeState({ set }) {
            if (initModalStatus) {
              set(AuthListModalStatus, initModalStatus);
            }
          }
        }
      }
    );
    return {
      ...renderReturn,
      authListModalStatusChange
    };
  };

  it('should init modal status by initModal method', async () => {
    const { result, authListModalStatusChange } = customRender();
    act(() => {
      result.current.initModalStatus({
        a: true,
        b: false
      });
    });

    expect(authListModalStatusChange).toBeCalledTimes(1);
    expect(authListModalStatusChange).toBeCalledWith({
      a: true,
      b: false
    });
    expect(result.current.visible).toBeFalsy();
  });

  it('should update modal status by toggleModal method', async () => {
    const { result, authListModalStatusChange } = customRender({
      [ModalName.UpdateUserInAuth]: false
    });

    act(() => {
      result.current.toggleModal(ModalName.UpdateUserInAuth, true);
    });

    expect(authListModalStatusChange).toBeCalledTimes(1);
    expect(authListModalStatusChange).toBeCalledWith({
      UPDATE_USER_IN_AUTH: true
    });
  });

  it('should get visible by getModalStatus method', async () => {
    const { result } = customRender({
      [ModalName.UpdateUserInAuth]: false
    });

    const visible = result.current.getModalStatus(ModalName.UpdateUserInAuth);

    expect(visible).toBe(false);
  });

  it('should match visible by modal status', async () => {
    const { result } = customRender(
      {
        [ModalName.UpdateUserInAuth]: true
      },
      ModalName.UpdateUserInAuth
    );

    expect(result.current.visible).toBe(true);
  });
});
