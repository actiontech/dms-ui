import {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { EventEmitterKey, ModalName } from '~/data/enum';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import { ignoreAntdUseFormNotConnectedError } from '~/testUtil/common';
import {
  getAllBySelector,
  getBySelector,
  queryBySelector
} from '~/testUtil/customQuery';
import { superRender } from '~/testUtil/customRender';
import auth from '~/testUtil/mockApi/auth';
import { authorizationList } from '~/testUtil/mockApi/auth/data';
import RecoilObservable from '~/testUtil/RecoilObservable';
import EventEmitter from '~/utils/EventEmitter';
import AuthList from '.';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('Auth/AuthList', () => {
  ignoreAntdUseFormNotConnectedError();
  let listAuthorizationsSpy: jest.SpyInstance;
  let listUsersSpy: jest.SpyInstance;
  let listDataPermissionTemplateSpy: jest.SpyInstance;
  let delAuthorizationSpy: jest.SpyInstance;
  let listTipsByAuthorizationKeySpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseCurrentProject();
    listAuthorizationsSpy = auth.listAuthorizationReq();
    listUsersSpy = auth.listUsers();
    listDataPermissionTemplateSpy = auth.listDataPermissionTemplate();
    delAuthorizationSpy = auth.removeAuthorization();
    listTipsByAuthorizationKeySpy = auth.listTipsByAuthorizationKeyReq();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should match snapshot', async () => {
    const { container } = superRender(<AuthList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(screen.getByText('授权清单')).toBeInTheDocument();
  });

  it('should refresh table when user click refresh button', async () => {
    superRender(<AuthList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listAuthorizationsSpy).toBeCalledTimes(1);
    fireEvent.click(screen.getByTestId('refresh'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();
    expect(listAuthorizationsSpy).toBeCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(300));
    expect(queryBySelector('.ant-spin-spinning')).not.toBeInTheDocument();
  });

  it('should init modal status when page init', async () => {
    const AuthListModalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <AuthList />
        <RecoilObservable
          state={AuthListModalStatus}
          onChange={AuthListModalStatusChangeSpy}
        />
      </>
    );
    expect(AuthListModalStatusChangeSpy).toBeCalledTimes(1);
    expect(AuthListModalStatusChangeSpy).toBeCalledWith({
      [ModalName.GetConnection]: false,
      [ModalName.UpdateTemplateInAuth]: false,
      [ModalName.UpdateUserInAuth]: false,
      [ModalName.UpdateExpirationInAuth]: false
    });
  });

  it("should open 'update_user_in_auth' modal when click update_user icon button", async () => {
    const AuthListModalStatusChangeSpy = jest.fn();
    const AuthListUpdateSelectDataSpy = jest.fn();
    const { userEvent } = superRender(
      <>
        <AuthList />
        <RecoilObservable
          state={AuthListModalStatus}
          onChange={AuthListModalStatusChangeSpy}
        />
        <RecoilObservable
          state={AuthListSelectData}
          onChange={AuthListUpdateSelectDataSpy}
        />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getAllBySelector('.ant-table-content .anticon-edit')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    expect(AuthListModalStatusChangeSpy).toBeCalledTimes(2);
    expect(AuthListModalStatusChangeSpy).nthCalledWith(2, {
      [ModalName.GetConnection]: false,
      [ModalName.UpdateTemplateInAuth]: false,
      [ModalName.UpdateUserInAuth]: true,
      [ModalName.UpdateExpirationInAuth]: false
    });
    expect(AuthListUpdateSelectDataSpy).toBeCalledTimes(1);
  });

  it("should open 'update_template_in_auth' modal when click update_template icon button", async () => {
    const AuthListModalStatusChangeSpy = jest.fn();
    const AuthListUpdateSelectDataSpy = jest.fn();
    superRender(
      <>
        <AuthList />
        <RecoilObservable
          state={AuthListModalStatus}
          onChange={AuthListModalStatusChangeSpy}
        />
        <RecoilObservable
          state={AuthListSelectData}
          onChange={AuthListUpdateSelectDataSpy}
        />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getAllBySelector('.ant-table-content .anticon-edit')[1]);
    await act(async () => jest.advanceTimersByTime(100));

    expect(AuthListModalStatusChangeSpy).toBeCalledTimes(2);
    expect(AuthListModalStatusChangeSpy).nthCalledWith(2, {
      [ModalName.GetConnection]: false,
      [ModalName.UpdateTemplateInAuth]: true,
      [ModalName.UpdateUserInAuth]: false,
      [ModalName.UpdateExpirationInAuth]: false
    });
    expect(AuthListUpdateSelectDataSpy).toBeCalledTimes(1);
  });
  it("should open 'update_expiration_in_auth' modal when click update_expiration icon button", async () => {
    const AuthListModalStatusChangeSpy = jest.fn();
    const AuthListUpdateSelectDataSpy = jest.fn();
    superRender(
      <>
        <AuthList />
        <RecoilObservable
          state={AuthListModalStatus}
          onChange={AuthListModalStatusChangeSpy}
        />
        <RecoilObservable
          state={AuthListSelectData}
          onChange={AuthListUpdateSelectDataSpy}
        />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getAllByText('更多')[0]);
    fireEvent.click(screen.getByText('续期'));

    await act(async () => jest.advanceTimersByTime(100));

    expect(AuthListModalStatusChangeSpy).toBeCalledTimes(2);
    expect(AuthListModalStatusChangeSpy).nthCalledWith(2, {
      [ModalName.GetConnection]: false,
      [ModalName.UpdateTemplateInAuth]: false,
      [ModalName.UpdateUserInAuth]: false,
      [ModalName.UpdateExpirationInAuth]: true
    });
    expect(AuthListUpdateSelectDataSpy).toBeCalledTimes(1);
  });

  it('should remove auth when user click remove auth button', async () => {
    const { userEvent, container } = superRender(<AuthList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.findByText('authorization-001'));
    fireEvent.click(screen.getAllByText('回收权限')[0]);
    const el = await screen.findByText(
      "确定要回收目的为'authorization-001'的权限?"
    );
    expect(el).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    expect(delAuthorizationSpy).toBeCalledTimes(1);
    expect(delAuthorizationSpy).toBeCalledWith({
      authorization_uid: String(authorizationList[0].uid)
    });
    await act(async () => jest.advanceTimersByTime(100));

    const loadingEl = await screen.findByText('正在回收权限...');
    expect(loadingEl).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('正在回收权限...')).not.toBeInTheDocument();
    const successEl = await screen.findByText('权限回收成功');
    expect(successEl).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('权限回收成功')).not.toBeInTheDocument();
    // 不能每次都保证messageSuccessTip消失后，表格已经刷新完毕，因此，如果表格还在刷新时，等刷新结束后在比较快照。
    if (queryBySelector('.ant-spin-spinning')) {
      await waitForElementToBeRemoved(queryBySelector('.ant-spin-spinning'));
    }
    expect(container).toMatchSnapshot();
  });
  it('the table should be filtered when url params is not empty', async () => {
    superRender(
      <Routes>
        <Route path="/auth/list/:purpose" element={<AuthList />} />
      </Routes>,
      {},
      {
        routerProps: {
          initialEntries: ['/auth/list/asd']
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(300));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listAuthorizationsSpy).toBeCalledWith({
      page_index: 1,
      page_size: 20,
      filter_by_purpose: 'asd',
      filter_by_namespace_uid: mockProjectInfo.projectID
    });
  });

  it("should refresh table when eventEmitter receive 'Refresh_Auth_List_Table' message", async () => {
    const { container } = superRender(<AuthList />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(() => {
      EventEmitter.emit(EventEmitterKey.Refresh_Auth_List_Table);
    });
    await act(async () => jest.advanceTimersByTime(100));

    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    await waitFor(() =>
      expect(queryBySelector('.ant-spin-spinning')).not.toBeInTheDocument()
    );
    expect(container).toMatchSnapshot();
  });
});
