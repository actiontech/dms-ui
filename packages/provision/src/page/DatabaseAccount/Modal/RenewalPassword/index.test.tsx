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
import RenewalPasswordModal from '.';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';

describe('provision/DatabaseAccount/RenewalPasswordModal', () => {
  let authUpdateDBAccountSpy: jest.SpyInstance;

  const mockDatabaseAccountInfo = dbAccountMockData[0];

  beforeEach(() => {
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
    return superRender(<RenewalPasswordModal />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(DatabaseAccountModalStatus, {
            [ModalName.DatabaseAccountRenewalPasswordModal]: defaultVisible
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
    expect(screen.getByText('续用当前密码')).toBeInTheDocument();
  });

  it('render renewal password', async () => {
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(getBySelector('#renewalTime'), {
      target: { value: 11 }
    });

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(authUpdateDBAccountSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_account_uid: mockDatabaseAccountInfo.db_account_uid,
      db_account: {
        renewal_effective_time_day: 11
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('续用当前密码成功')).toBeInTheDocument();
    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Account_Management_List_Table
    );
  });

  it('render renewal password request failed', async () => {
    authUpdateDBAccountSpy.mockClear();
    authUpdateDBAccountSpy.mockImplementation(() => createSpyFailResponse({}));
    const eventEmitterSpy = jest.spyOn(EventEmitter, 'emit');
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(getBySelector('#renewalTime'), {
      target: { value: 11 }
    });

    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authUpdateDBAccountSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('提 交').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitterSpy).not.toHaveBeenCalled();
    expect(screen.getByText('提 交').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(100));
  });
});
