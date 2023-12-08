import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AuthListItem from '.';

import auth from '../../../../../testUtil/mockApi/auth';
import { authorizationList } from '~/testUtil/mockApi/auth/data';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { ListAuthorizationStatusEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { ModalName } from '~/data/enum';
import { AuthListModalStatus } from '~/store/auth/list';
import RecoilObservable from '~/testUtil/RecoilObservable';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { IDataObjectService } from '@actiontech/shared/lib/api/provision/service/common';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/Auth/AuthList/List', () => {
  const mockDispatch = jest.fn();
  const navigateSpy = jest.fn();
  const projectID = mockProjectInfo.projectID;

  const customRender = () => {
    return superRender(<AuthListItem />);
  };

  beforeEach(() => {
    mockUseCurrentProject();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    auth.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const requestListFn = auth.listAuthorizationReq();
    requestListFn.mockImplementationOnce(() =>
      createSpySuccessResponse({ total_nums: 0, data: [] })
    );
    const { baseElement } = customRender();

    expect(
      getBySelector('.ant-segmented-group', baseElement)
    ).toBeInTheDocument();
    expect(screen.getByText('全部')).toBeInTheDocument();
    expect(screen.getByText('过期')).toBeInTheDocument();
    expect(screen.getByText('即将过期')).toBeInTheDocument();
    expect(screen.getByText('生效中')).toBeInTheDocument();

    expect(
      getBySelector('.actiontech-filter-button-namespace', baseElement)
    ).toBeInTheDocument();
    expect(screen.getByText('筛选')).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();

    expect(
      getBySelector('.ant-table-wrapper', baseElement)
    ).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(1300));
    expect(
      getBySelector('.ant-spin-dot-spin', baseElement)
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(2000));
    expect(requestListFn).toBeCalledTimes(1);
    expect(requestListFn).toBeCalledWith({
      filter_by_namespace_uid: projectID,
      filter_by_status: undefined,
      page_index: 1,
      page_size: 20
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render table list when api return data', async () => {
    const requestListFn = auth.listAuthorizationReq();
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestListFn).toBeCalledTimes(1);
    expect(
      screen.getByText(`共 ${authorizationList.length} 条数据`)
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  describe('render table list when action filter', () => {
    it('render action click status', async () => {
      const requestListFn = auth.listAuthorizationReq();
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalledTimes(1);
      expect(
        screen.getByText(`共 ${authorizationList.length} 条数据`)
      ).toBeInTheDocument();
      const cateExpiredItem = getAllBySelector(
        '.ant-segmented-item .ant-segmented-item-label'
      )[1];
      const expiredVal = ListAuthorizationStatusEnum.expired;
      fireEvent.click(cateExpiredItem);
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalledTimes(2);
      expect(requestListFn).toHaveBeenNthCalledWith(2, {
        filter_by_namespace_uid: projectID,
        filter_by_status: expiredVal,
        page_index: 1,
        page_size: 20
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render action click refresh', async () => {
      const requestListFn = auth.listAuthorizationReq();
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalledTimes(1);

      const refreshBtn = getBySelector('.custom-icon-refresh', baseElement);
      fireEvent.click(refreshBtn);
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalled();
    });

    it('render action when filter item show', async () => {
      const requestListFn = auth.listAuthorizationReq();
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalledTimes(1);

      fireEvent.click(screen.getByText('筛选'));
      await act(async () => jest.advanceTimersByTime(300));
      const filterItems = getAllBySelector(
        '.actiontech-table-filter-container-namespace .ant-space-item',
        baseElement
      );
      expect(filterItems.length).toBe(3);
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render table row action', () => {
    it('render more action btn when expiration is diff val', async () => {
      const modalStatusChangeSpy = jest.fn();
      const requestListFn = auth.listAuthorizationReq();
      requestListFn.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [
            {
              ...authorizationList[1],
              expiration: 1232132434332312
            },
            {
              ...authorizationList[2],
              expiration: -1
            }
          ]
        })
      );
      const { baseElement } = superRender(
        <>
          <AuthListItem />
          <RecoilObservable
            state={AuthListModalStatus}
            onChange={modalStatusChangeSpy}
          />
        </>
      );
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalledTimes(1);
      const actionMoreBtn = getAllBySelector(
        '.ant-table-row.ant-table-row-level-0 .actiontech-table-actions-more-button',
        baseElement
      )[0];
      fireEvent.click(actionMoreBtn);
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('续期')).toBeInTheDocument();
      fireEvent.click(screen.getByText('续期'));
      await act(async () => jest.advanceTimersByTime(1000));
      expect(modalStatusChangeSpy).toBeCalledTimes(2);
      expect(modalStatusChangeSpy).nthCalledWith(2, {
        [ModalName.UpdateExpirationInAuth]: true,
        [ModalName.GetConnection]: false,
        [ModalName.UpdateTemplateInAuth]: false,
        [ModalName.UpdateUserInAuth]: false
      });
    });

    it('render click getConnection btn', async () => {
      const modalStatusChangeSpy = jest.fn();
      const requestListFn = auth.listAuthorizationReq();
      requestListFn.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [
            {
              ...authorizationList[1]
            }
          ]
        })
      );
      superRender(
        <>
          <AuthListItem />
          <RecoilObservable
            state={AuthListModalStatus}
            onChange={modalStatusChangeSpy}
          />
        </>
      );
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalledTimes(1);

      fireEvent.click(screen.getByText('授权信息'));
      await act(async () => jest.advanceTimersByTime(1000));
      expect(modalStatusChangeSpy).toBeCalledTimes(2);
      expect(modalStatusChangeSpy).nthCalledWith(2, {
        [ModalName.GetConnection]: true,
        [ModalName.UpdateExpirationInAuth]: false,
        [ModalName.UpdateTemplateInAuth]: false,
        [ModalName.UpdateUserInAuth]: false
      });
    });

    it('render click recovery btn', async () => {
      const requestRemoveFn = auth.removeAuthorization();
      const requestListFn = auth.listAuthorizationReq();
      requestListFn.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [
            {
              ...authorizationList[1]
            }
          ]
        })
      );

      customRender();
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalledTimes(1);

      fireEvent.click(screen.getByText('回收权限'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(
        screen.getByText(
          `确定要回收目的为'${authorizationList[1].purpose}'的权限?`
        )
      );
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestRemoveFn).toBeCalledTimes(1);
      expect(requestRemoveFn).toBeCalledWith({
        authorization_uid: authorizationList[1].uid
      });
      expect(screen.getByText('权限回收成功')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3600));
      expect(requestListFn).toBeCalled();
    });

    it('render click user text', async () => {
      const modalStatusChangeSpy = jest.fn();
      const requestListFn = auth.listAuthorizationReq();
      requestListFn.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [
            {
              ...authorizationList[1],
              permission_user: 'permission_user_xin'
            }
          ]
        })
      );
      const { baseElement } = superRender(
        <>
          <AuthListItem />
          <RecoilObservable
            state={AuthListModalStatus}
            onChange={modalStatusChangeSpy}
          />
        </>
      );
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalledTimes(1);

      expect(screen.getByText('permission_user_xin')).toBeInTheDocument();
      fireEvent.click(screen.getByText('permission_user_xin'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(navigateSpy).toBeCalled();
      expect(navigateSpy).toBeCalledWith('/userCenter');

      fireEvent.mouseOver(screen.getByText('permission_user_xin'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
      fireEvent.click(
        getAllBySelector(
          '.ant-table-row-level-0 .auth-action-column-editor .anticon-edit',
          baseElement
        )[0]
      );
      await act(async () => jest.advanceTimersByTime(1000));
      expect(modalStatusChangeSpy).toBeCalledTimes(2);
      expect(modalStatusChangeSpy).nthCalledWith(2, {
        [ModalName.UpdateUserInAuth]: true,
        [ModalName.UpdateExpirationInAuth]: false,
        [ModalName.GetConnection]: false,
        [ModalName.UpdateTemplateInAuth]: false
      });
    });

    it('render click auth template text', async () => {
      const modalStatusChangeSpy = jest.fn();
      const requestListFn = auth.listAuthorizationReq();
      requestListFn.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [
            {
              ...authorizationList[1],
              data_permission_template_names: ['auth_template_xin']
            }
          ]
        })
      );
      const { baseElement } = superRender(
        <>
          <AuthListItem />
          <RecoilObservable
            state={AuthListModalStatus}
            onChange={modalStatusChangeSpy}
          />
        </>
      );
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalledTimes(1);

      expect(screen.getByText('auth_template_xin')).toBeInTheDocument();
      fireEvent.click(screen.getByText('auth_template_xin'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(navigateSpy).toBeCalled();
      expect(navigateSpy).toBeCalledWith(
        `/provision/project/${projectID}/auth/template/edit_template/?name=auth_template_xin`
      );

      fireEvent.mouseOver(screen.getByText('auth_template_xin'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
      fireEvent.click(
        getAllBySelector(
          '.ant-table-row-level-0 .auth-action-column-editor .anticon-edit',
          baseElement
        )[1]
      );
      await act(async () => jest.advanceTimersByTime(1000));
      expect(modalStatusChangeSpy).toBeCalledTimes(2);
      expect(modalStatusChangeSpy).nthCalledWith(2, {
        [ModalName.UpdateTemplateInAuth]: true,
        [ModalName.UpdateUserInAuth]: false,
        [ModalName.UpdateExpirationInAuth]: false,
        [ModalName.GetConnection]: false
      });
    });

    it('render click service template text', async () => {
      const modalStatusChangeSpy = jest.fn();
      const requestListData = authorizationList[1];
      const requestListFn = auth.listAuthorizationReq();
      requestListFn.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [requestListData]
        })
      );
      const serviceData =
        requestListData.data_object_service as IDataObjectService[];
      const serviceText = `${serviceData[0].data_object_service_dns}(${serviceData[0].data_object_service_user})`;
      superRender(
        <>
          <AuthListItem />
          <RecoilObservable
            state={AuthListModalStatus}
            onChange={modalStatusChangeSpy}
          />
        </>
      );
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalledTimes(1);

      expect(screen.getByText(serviceText)).toBeInTheDocument();
      fireEvent.click(screen.getByText(serviceText));
      await act(async () => jest.advanceTimersByTime(300));
      expect(navigateSpy).toBeCalled();
      expect(navigateSpy).toBeCalledWith(
        `/project/${projectID}/db-services?address=${
          serviceData[0].data_object_service_dns?.split(':')[0]
        }`
      );
    });

    it('render expiration tooltip when mouseover status', async () => {
      const requestListData = authorizationList[0];
      const requestListFn = auth.listAuthorizationReq();
      requestListFn.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [requestListData]
        })
      );
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalledTimes(1);
      const effectiveStatusText = screen.getAllByText('生效中');
      expect(effectiveStatusText.length).toBe(2);
      fireEvent.mouseOver(effectiveStatusText[1]);
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
    });
  });
});
