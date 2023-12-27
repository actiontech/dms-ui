import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { useNavigate } from 'react-router-dom';

import auth from '../../../testUtil/mockApi/auth';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

import AddAuth from '.';

jest.mock('react-router-dom', () => {
  const mockUrlParams = new Map();
  mockUrlParams.set('id', '');
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/Auth/AddAuth', () => {
  const navigateSpy = jest.fn();
  const customRender = (params = {}) => {
    return superRender(<AddAuth />, undefined, params);
  };

  beforeEach(() => {
    mockUseCurrentProject();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    auth.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render add auth snap', async () => {
    const { baseElement } = customRender();
    expect(screen.getByText('返回授权清单列表')).toBeInTheDocument();
    expect(screen.getByText('选择权限模板')).toBeInTheDocument();
    expect(screen.getByText('授权目的')).toBeInTheDocument();
    expect(screen.getByText('数据库连接账号')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render prepare api request', async () => {
    const requestTemplateListFn = auth.listDataPermissionTemplate();
    const requestUserListFn = auth.listUsers();
    customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestTemplateListFn).toBeCalled();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestUserListFn).toBeCalled();
  });

  it('render reset form data when click reset btn', async () => {
    const { baseElement } = customRender();

    fireEvent.change(getBySelector('#hostname', baseElement), {
      target: { value: '1.2.3.4' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('#hostname', baseElement)).toHaveAttribute(
      'value',
      '1.2.3.4'
    );

    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('#hostname', baseElement)).toHaveAttribute(
      'value',
      ''
    );
  });

  it('render click return list btn', async () => {
    customRender();
    expect(screen.getByText('返回授权清单列表')).toBeInTheDocument();

    fireEvent.click(screen.getByText('返回授权清单列表'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(navigateSpy).toBeCalled();
    expect(navigateSpy).toBeCalledWith(-1);
  });

  it('render location search has id', async () => {
    const requestTemplateListFn = auth.listDataPermissionTemplate();
    requestTemplateListFn.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            authorization_purpose: ['sed', 'ut occaecat culpa'],
            create_user: 'dolor magna ipsum',
            memo: 'consectetur commodo dolore',
            uid: '69',
            name: 'template-useSearchParams',
            created_at: '1993-09-20 03:09:39'
          }
        ]
      })
    );
    const { baseElement } = customRender({
      routerProps: { initialEntries: ['?id=69'] }
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestTemplateListFn).toBeCalled();
    expect(baseElement).toMatchSnapshot();
  });

  describe('render VerifyDBAccount', () => {
    it('render pass db account', async () => {
      const requestTemplateListFn = auth.listDataPermissionTemplate();
      const requestVerifyDBAccountFn = auth.verifyDBAccount();
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestTemplateListFn).toBeCalled();

      fireEvent.mouseDown(
        getBySelector('#data_permission_template_uid', baseElement)
      );
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('template-1')).toBeInTheDocument();
      fireEvent.click(screen.getByText('template-1'));
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#hostname', baseElement), {
        target: { value: '1.2.3.4' }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#username', baseElement), {
        target: { value: 'test' }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.focusOut(getBySelector('#username', baseElement));
      await act(async () => jest.advanceTimersByTime(300));
      expect(requestVerifyDBAccountFn).toBeCalled();
      expect(requestVerifyDBAccountFn).toBeCalledWith({
        data_permission_template_uid: '69',
        hostname: '1.2.3.4',
        username: 'test'
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(screen.getByText('账号名检测通过')).toBeInTheDocument();
    });

    it('render no pass db account', async () => {
      const requestTemplateListFn = auth.listDataPermissionTemplate();
      const requestVerifyDBAccountFn = auth.verifyDBAccount();
      requestVerifyDBAccountFn.mockImplementation(() =>
        createSpySuccessResponse({ message: 'this is error info' })
      );
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestTemplateListFn).toBeCalled();

      fireEvent.mouseDown(
        getBySelector('#data_permission_template_uid', baseElement)
      );
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('template-1')).toBeInTheDocument();
      fireEvent.click(screen.getByText('template-1'));
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#hostname', baseElement), {
        target: { value: '1.2.3.4' }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#username', baseElement), {
        target: { value: 'test' }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.focusOut(getBySelector('#username', baseElement));
      await act(async () => jest.advanceTimersByTime(300));
      expect(requestVerifyDBAccountFn).toBeCalled();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render pwd form item', () => {
    it('render pwd not same', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(6300));
      expect(screen.getByText('数据库连接账号')).toBeInTheDocument();

      fireEvent.input(getBySelector('#password', baseElement), {
        target: { value: '111' }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.input(getBySelector('#confirm_password', baseElement), {
        target: { value: '222' }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.focusOut(getBySelector('#confirm_password', baseElement));
      await act(async () => jest.advanceTimersByTime(100));

      expect(baseElement).toMatchSnapshot();
    });

    it('render pwd auto created', async () => {
      document.execCommand = jest.fn();
      customRender();

      await act(async () => jest.advanceTimersByTime(6300));
      expect(screen.getByText('数据库连接账号')).toBeInTheDocument();

      fireEvent.click(screen.getByText('生 成'));
      await act(async () => jest.advanceTimersByTime(1000));
      expect(
        screen.getByText('已生成16位密码并复制在剪贴板中')
      ).toBeInTheDocument();
    });
  });

  describe('render form submit', () => {
    it('render submit when all form item input', async () => {
      const requestVerifyDBAccountFn = auth.verifyDBAccount();
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(6300));

      // input
      fireEvent.mouseDown(
        getBySelector('#data_permission_template_uid', baseElement)
      );
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('template-1')).toBeInTheDocument();
      fireEvent.click(screen.getByText('template-1'));
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.mouseDown(getBySelector('#effective_time_day', baseElement));
      fireEvent.click(screen.getByText('一个星期'));
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.mouseDown(getBySelector('#permission_user_uid', baseElement));
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.click(screen.getAllByText('Dewey Connelly')[1]);
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.input(getBySelector('#purpose', baseElement), {
        target: { value: 'purpose' }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#hostname', baseElement), {
        target: { value: '1.1.1.1' }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.input(getBySelector('#username', baseElement), {
        target: { value: 'test' }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.input(getBySelector('#password', baseElement), {
        target: { value: '111' }
      });
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.input(getBySelector('#confirm_password', baseElement), {
        target: { value: '111' }
      });

      // submit && preview
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestVerifyDBAccountFn).toBeCalled();
      expect(screen.getByText('账号名检测通过')).toBeInTheDocument();

      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestVerifyDBAccountFn).toBeCalled();
    });
  });
});
