import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import dbAccountService from '@actiontech/shared/lib/testUtil/mockApi/provision/dbAccountService';
import { dbAccountMockData } from '@actiontech/shared/lib/testUtil/mockApi/provision/dbAccountService/data';
import auth from '@actiontech/shared/lib/testUtil/mockApi/provision/auth';
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
import Password from '../../../../utils/Password';
import customDBPasswordRule from '@actiontech/shared/lib/testUtil/mockApi/provision/customDBPasswordRule';
import { mockGeneratedDBPasswordByCustomRule } from '@actiontech/shared/lib/testUtil/mockApi/provision/customDBPasswordRule/data';

describe('provision/DatabaseAccount/ModifyPasswordModal', () => {
  let authUpdateDBAccountSpy: jest.SpyInstance;
  let authGetCustomDBPasswordRuleSpy: jest.SpyInstance;
  const mockDatabaseAccountInfo = dbAccountMockData[0];

  beforeEach(() => {
    authUpdateDBAccountSpy = dbAccountService.authUpdateDBAccount();
    authGetCustomDBPasswordRuleSpy =
      customDBPasswordRule.authGetCustomDBPasswordRule();
    auth.mockAllApi();
    mockUseCurrentProject();
    jest
      .spyOn(Password, 'generateDBPasswordByCustomCharType')
      .mockReturnValue(mockGeneratedDBPasswordByCustomRule);
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
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('修改密码')).toBeInTheDocument();
    expect(authGetCustomDBPasswordRuleSpy).toHaveBeenCalledTimes(1);
  });

  it('render modify password', async () => {
    document.execCommand = jest.fn();
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getBySelector('#effective_time_day')).toHaveValue('30');

    expect(getBySelector('#password')).not.toHaveValue();
    expect(getBySelector('#confirm_password')).not.toHaveValue();
    fireEvent.click(screen.getByText('生 成'));

    expect(getBySelector('#password')).toHaveValue(
      mockGeneratedDBPasswordByCustomRule
    );
    expect(getBySelector('#confirm_password')).toHaveValue(
      mockGeneratedDBPasswordByCustomRule
    );

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: mockDatabaseAccountInfo.db_account_uid,
      db_account: {
        password_config: {
          password_expired_day: 30,
          db_account_password: mockGeneratedDBPasswordByCustomRule,
          password_expiration_policy: 'expiration_lock'
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

    expect(getBySelector('#effective_time_day')).toHaveValue('30');

    fireEvent.input(getBySelector('#password'), {
      target: { value: mockGeneratedDBPasswordByCustomRule }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getBySelector('#confirm_password'), {
      target: { value: mockGeneratedDBPasswordByCustomRule }
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

  it('render verify password consistency', async () => {
    const rejectSpy = jest.spyOn(Promise, 'reject');
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => {
      fireEvent.change(getBySelector('#password'), {
        target: { value: '123' }
      });
      await jest.advanceTimersByTime(100);
    });

    await act(async () => {
      fireEvent.change(getBySelector('#confirm_password'), {
        target: { value: '234' }
      });
      await jest.advanceTimersByTime(100);
    });
    expect(rejectSpy).toHaveBeenCalled();
    expect(rejectSpy).toHaveBeenCalledWith(new Error('您输入的两个密码不匹配'));
  });
});
