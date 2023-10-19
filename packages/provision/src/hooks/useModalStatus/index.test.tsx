import { act } from '@testing-library/react';
import { ModalName } from '~/data/enum';
import { UserModalStatus } from '~/store/user';
import { superRenderHooks } from '~/testUtil/customRender';
import RecoilObservable from '~/testUtil/RecoilObservable';
import { ModalStatus } from '~/types/common.type';
import useModalStatus from '.';

describe('useModalStatus', () => {
  const customRender = (initModalStatus?: ModalStatus, name?: ModalName) => {
    const userModalStatusChange = jest.fn();
    const renderReturn = superRenderHooks(
      () => useModalStatus(UserModalStatus, name),
      {
        otherChildren: (
          <RecoilObservable
            state={UserModalStatus}
            onChange={userModalStatusChange}
          />
        ),
        recoilRootProps: {
          initializeState({ set }) {
            if (initModalStatus) {
              set(UserModalStatus, initModalStatus);
            }
          }
        }
      }
    );
    return {
      ...renderReturn,
      userModalStatusChange
    };
  };

  it('should init modal status by initModal method', async () => {
    const { result, userModalStatusChange } = customRender();
    act(() => {
      result.current.initModalStatus({
        a: true,
        b: false
      });
    });

    expect(userModalStatusChange).toBeCalledTimes(1);
    expect(userModalStatusChange).toBeCalledWith({
      a: true,
      b: false
    });
    expect(result.current.visible).toBeFalsy();
  });

  it('should update modal status by toggleModal method', async () => {
    const { result, userModalStatusChange } = customRender({
      [ModalName.AddUser]: false
    });

    act(() => {
      result.current.toggleModal(ModalName.AddUser, true);
    });

    expect(userModalStatusChange).toBeCalledTimes(1);
    expect(userModalStatusChange).toBeCalledWith({
      ADD_USER: true
    });
  });

  it('should get visible by getModalStatus method', async () => {
    const { result } = customRender({
      [ModalName.AddUser]: false
    });

    const visible = result.current.getModalStatus(ModalName.AddUser);

    expect(visible).toBe(false);
  });

  it('should match visible by modal status', async () => {
    const { result } = customRender(
      {
        [ModalName.AddUser]: true
      },
      ModalName.AddUser
    );

    expect(result.current.visible).toBe(true);
  });
});
