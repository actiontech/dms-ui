import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';

import { authorizationList } from '~/testUtil/mockApi/auth/data';
import UpdateTemplate from '../UpdateTemplate';
import { IListAuthorization } from '@actiontech/shared/lib/api/provision/service/common';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import { EventEmitterKey, ModalName } from '~/data/enum';
import auth from '../../../../../../testUtil/mockApi/auth';
import { getAllBySelector, getBySelector } from '~/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import eventEmitter from '~/utils/EventEmitter';

describe('page/Auth/AuthList/UpdateTemplate', () => {
  const selectData = authorizationList[1];
  const projectID = mockProjectInfo.projectID;

  const customRender = (
    defaultVisible = true,
    selectDefaultData?: IListAuthorization
  ) => {
    return superRender(<UpdateTemplate />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(AuthListModalStatus, {
            [ModalName.UpdateTemplateInAuth]: defaultVisible
          });
          set(AuthListSelectData, selectDefaultData ?? selectData);
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
      const requestTempFn = auth.listDataPermissionTemplate();
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestTempFn).toHaveBeenCalled();
      expect(requestTempFn).toHaveBeenCalledWith({
        filter_by_namespace_uid: projectID,
        page_index: 1,
        page_size: 999
      });

      expect(screen.getByText('更换权限模板')).toBeInTheDocument();
      const formItem = getAllBySelector('.ant-form-item-row', baseElement);
      expect(formItem.length).toBe(1);
      expect(baseElement).toMatchSnapshot();

      const closedIcon = getBySelector('.custom-icon-close', baseElement);
      fireEvent.click(closedIcon);
      await act(() => jest.advanceTimersByTime(300));
    });

    it('render click closed text', async () => {
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
      expect(screen.getByText('template-3')).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByText('template-3'));
        await act(() => jest.advanceTimersByTime(300));
      });
      fireEvent.click(screen.getByText('关 闭'));
      await act(() => jest.advanceTimersByTime(300));
    });
  });

  describe('render submit data', () => {
    it('render click submit api error', async () => {
      const requestFn = auth.updateAuthorization();
      requestFn.mockImplementation(() => createSpyFailResponse({}));
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
      expect(screen.getByText('template-3')).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByText('template-3'));
        await act(() => jest.advanceTimersByTime(300));
      });

      await act(async () => {
        fireEvent.click(screen.getByText('提 交'));
        await act(() => jest.advanceTimersByTime(300));
      });
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestFn).toHaveBeenCalled();
      expect(requestFn).toHaveBeenCalledWith({
        authorization: {
          data_permission_template_uid: '46'
        },
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
      await act(async () => jest.advanceTimersByTime(3300));

      const selectInputEl = getBySelector(
        '.ant-select-selection-search-input',
        baseElement
      );
      await act(async () => {
        fireEvent.mouseDown(selectInputEl);
        await act(() => jest.advanceTimersByTime(300));
      });
      expect(screen.getByText('template-3')).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByText('template-3'));
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => {
        fireEvent.click(screen.getByText('提 交'));
        await act(() => jest.advanceTimersByTime(300));
      });
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestFn).toHaveBeenCalled();

      expect(screen.getByText('更新成功')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(
        EventEmitterKey.Refresh_Auth_List_Table
      );
      emitSpy.mockClear();
    });
  });
});
