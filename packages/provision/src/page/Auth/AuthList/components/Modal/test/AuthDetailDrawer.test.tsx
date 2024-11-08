import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';

import AuthDetailDrawer from '../AuthDetailDrawer';

import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import { ModalName } from '~/data/enum';
import auth from '../../../../../../testUtil/mockApi/auth';
import { authorizationList } from '~/testUtil/mockApi/auth/data';
import { getBySelector } from '~/testUtil/customQuery';

describe('page/Auth/AuthList/AuthDetailDrawer', () => {
  const selectData = authorizationList[0];

  const customRender = (defaultVisible = true) => {
    return superRender(<AuthDetailDrawer />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(AuthListModalStatus, {
            [ModalName.GetConnection]: defaultVisible
          });
          set(AuthListSelectData, selectData);
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
    it('render snap when no selectData', async () => {
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(1300));
      expect(baseElement).toMatchSnapshot();

      await act(async () => jest.advanceTimersByTime(2300));
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when has selectData', async () => {
      const requestGetConnection = auth.getAuthorization();
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(1300));
      expect(baseElement).toMatchSnapshot();

      await act(async () => jest.advanceTimersByTime(2300));
      expect(baseElement).toMatchSnapshot();
      expect(requestGetConnection).toHaveBeenCalled();
      expect(requestGetConnection).toHaveBeenCalledWith({
        authorization_uid: selectData.uid
      });
    });
  });

  describe('render close detail', () => {
    it('render close icon btn', async () => {
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(3300));

      const closeIcon = getBySelector('.anticon-close', baseElement);
      fireEvent.click(closeIcon);
      await act(async () => jest.advanceTimersByTime(1000));
      expect(baseElement).toMatchSnapshot();
    });

    it('render close text btn', async () => {
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(3300));
      fireEvent.click(screen.getByText('关 闭'));
      await act(() => jest.advanceTimersByTime(100));
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render copy btn', () => {
    it('render click copy password', async () => {
      jest.spyOn(window, 'prompt').mockImplementation(() => 'copy link pwd');
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(3300));

      const copyBtn = getBySelector('.anticon-copy', baseElement);
      fireEvent.click(copyBtn);
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
    });

    it('render click copy connection_cmd', async () => {
      const execCommandFn = jest.fn();
      document.execCommand = execCommandFn;
      customRender();
      await act(async () => jest.advanceTimersByTime(3300));
      fireEvent.click(screen.getByText('复制连接串'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(execCommandFn).toHaveBeenCalled();
      expect(screen.queryByText('复制成功')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(500));
      execCommandFn.mockRestore();
    });

    it('render click copy all', async () => {
      customRender();
      await act(async () => jest.advanceTimersByTime(3300));
      fireEvent.click(screen.getByText('全文复制'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.queryByText('复制成功')).toBeInTheDocument();
    });
  });
});
