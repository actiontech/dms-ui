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
  DatabaseAccountBatchActionSelectedData
} from '../../../../store/databaseAccount';
import { EventEmitterKey, ModalName } from '../../../../data/enum';
import BatchModifyPasswordModal from '.';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';
import Password from '../../../../utils/Password';
import customDBPasswordRule from '../../../../testUtil/mockApi/customDBPasswordRule';
import { mockGeneratedDBPasswordByCustomRule } from '../../../../testUtil/mockApi/customDBPasswordRule/data';

describe('provision/DatabaseAccount/BatchModifyPasswordModal', () => {
  let authBatchUpdateDBAccountPasswordSpy: jest.SpyInstance;
  let authGetCustomDBPasswordRuleSpy: jest.SpyInstance;

  beforeEach(() => {
    authBatchUpdateDBAccountPasswordSpy =
      dbAccountService.authBatchUpdateDBAccountPassword();
    authGetCustomDBPasswordRuleSpy =
      customDBPasswordRule.authGetCustomDBPasswordRule();
    auth.mockAllApi();
    mockUseCurrentProject();

    jest.useFakeTimers();

    jest
      .spyOn(Password, 'generateDBPasswordByCustomCharType')
      .mockReturnValue(mockGeneratedDBPasswordByCustomRule);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (
    defaultVisible = true,
    selectData: IListDBAccount[] = [dbAccountMockData[0], dbAccountMockData[1]]
  ) => {
    return superRender(<BatchModifyPasswordModal />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(DatabaseAccountModalStatus, {
            [ModalName.DatabaseAccountBatchModifyPasswordModal]: defaultVisible
          });
          set(DatabaseAccountBatchActionSelectedData, selectData);
        }
      }
    });
  };

  it('render init snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('批量修改密码')).toBeInTheDocument();
    expect(authGetCustomDBPasswordRuleSpy).toHaveBeenCalledTimes(1);
  });

  it('render batch modify password', async () => {
    document.execCommand = jest.fn();
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getBySelector('#effective_time_day')).toHaveValue('30');

    fireEvent.click(screen.getByText('批量生成密码'));
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authBatchUpdateDBAccountPasswordSpy).toHaveBeenCalledTimes(1);
    expect(authBatchUpdateDBAccountPasswordSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_password: {
        passwords: [
          {
            db_account_password: mockGeneratedDBPasswordByCustomRule,
            db_account_uid: '1795004057392254976'
          },
          {
            db_account_password: mockGeneratedDBPasswordByCustomRule,
            db_account_uid: '1794998179528183808'
          }
        ],
        renewal_effective_time_day: 30,
        password_expiration_policy: 'expiration_lock'
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('批量修改密码成功')).toBeInTheDocument();
    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Account_Management_List_Table
    );
  });

  it('render batch modify password request failed', async () => {
    authBatchUpdateDBAccountPasswordSpy.mockClear();
    authBatchUpdateDBAccountPasswordSpy.mockImplementation(() =>
      createSpyFailResponse({})
    );
    document.execCommand = jest.fn();
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getBySelector('#effective_time_day')).toHaveValue('30');

    fireEvent.click(screen.getByText('批量生成密码'));
    await act(async () => jest.advanceTimersByTime(100));

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authBatchUpdateDBAccountPasswordSpy).toHaveBeenCalledTimes(1);
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
      fireEvent.change(getBySelector('#passwords_0_password'), {
        target: { value: '123' }
      });
      await jest.advanceTimersByTime(100);
    });

    await act(async () => {
      fireEvent.change(getBySelector('#passwords_0_confirm_password'), {
        target: { value: '234' }
      });
      await jest.advanceTimersByTime(100);
    });
    expect(rejectSpy).toHaveBeenCalled();
    expect(rejectSpy).toHaveBeenCalledWith(new Error('您输入的两个密码不匹配'));
  });
});
