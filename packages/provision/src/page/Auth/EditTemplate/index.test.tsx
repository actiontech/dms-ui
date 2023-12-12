import { act, screen, cleanup, fireEvent } from '@testing-library/react';
import auth from '~/testUtil/mockApi/auth';
import { ModalName } from '~/data/enum';
import { AuthDataPermissionListModalStatus } from '~/store/auth/templateList';
import RecoilObservable from '~/testUtil/RecoilObservable';
import EditTemplate from '.';
import {
  getBySelector,
  selectOptionByIndex
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';

describe.skip('Auth/EditTemplate', () => {
  let listDataPermissionTemplateSpy: jest.SpyInstance;
  let listBusinessesSpy: jest.SpyInstance;
  let listServicesSpy: jest.SpyInstance;
  let listDataBasesSpy: jest.SpyInstance;
  let listTablesSpy: jest.SpyInstance;
  let listOperationSetsSpy: jest.SpyInstance;
  let getDataPermissionsInDataPermissionTemplateSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseCurrentProject();
    listDataPermissionTemplateSpy = auth.listDataPermissionTemplate();
    listBusinessesSpy = auth.listBusinesses();
    listServicesSpy = auth.listServices();
    listDataBasesSpy = auth.listDataBases();
    listTablesSpy = auth.listTables();
    listOperationSetsSpy = auth.listOperationSets();
    getDataPermissionsInDataPermissionTemplateSpy =
      auth.getDataPermissionsInDataPermissionTemplate();
    jest.useFakeTimers();
    window.confirm = jest.fn();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });
  const customRender = () => {
    return superRender(
      <EditTemplate />,
      {},
      {
        routerProps: {
          initialEntries: ['/auth/template/edit_template?id=123&name=aaa']
        }
      }
    );
  };
  it('should match snapshot', async () => {
    const { container: addContainer } = superRender(<EditTemplate />);
    expect(addContainer).toMatchSnapshot();

    const { container: detailsContainer } = superRender(
      <EditTemplate />,
      {},
      {
        routerProps: {
          initialEntries: [
            '/auth/template/edit_template?id=1588045966282330112&name=aaa'
          ]
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('mysql.*');
    expect(detailsContainer).toMatchSnapshot();
  });

  it('should match snapshot when the url not contain an id', async () => {
    const { container: addContainer } = superRender(<EditTemplate />);
    expect(addContainer).toMatchSnapshot();

    const { container: detailsContainer } = superRender(
      <EditTemplate />,
      {},
      {
        routerProps: {
          initialEntries: ['/auth/template/edit_template?name=aaa']
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(detailsContainer).toMatchSnapshot();
  });

  it('should init modal status when page init', async () => {
    const templateDetailModalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <EditTemplate />
        <RecoilObservable
          state={AuthDataPermissionListModalStatus}
          onChange={templateDetailModalStatusChangeSpy}
        />
      </>
    );
    expect(templateDetailModalStatusChangeSpy).toBeCalledTimes(1);
    expect(templateDetailModalStatusChangeSpy).toBeCalledWith({
      [ModalName.DataPermissionModal]: false
    });
  });

  it("should open 'data_permission' modal when user click add dataPermission button", async () => {
    const templateDetailModalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <EditTemplate />
        <RecoilObservable
          state={AuthDataPermissionListModalStatus}
          onChange={templateDetailModalStatusChangeSpy}
        />
      </>
    );
    await screen.findByText('添加权限模版');
    fireEvent.click(screen.getByText('添加数据权限'));
    await act(async () => jest.advanceTimersByTime(1000));

    expect(templateDetailModalStatusChangeSpy).toBeCalledTimes(2);
    expect(templateDetailModalStatusChangeSpy).nthCalledWith(2, {
      [ModalName.DataPermissionModal]: true
    });
  });

  it('should add auth_template when user input all fields and click submit button', async () => {
    const addDataPermissionTemplateSpy = auth.addDataPermissionTemplate();
    superRender(<EditTemplate />);
    await act(async () => jest.advanceTimersByTime(1000));
    await screen.findByText('添加权限模版');
    fireEvent.input(screen.getByLabelText('数据权限模版名称'), {
      target: { value: 'template-1' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('添加数据权限'));
    await act(async () => jest.advanceTimersByTime(300));
    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('业务', 'business-1', 1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(
      getBySelector('.data-service-select .ant-select-selector input')
    );
    await act(async () => jest.advanceTimersByTime(300));
    await act(() =>
      fireEvent.click(screen.getAllByText('Julian Lueilwitz(MySQL)')[0])
    );
    await act(async () => jest.advanceTimersByTime(3000));
    selectOptionByIndex('选择操作', '查询', 0);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(300));
    await act(async () => jest.advanceTimersByTime(1000));
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(addDataPermissionTemplateSpy).toBeCalledWith({
      template: {
        data_permissions: [
          {
            data_object_uids: ['42343'],
            data_operation_set_uids: ['27']
          }
        ],
        name: 'template-1',
        namespace_uid: mockProjectInfo.projectID
      }
    });
    expect(screen.getByText('保 存').parentElement).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText(`模版"template-1"添加成功！`);
  });
  it('should match snapshot when click edit button', async () => {
    const { container } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    await screen.findByText('information_schema.CHARACTER_SETS');
    fireEvent.click(screen.getByText('编辑'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(container).toMatchSnapshot();
  });
  it('should match snapshot when click remove button', async () => {
    const { container } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    await screen.findByText('information_schema.CHARACTER_SETS');
    fireEvent.click(screen.getByText('删除'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(container).toMatchSnapshot();
  });
  it('should update auth_template when click submit button', async () => {
    const updateDataPermissionTemplateSpy = auth.updateDataPermissionTemplate();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('information_schema.CHARACTER_SETS');

    await act(() => fireEvent.click(screen.getByText('清除所有权限')));
    await act(() => fireEvent.click(screen.getByText('保 存')));
    await act(async () => jest.advanceTimersByTime(300));

    expect(updateDataPermissionTemplateSpy).toBeCalledWith({
      data_permission_template_uid: '123',
      template: {
        data_permissions: []
      }
    });
    expect(screen.getByText('保 存').parentElement).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));

    await screen.findByText(`模版"aaa"修改成功！`);
  });

  it('block route jump when the form is not saved', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm');
    superRender(<EditTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('数据权限模版名称'), {
      target: { value: 'temp-1' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('返 回'));
    expect(confirmSpy).toBeCalledTimes(1);
  });
});
