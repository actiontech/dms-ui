import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import {
  act,
  cleanup,
  fireEvent,
  getByText,
  screen
} from '@testing-library/react';

import { authorizationList } from '~/testUtil/mockApi/auth/data';
import UpdateExpiration from '../UpdateExpiration';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import { EventEmitterKey, ModalName } from '~/data/enum';
import auth from '../../../../../../testUtil/mockApi/auth';
import { IListAuthorization } from '@actiontech/shared/lib/api/provision/service/common';
import { getAllBySelector, getBySelector } from '~/testUtil/customQuery';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import eventEmitter from '~/utils/EventEmitter';

describe('page/Auth/AuthList/UpdateExpiration', () => {
  const selectData = authorizationList[1];

  const customRender = (
    defaultVisible = true,
    selectDefaultData?: IListAuthorization
  ) => {
    return superRender(<UpdateExpiration />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(AuthListModalStatus, {
            [ModalName.UpdateExpirationInAuth]: defaultVisible
          });
          set(AuthListSelectData, selectDefaultData ?? selectData);
        }
      }
    });
  };

  beforeEach(() => {
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
      const { baseElement } = customRender();
      expect(screen.getByText('授权续期')).toBeInTheDocument();
      const formItem = getAllBySelector('.ant-form-item-row', baseElement);
      expect(formItem.length).toBe(1);
      expect(screen.getByText('续期')).toBeInTheDocument();
      expect(
        screen.getByText('说明：续期指在当前时间基础上增加有效期时间')
      ).toBeInTheDocument();

      const closedIcon = getBySelector('.custom-icon-close', baseElement);
      fireEvent.click(closedIcon);
      await act(() => jest.advanceTimersByTime(300));
    });

    it('render click closed text', async () => {
      customRender();

      fireEvent.click(screen.getByText('关 闭'));
      await act(() => jest.advanceTimersByTime(300));
    });
  });

  describe('render submit data', () => {
    it('render click submit api error', async () => {
      const requestFn = auth.updateAuthorization();
      requestFn.mockImplementation(() => createSpyFailResponse({}));
      const { baseElement } = customRender();

      const selectInputEl = getBySelector(
        '.ant-select-selection-search-input',
        baseElement
      );
      await act(async () => {
        fireEvent.mouseDown(selectInputEl);
        await act(() => jest.advanceTimersByTime(300));
      });
      expect(screen.getByText('永久')).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByText('一个星期'));
        await act(() => jest.advanceTimersByTime(300));
      });

      await act(async () => {
        fireEvent.click(screen.getByText('提 交'));
        await act(() => jest.advanceTimersByTime(300));
      });
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestFn).toBeCalled();
      expect(requestFn).toBeCalledWith({
        authorization: { renewal_effective_time_day: 7 },
        authorization_uid: selectData.uid
      });
      expect(baseElement).toMatchSnapshot();

      fireEvent.click(screen.getByText('关 闭'));
      await act(() => jest.advanceTimersByTime(300));
    });

    it('render click submit api success', async () => {
      const emitSpy = jest.spyOn(eventEmitter, 'emit');
      const requestFn = auth.updateAuthorization();
      const { baseElement } = customRender();

      const selectInputEl = getBySelector(
        '.ant-select-selection-search-input',
        baseElement
      );
      await act(async () => {
        fireEvent.mouseDown(selectInputEl);
        await act(() => jest.advanceTimersByTime(300));
      });
      expect(screen.getByText('永久')).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByText('永久'));
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => {
        fireEvent.click(screen.getByText('提 交'));
        await act(() => jest.advanceTimersByTime(300));
      });
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestFn).toBeCalled();
      expect(requestFn).toBeCalledWith({
        authorization: { renewal_effective_time_day: -1 },
        authorization_uid: selectData.uid
      });
      expect(screen.getByText('更新成功')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
      expect(emitSpy).toBeCalledTimes(1);
      expect(emitSpy).toBeCalledWith(EventEmitterKey.Refresh_Auth_List_Table);
      emitSpy.mockClear();
    });
  });
});
