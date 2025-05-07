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
import ManagePasswordModal from '.';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';
import passwordSecurityPolicy from '../../../../testUtil/mockApi/passwordSecurityPolicy';

describe('provision/DatabaseAccount/ManagePasswordModal', () => {
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
    return superRender(<ManagePasswordModal />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(DatabaseAccountModalStatus, {
            [ModalName.DatabaseAccountManagePasswordModal]: defaultVisible
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
    expect(screen.getByText('托管密码')).toBeInTheDocument();
  });

  it('render manage password', async () => {
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

    fireEvent.input(getBySelector('#password'), {
      target: { value: '123456' }
    });

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: mockDatabaseAccountInfo.db_account_uid,
      db_account: {
        platform_managed: {
          platform_managed: true,
          password_expired_day: 30,
          manage_password: '123456',
          password_security_policy: '',
          password_expiration_policy: 'expiration_lock'
        }
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('托管密码成功')).toBeInTheDocument();
    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Account_Management_List_Table
    );
  });

  it('render manage password with policy', async () => {
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
    fireEvent.click(screen.getByText('到期后保持可用'));

    fireEvent.input(getBySelector('#password'), {
      target: { value: 'abc' }
    });

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: mockDatabaseAccountInfo.db_account_uid,
      db_account: {
        platform_managed: {
          platform_managed: true,
          password_expired_day: 30,
          manage_password: 'abc',
          password_security_policy: '12345',
          password_expiration_policy: 'expiration_available'
        }
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('托管密码成功')).toBeInTheDocument();
    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Account_Management_List_Table
    );
  });

  it('render manage password request failed', async () => {
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
      target: { value: 'abc' }
    });

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
