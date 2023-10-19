import { act, screen, cleanup, fireEvent } from '@testing-library/react';
import { EventEmitterKey, ModalName } from '~/data/enum';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import { superRender } from '~/testUtil/customRender';
import auth from '~/testUtil/mockApi/auth';
import { authorizationList, templateList } from '~/testUtil/mockApi/auth/data';
import EventEmitter from '~/utils/EventEmitter';
import { setRecoil } from '~/utils/SyncRecoil';
import UpdateTemplate from '.';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('UpdateTemplate', () => {
  const customRender = (defaultVisible = true) => {
    return superRender(
      <UpdateTemplate />,
      {},
      {
        recoilRootProps: {
          initializeState({ set }) {
            set(AuthListModalStatus, {
              [ModalName.UpdateTemplateInAuth]: defaultVisible
            });
            set(AuthListSelectData, authorizationList[0]);
          }
        }
      }
    );
  };
  let updateAuthorizationSpy: jest.SpyInstance;
  let listDataPermissionTemplateSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    updateAuthorizationSpy = auth.updateAuthorization();
    listDataPermissionTemplateSpy = auth.listDataPermissionTemplate();
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
    await screen.findByText('权限模版');

    expect(baseElement).toMatchSnapshot();
  });

  it('should reset all fields when user close modal', async () => {
    const { baseElement } = customRender();
    await screen.findByText('权限模版');
    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('权限模版', 'template-1', 0);

    expect(baseElement).toMatchSnapshot();
    await act(() => fireEvent.click(screen.getByText('关 闭')));

    expect(baseElement).toMatchSnapshot();
  });

  it('should update auth when user input all fields and click submit button', async () => {
    const emitSpy = jest.spyOn(EventEmitter, 'emit');

    customRender();
    await screen.findByText('权限模版');
    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('权限模版', 'template-1', 0);

    await act(() => fireEvent.click(screen.getByText('提 交')));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateAuthorizationSpy).toBeCalledWith({
      authorization_uid: authorizationList[0].uid,
      authorization: {
        data_permission_template_uid: templateList[0].uid
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
        [ModalName.UpdateTemplateInAuth]: true
      });
    });

    expect(screen.getByText('关 闭').parentElement).not.toBeDisabled();
    expect(screen.getByText('提 交').parentElement).not.toHaveClass(
      'ant-btn-loading'
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText(`更新成功！`)).not.toBeInTheDocument();
  });
});
