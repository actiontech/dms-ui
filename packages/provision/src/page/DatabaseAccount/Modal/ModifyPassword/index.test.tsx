import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import dbAccountService from '../../../../testUtil/mockApi/dbAccountService';
import { dbAccountMockData } from '../../../../testUtil/mockApi/dbAccountService/data';
import auth from '../../../../testUtil/mockApi/auth';
import EventEmitter from '../../../../utils/EventEmitter';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  DatabaseAccountModalStatus,
  DatabaseAccountSelectData
} from '../../../../store/databaseAccount';
import { EventEmitterKey, ModalName } from '../../../../data/enum';
import ModifyPasswordModal from '.';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';
import passwordSecurityPolicy from '../../../../testUtil/mockApi/passwordSecurityPolicy';
import Password from '../../../../utils/Password';

describe('provision/DatabaseAccount/ModifyPasswordModal', () => {
  let authListPasswordSecurityPoliciesSpy: jest.SpyInstance;
  let authUpdateDBAccountSpy: jest.SpyInstance;

  const mockDatabaseAccountInfo = dbAccountMockData[0];

  beforeEach(() => {
    authListPasswordSecurityPoliciesSpy =
      passwordSecurityPolicy.authListPasswordSecurityPolicies();
    authUpdateDBAccountSpy = dbAccountService.authUpdateDBAccount();
    auth.mockAllApi();
    mockUseCurrentProject();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (
    defaultVisible = true,
    selectData: IListDBAccount = mockDatabaseAccountInfo
  ) => {
    return superRender(<ModifyPasswordModal />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(DatabaseAccountModalStatus, {
            [ModalName.DatabaseAccountModifyPasswordModal]: defaultVisible
          });
          set(DatabaseAccountSelectData, selectData);
        }
      }
    });
  };

  it('render init snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListPasswordSecurityPoliciesSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('修改密码')).toBeInTheDocument();
  });

  it('render modify password', async () => {
    const generateMySQLPassword = jest.spyOn(Password, 'generateMySQLPassword');
    generateMySQLPassword.mockReturnValue('123456');
    document.execCommand = jest.fn();
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#policy'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('中')).toBeInTheDocument();
    fireEvent.click(screen.getByText('中'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#effective_time_day')).toHaveValue('30');
    expect(getBySelector('#effective_time_day')).toHaveAttribute('disabled');
    fireEvent.mouseDown(getBySelector('#policy'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('无')).toBeInTheDocument();
    fireEvent.click(screen.getByText('无'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#effective_time_day')).not.toHaveAttribute(
      'disabled'
    );

    expect(getBySelector('#password')).not.toHaveValue();
    expect(getBySelector('#confirm_password')).not.toHaveValue();
    fireEvent.click(screen.getByText('生 成'));
    expect(generateMySQLPassword).toHaveBeenCalled();
    expect(getBySelector('#password')).toHaveValue('123456');
    expect(getBySelector('#confirm_password')).toHaveValue('123456');

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: mockDatabaseAccountInfo.db_account_uid,
      db_account: {
        password_config: {
          password_expired_day: 30,
          db_account_password: '123456',
          password_security_policy: ''
        }
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('修改密码成功')).toBeInTheDocument();
    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Account_Management_List_Table
    );
  });

  it('render modify password with policy', async () => {
    const generateMySQLPassword = jest.spyOn(Password, 'generateMySQLPassword');
    generateMySQLPassword.mockReturnValue('abc');
    document.execCommand = jest.fn();
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#policy'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('中')).toBeInTheDocument();
    fireEvent.click(screen.getByText('中'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#effective_time_day')).toHaveValue('30');
    expect(getBySelector('#effective_time_day')).toHaveAttribute('disabled');

    expect(getBySelector('#password')).not.toHaveValue();
    expect(getBySelector('#confirm_password')).not.toHaveValue();
    fireEvent.click(screen.getByText('生 成'));
    expect(generateMySQLPassword).toHaveBeenCalled();
    expect(getBySelector('#password')).toHaveValue('abc');
    expect(getBySelector('#confirm_password')).toHaveValue('abc');

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: mockDatabaseAccountInfo.db_account_uid,
      db_account: {
        password_config: {
          password_expired_day: 30,
          db_account_password: 'abc',
          password_security_policy: '12345'
        }
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('修改密码成功')).toBeInTheDocument();
    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Account_Management_List_Table
    );
  });

  it('render modify password request failed', async () => {
    authUpdateDBAccountSpy.mockClear();
    authUpdateDBAccountSpy.mockImplementation(() => createSpyFailResponse({}));
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#policy'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('中')).toBeInTheDocument();
    fireEvent.click(screen.getByText('中'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#effective_time_day')).toHaveValue('30');
    expect(getBySelector('#effective_time_day')).toHaveAttribute('disabled');

    fireEvent.input(getBySelector('#password'), {
      target: { value: '123456' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getBySelector('#confirm_password'), {
      target: { value: '123456' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('确 认').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitterSpy).not.toHaveBeenCalled();
    expect(screen.getByText('确 认').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(100));
  });
});
