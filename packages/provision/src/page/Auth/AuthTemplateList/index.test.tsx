import {
  act,
  screen,
  waitForElementToBeRemoved,
  cleanup,
  fireEvent
} from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { EventEmitterKey, ModalName } from '~/data/enum';
import {
  AuthTemplateListSelectData,
  AuthTemplateModalStatus
} from '~/store/auth/templateList';
import { getBySelector, queryBySelector } from '~/testUtil/customQuery';
import auth from '~/testUtil/mockApi/auth';
import { templateList } from '~/testUtil/mockApi/auth/data';
import RecoilObservable from '~/testUtil/RecoilObservable';
import EventEmitter from '~/utils/EventEmitter';
import AuthTemplateList from '.';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('Auth/AuthTemplateList', () => {
  const tempListAuthorizationsSpy = () =>
    createSpySuccessResponse({
      total: 20,
      instances: templateList.slice(-2)
    });

  let listDataPermissionTemplateSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseCurrentProject();
    listDataPermissionTemplateSpy = auth.listDataPermissionTemplate();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should match snapshot', async () => {
    const { container } = superRender(<AuthTemplateList />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('template-1');
    expect(container).toMatchSnapshot();
  });

  it('should refresh table when user click refresh button', async () => {
    listDataPermissionTemplateSpy.mockClear();
    listDataPermissionTemplateSpy.mockImplementation(tempListAuthorizationsSpy);
    const { container } = superRender(<AuthTemplateList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listDataPermissionTemplateSpy).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
    fireEvent.click(getBySelector('.custom-icon-refresh'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(listDataPermissionTemplateSpy).toHaveBeenCalledTimes(2);
    expect(queryBySelector('.ant-spin-spinning')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("should refresh table when eventEmitter receive 'Refresh_Auth_Template_List_Table' message", async () => {
    const { container } = superRender(<AuthTemplateList />);
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('template-1');
    listDataPermissionTemplateSpy.mockClear();
    listDataPermissionTemplateSpy.mockImplementation(tempListAuthorizationsSpy);
    await act(() => {
      EventEmitter.emit(EventEmitterKey.Refresh_Auth_Template_List_Table);
    });
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(queryBySelector('.ant-spin-spinning')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('the table should be filtered when url params is not empty', async () => {
    const {} = superRender(
      <Routes>
        <Route path="/auth/template/:name" element={<AuthTemplateList />} />
      </Routes>,
      {},
      {
        routerProps: {
          initialEntries: ['/auth/template/asd']
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listDataPermissionTemplateSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20,
      filter_by_name: 'asd',
      filter_by_namespace_uid: mockProjectInfo.projectID,
      keyword: ''
    });
  });

  it('should remove auth_template when user click remove template button', async () => {
    const removeDataPermissionTemplateSpy = auth.removeDataPermissionTemplate();
    const { container } = superRender(<AuthTemplateList />);
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('template-1');
    fireEvent.click(screen.getAllByText('删 除')[0]);
    await act(async () => jest.advanceTimersByTime(300));

    const el = await screen.findByText(`确认要移除模板"template-1"?`);
    expect(el).toBeInTheDocument();

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(300));

    expect(removeDataPermissionTemplateSpy).toHaveBeenCalledWith({
      data_permission_template_uid: String(templateList[0].uid)
    });
    await act(async () => jest.advanceTimersByTime(100));

    const loadingEl = await screen.findByText(`正在删除模板 "template-1"...`);
    expect(loadingEl).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText('正在删除模板 "template-1"...')
    ).not.toBeInTheDocument();

    const successEl = await screen.findByText(`模板 "template-1" 删除成功`);
    expect(successEl).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText(`模板 "template-1" 删除成功`)
    ).not.toBeInTheDocument();
    if (queryBySelector('.ant-spin-spinning')) {
      await waitForElementToBeRemoved(queryBySelector('.ant-spin-spinning'));
    }

    expect(container).toMatchSnapshot();
  });

  it("should open 'copy_template' modal when user click copy template button", async () => {
    const TemplateListModalStatusChangeSpy = jest.fn();
    const AuthListUpdateSelectDataSpy = jest.fn();
    superRender(
      <>
        <AuthTemplateList />
        <RecoilObservable
          state={AuthTemplateModalStatus}
          onChange={TemplateListModalStatusChangeSpy}
        />
        <RecoilObservable
          state={AuthTemplateListSelectData}
          onChange={AuthListUpdateSelectDataSpy}
        />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('template-1');
    fireEvent.click(
      getAllBySelector('.actiontech-table-actions-more-button')[0]
    );
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('类似创建'));

    await act(async () => jest.advanceTimersByTime(300));
    expect(TemplateListModalStatusChangeSpy).toHaveBeenCalledTimes(2);
    expect(TemplateListModalStatusChangeSpy).toHaveBeenNthCalledWith(2, {
      [ModalName.CopyTemplate]: true
    });
    expect(AuthListUpdateSelectDataSpy).toHaveBeenCalledTimes(1);
  });
});
