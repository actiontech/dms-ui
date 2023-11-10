import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { ignoreAntdFormValidateWarning } from '~/testUtil/common';
import auth from '~/testUtil/mockApi/auth';
import AddAuth from '.';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('Auth/AddAuth', () => {
  ignoreAntdFormValidateWarning();
  let addAuthorizationSpy: jest.SpyInstance;
  let listUsersSpy: jest.SpyInstance;
  let listDataPermissionTemplateSpy: jest.SpyInstance;
  let verifyDBAccountSpy: jest.SpyInstance;
  let getDataPermissionsInDataPermissionTemplateSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    listUsersSpy = auth.listUsers();
    listDataPermissionTemplateSpy = auth.listDataPermissionTemplate();
    addAuthorizationSpy = auth.addAuthorization();
    verifyDBAccountSpy = auth.verifyDBAccount();
    getDataPermissionsInDataPermissionTemplateSpy =
      auth.getStatementsByDataPermissionTemplate();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });
  it('should match snapshot', async () => {
    const { container } = superRender(<AddAuth />);
    expect(container).toMatchSnapshot();
  });
  it('add authorization when user click submit button', async () => {
    const { baseElement } = superRender(<AddAuth />);
    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('权限模版', 'template-1', 0);
    selectOptionByIndex('使用人', 'Dewey Connelly', 0);
    fireEvent.input(screen.getByLabelText('目的或用途'), {
      target: { value: 'purpose1' }
    });
    fireEvent.input(screen.getByLabelText('连接账号名'), {
      target: { value: 'username1' }
    });
    fireEvent.input(screen.getByLabelText('连接域'), {
      target: { value: 'hostname1' }
    });
    fireEvent.input(screen.getByLabelText('连接密码'), {
      target: { value: 'password1' }
    });
    fireEvent.input(screen.getByLabelText('确认连接密码'), {
      target: { value: 'password1' }
    });

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(500));
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('账号创建预览');
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(addAuthorizationSpy).toBeCalledWith({
      authorization: {
        data_permission_template_uid: '69',
        effective_time_day: -1,
        db_account: {
          username: 'username1',
          hostname: 'hostname1',
          password: 'password1'
        },
        permission_user_uid: '85315',
        purpose: 'purpose1'
      }
    });
    expect(screen.getByText('提 交').parentElement).toHaveClass(
      'ant-btn-loading'
    );
    await screen.findByText(`授权成功`);
    expect(screen.queryByText('确 认')).not.toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
    await act(() => fireEvent.click(screen.getByText('继续授权')));
    expect(baseElement).toMatchSnapshot();
  });
  it('should reset all fields when user click reset button', async () => {
    superRender(<AddAuth />);
    fireEvent.input(screen.getByLabelText('目的或用途'), {
      target: { value: 'purpose1' }
    });
    await screen.queryByText('purpose-1');

    await act(() => fireEvent.click(screen.getByText('重 置')));
    expect(screen.queryByText('purpose-1')).not.toBeInTheDocument();
  });

  it('should input template when the url contains an id', async () => {
    superRender(
      <AddAuth />,
      {},
      {
        routerProps: {
          initialEntries: ['/auth/list/add/?id=69']
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('template-1');
    expect(screen.queryByText('template-1')).toBeInTheDocument();
    selectOptionByIndex('使用人', 'Dewey Connelly', 0);
    await act(() => fireEvent.click(screen.getByText('重 置')));
    expect(screen.queryByText('Dewey Connelly')).not.toBeInTheDocument();
    expect(screen.queryByText('template-1')).toBeInTheDocument();
  });

  it('reset input value when select dropdown visible is false', async () => {
    superRender(<AddAuth />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.input(screen.getByLabelText('使用人'), {
      target: { value: 'user-1234' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByLabelText('使用人')).toHaveValue('user-1234');
    fireEvent.click(screen.getByText('有效期'));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByLabelText('使用人')).toHaveValue();
  });

  it('throw error when the user name is not unique', async () => {
    verifyDBAccountSpy.mockClear();
    verifyDBAccountSpy.mockImplementation(() => createSpyFailResponse({}));
    superRender(<AddAuth />);
    await act(async () => jest.advanceTimersByTime(3000));

    selectOptionByIndex('权限模版', 'template-1', 0);
    fireEvent.input(screen.getByLabelText('连接账号名'), {
      target: { value: 'username1' }
    });
    fireEvent.input(screen.getByLabelText('连接域'), {
      target: { value: 'hostname1' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(verifyDBAccountSpy).toBeCalledWith({
      data_permission_template_uid: '69',
      username: 'username1',
      hostname: 'hostname1'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    const el = await screen.findAllByText('error');
    expect(el[0]).toBeInTheDocument();
  });
});
