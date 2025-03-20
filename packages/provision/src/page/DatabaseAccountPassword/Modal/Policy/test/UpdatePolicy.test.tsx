import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EventEmitter from '../../../../../utils/EventEmitter';
import { EventEmitterKey, ModalName } from '../../../../../data/enum';
import {
  PasswordSecurityPolicyModalStatus,
  PasswordSecurityPolicySelectData
} from '../../../../../store/databaseAccountPassword';
import UpdatePolicy from '../UpdatePolicy';
import passwordSecurityPolicy from '../../../../../testUtil/mockApi/passwordSecurityPolicy';
import { passwordSecurityPolicyMockData } from '../../../../../testUtil/mockApi/passwordSecurityPolicy/data';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('provision/DatabaseAccountPassword/UpdatePolicy', () => {
  let authUpdatePasswordSecurityPolicySpy: jest.SpyInstance;

  beforeEach(() => {
    authUpdatePasswordSecurityPolicySpy =
      passwordSecurityPolicy.authUpdatePasswordSecurityPolicy();
    mockUseCurrentProject();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (
    defaultVisible = true,
    selectData = passwordSecurityPolicyMockData[0]
  ) => {
    return superRender(<UpdatePolicy />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(PasswordSecurityPolicyModalStatus, {
            [ModalName.UpdatePasswordSecurityPolicyModal]: defaultVisible
          });
          set(PasswordSecurityPolicySelectData, selectData);
        }
      }
    });
  };

  it('render init snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编辑密码安全策略')).toBeInTheDocument();
    expect(getBySelector('#name')).toHaveValue('test1');
    expect(getBySelector('#name')).not.toHaveAttribute('disabled');
    expect(getBySelector('#passwordExpirationPeriod')).toHaveValue('12');
  });

  it('render init snap when current policy is default', async () => {
    const { baseElement } = customRender(
      true,
      passwordSecurityPolicyMockData[1]
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编辑密码安全策略')).toBeInTheDocument();
    expect(getBySelector('#name')).toHaveValue('中');
    expect(getBySelector('#name')).toHaveAttribute('disabled');
    expect(getBySelector('#passwordExpirationPeriod')).toHaveValue('30');
  });

  it('render update password security policy', async () => {
    const eventEmitter = jest.spyOn(EventEmitter, 'emit');
    customRender();
    fireEvent.input(getBySelector('#name'), {
      target: { value: 'policy1' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getBySelector('#passwordExpirationPeriod'), {
      target: { value: 1 }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdatePasswordSecurityPolicySpy).toHaveBeenCalledTimes(1);
    expect(authUpdatePasswordSecurityPolicySpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      uid: passwordSecurityPolicyMockData[0].uid,
      password_security_policy: {
        name: 'policy1',
        password_expiration_period: 1
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('密码安全策略更新成功')).toBeInTheDocument();
    expect(eventEmitter).toHaveBeenCalledTimes(1);
    expect(eventEmitter).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Password_Management_list_Table
    );
  });

  it('render update password security policy request failed', async () => {
    authUpdatePasswordSecurityPolicySpy.mockClear();
    authUpdatePasswordSecurityPolicySpy.mockImplementation(() =>
      createSpyFailResponse({})
    );
    const eventEmitter = jest.spyOn(EventEmitter, 'emit');
    customRender();
    fireEvent.input(getBySelector('#name'), {
      target: { value: 'policy2' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getBySelector('#passwordExpirationPeriod'), {
      target: { value: 2 }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdatePasswordSecurityPolicySpy).toHaveBeenCalledTimes(1);
    expect(authUpdatePasswordSecurityPolicySpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      uid: passwordSecurityPolicyMockData[0].uid,
      password_security_policy: {
        name: 'policy2',
        password_expiration_period: 2
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
