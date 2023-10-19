import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { EventEmitterKey, ModalName } from '~/data/enum';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import { sleep } from '~/testUtil/customQuery';
import { superRender } from '~/testUtil/customRender';
import auth from '~/testUtil/mockApi/auth';
import { authorizationList } from '~/testUtil/mockApi/auth/data';
import EventEmitter from '~/utils/EventEmitter';
import { setRecoil } from '~/utils/SyncRecoil';
import UpdateExpirationInAuth from '.';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';

describe('UpdateExpirationInAuth', () => {
  const customRender = (defaultVisible = true) => {
    return superRender(
      <UpdateExpirationInAuth />,
      {},
      {
        recoilRootProps: {
          initializeState({ set }) {
            set(AuthListModalStatus, {
              [ModalName.UpdateExpirationInAuth]: defaultVisible
            });
            set(AuthListSelectData, authorizationList[0]);
          }
        }
      }
    );
  };
  let updateAuthorizationSpy: jest.SpyInstance;

  beforeEach(() => {
    updateAuthorizationSpy = auth.updateAuthorization();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  it('should match close modal when modal status is false', async () => {
    const { container } = customRender(false);
    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('should match open modal when modal status is true', async () => {
    const { baseElement } = customRender();
    await screen.findByText('续期');
    expect(baseElement).toMatchSnapshot();
  });

  it('should reset all fields when user close modal', async () => {
    const { baseElement } = customRender();
    await screen.findByText('续期');

    selectOptionByIndex('续期', '永久', 0);
    expect(baseElement).toMatchSnapshot();
    await act(() => fireEvent.click(screen.getByText('关 闭')));

    expect(baseElement).toMatchSnapshot();
  });

  it('should update auth when user input all fields and click submit button', async () => {
    const emitSpy = jest.spyOn(EventEmitter, 'emit');

    customRender();
    await screen.findByText('续期');
    selectOptionByIndex('续期', '永久', 0);

    await act(() => fireEvent.click(screen.getByText('提 交')));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateAuthorizationSpy).toBeCalledTimes(1);
    expect(updateAuthorizationSpy).toBeCalledWith({
      authorization_uid: authorizationList[0].uid,
      authorization: {
        renewal_effective_time_day: -1
      }
    });
    expect(screen.getByText('关 闭').parentElement).toBeDisabled();
    expect(screen.getByText('提 交').parentElement).toHaveClass(
      'ant-btn-loading'
    );
    await screen.findByText(`更新成功`);

    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EventEmitterKey.Refresh_Auth_List_Table);

    // modal visible 变为false之后，不会再响应update，所以必须重新打开modal之后下面这两个btn才会变成可用状态
    act(() => {
      setRecoil(AuthListModalStatus, {
        [ModalName.UpdateExpirationInAuth]: true
      });
    });

    expect(screen.getByText('关 闭').parentElement).not.toBeDisabled();
    expect(screen.getByText('提 交').parentElement).not.toHaveClass(
      'ant-btn-loading'
    );

    await sleep(3000);
    expect(screen.queryByText(`更新成功！`)).not.toBeInTheDocument();
  });
});
