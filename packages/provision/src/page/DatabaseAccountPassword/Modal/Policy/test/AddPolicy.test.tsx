import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EventEmitter from '../../../../../utils/EventEmitter';
import { EventEmitterKey, ModalName } from '../../../../../data/enum';
import { PasswordSecurityPolicyModalStatus } from '../../../../../store/databaseAccountPassword';
import AddPolicy from '../AddPolicy';
import passwordSecurityPolicy from '../../../../../testUtil/mockApi/passwordSecurityPolicy';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('provision/DatabaseAccountPassword/AddPolicy', () => {
  let authAddPasswordSecurityPolicySpy: jest.SpyInstance;

  beforeEach(() => {
    authAddPasswordSecurityPolicySpy =
      passwordSecurityPolicy.authAddPasswordSecurityPolicy();
    mockUseCurrentProject();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (defaultVisible = true) => {
    return superRender(<AddPolicy />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(PasswordSecurityPolicyModalStatus, {
            [ModalName.CreatePasswordSecurityPolicyModal]: defaultVisible
          });
        }
      }
    });
  };

  it('render init snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('创建密码安全策略')).toBeInTheDocument();
  });

  it('render create password security policy', async () => {
    const eventEmitter = jest.spyOn(EventEmitter, 'emit');
    customRender();
    fireEvent.input(getBySelector('#name'), {
      target: { value: 'test' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getBySelector('#passwordExpirationPeriod'), {
      target: { value: 11 }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authAddPasswordSecurityPolicySpy).toHaveBeenCalledTimes(1);
    expect(authAddPasswordSecurityPolicySpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      password_security_policy: {
        name: 'test',
        password_expiration_period: 11
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('密码安全策略创建成功')).toBeInTheDocument();
    expect(eventEmitter).toHaveBeenCalledTimes(1);
    expect(eventEmitter).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Password_Management_list_Table
    );
  });

  it('render create password security policy request failed', async () => {
    authAddPasswordSecurityPolicySpy.mockClear();
    authAddPasswordSecurityPolicySpy.mockImplementation(() =>
      createSpyFailResponse({})
    );
    const eventEmitter = jest.spyOn(EventEmitter, 'emit');
    customRender();
    fireEvent.input(getBySelector('#name'), {
      target: { value: 'test' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getBySelector('#passwordExpirationPeriod'), {
      target: { value: 11 }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authAddPasswordSecurityPolicySpy).toHaveBeenCalledTimes(1);
    expect(authAddPasswordSecurityPolicySpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      password_security_policy: {
        name: 'test',
        password_expiration_period: 11
      }
    });
    expect(screen.getByText('提 交').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitter).not.toHaveBeenCalled();
    expect(screen.getByText('提 交').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(100));
  });
});
