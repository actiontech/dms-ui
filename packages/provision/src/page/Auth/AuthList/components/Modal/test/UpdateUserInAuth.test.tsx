import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';

import { IListAuthorization } from '@actiontech/shared/lib/api/provision/service/common';
import { authorizationList, userList } from '~/testUtil/mockApi/auth/data';
import UpdateUserInAuth from '../UpdateUser';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import { EventEmitterKey, ModalName } from '~/data/enum';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import auth from '../../../../../../testUtil/mockApi/auth';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { getBySelector } from '~/testUtil/customQuery';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import eventEmitter from '~/utils/EventEmitter';

jest.mock('~/utils/Password', () => {
  return {
    generateMySQLPassword: jest.fn().mockReturnValue('ly$B27aB0L00f2qc')
  };
});

describe('page/Auth/AuthList/UpdateUserInAuth', () => {
  const selectData = authorizationList[1];
  const projectID = mockProjectInfo.projectID;
  const userNameData = userList[0];

  const customRender = (
    defaultVisible = true,
    selectDefaultData?: IListAuthorization
  ) => {
    return superRender(<UpdateUserInAuth />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(AuthListModalStatus, {
            [ModalName.UpdateUserInAuth]: defaultVisible
          });
          set(
            AuthListSelectData,
            selectDefaultData ?? {
              ...selectData,
              permission_user: 'Kari Bode'
            }
          );
        }
      }
    });
  };

  beforeEach(() => {
    mockUseCurrentProject();
    jest.useFakeTimers();
    auth.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  describe('render init snap', () => {
    it('render snap when visible is false', async () => {
      const { baseElement } = customRender(false, {});
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when no select data', async () => {
      const { baseElement } = customRender(true, {});
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when has select data', async () => {
      const { baseElement } = customRender(true, {});
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render when closed modal', () => {
    it('render click icon closed', async () => {
      const requestUser = auth.listUsers();
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestUser).toBeCalled();
      expect(requestUser).toBeCalledWith({
        namespace_uid: projectID,
        page_index: 1,
        page_size: 999
      });

      expect(screen.getByText('更换使用人')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();

      const closedIcon = getBySelector('.closed-icon-custom', baseElement);
      fireEvent.click(closedIcon);
      await act(() => jest.advanceTimersByTime(300));
    });

    it('render click closed text', async () => {
      const execCommandFn = jest.fn();
      document.execCommand = execCommandFn;
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(3300));

      const selectInputEl = getBySelector(
        '.ant-select-selection-search-input',
        baseElement
      );
      await act(async () => {
        fireEvent.mouseDown(selectInputEl);
        await act(() => jest.advanceTimersByTime(300));
      });

      await act(async () => {
        fireEvent.click(
          getBySelector('#permission_user_uid_list_0', baseElement)
        );
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => {
        fireEvent.click(getBySelector('.anticon-info-circle', baseElement));
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => {
        fireEvent.click(screen.getByText('生 成'));
        await act(() => jest.advanceTimersByTime(300));
      });
      expect(execCommandFn).toBeCalled();
      expect(baseElement).toMatchSnapshot();
      fireEvent.click(screen.getByText('关 闭'));
      await act(() => jest.advanceTimersByTime(300));
    });
  });

  describe('render submit data', () => {
    it('render click submit api error', async () => {
      const requestFn = auth.updateAuthorization();
      requestFn.mockImplementation(() =>
        createSpyFailResponse({ msg: 'error' })
      );
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(6300));

      const selectInputEl = getBySelector(
        '.ant-select-selection-search-input',
        baseElement
      );
      await act(async () => {
        fireEvent.mouseDown(selectInputEl);
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => {
        fireEvent.click(
          getBySelector('#permission_user_uid_list_0', baseElement)
        );
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => {
        fireEvent.click(getBySelector('.anticon-info-circle', baseElement));
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => jest.advanceTimersByTime(300));
      const pwdEle = getBySelector('#db_account_password', baseElement);
      await act(async () => {
        fireEvent.change(pwdEle, {
          target: {
            value: '123'
          }
        });
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => {
        fireEvent.change(
          getBySelector('#confirm_db_account_password', baseElement),
          {
            target: {
              value: '123'
            }
          }
        );
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => {
        fireEvent.click(screen.getByText('提 交'));
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestFn).toBeCalled();
      expect(requestFn).toBeCalledWith({
        authorization_uid: selectData.uid,
        authorization: {
          update_authorization_user: {
            permission_user_uid: '67483',
            db_account_password: '123'
          }
        }
      });
      fireEvent.click(screen.getByText('关 闭'));
      await act(() => jest.advanceTimersByTime(300));
    });

    it('render click submit api success', async () => {
      const emitSpy = jest.spyOn(eventEmitter, 'emit');
      const requestFn = auth.updateAuthorization();
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(3300));

      await act(async () => {
        fireEvent.click(screen.getByText('提 交'));
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestFn).toBeCalled();
      expect(requestFn).toBeCalledWith({
        authorization_uid: selectData.uid,
        authorization: {
          update_authorization_user: {
            permission_user_uid: '67483'
          }
        }
      });
      expect(screen.getByText('更新成功')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
      expect(emitSpy).toBeCalledTimes(1);
      expect(emitSpy).toBeCalledWith(EventEmitterKey.Refresh_Auth_List_Table);
      emitSpy.mockClear();
    });
  });
});
