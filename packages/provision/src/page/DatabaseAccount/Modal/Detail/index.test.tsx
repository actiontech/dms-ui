import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import dbAccountService from '../../../../testUtil/mockApi/dbAccountService';
import { dbAccountMockData } from '../../../../testUtil/mockApi/dbAccountService/data';
import auth from '../../../../testUtil/mockApi/auth';
import {
  DatabaseAccountModalStatus,
  DatabaseAccountSelectData
} from '../../../../store/databaseAccount';
import { ModalName } from '../../../../data/enum';
import DatabaseAccountDetailModal from '.';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { databaseAccountDetailMockData } from '../../../../testUtil/mockApi/dbAccountService/data';

describe('provision/DatabaseAccount/DatabaseAccountDetailModal', () => {
  let authGetDBAccountSpy: jest.SpyInstance;

  beforeEach(() => {
    authGetDBAccountSpy = dbAccountService.authGetDBAccount();
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
    selectData: IListDBAccount = dbAccountMockData[0]
  ) => {
    return superRender(<DatabaseAccountDetailModal />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(DatabaseAccountModalStatus, {
            [ModalName.DatabaseAccountDetailModal]: defaultVisible
          });
          set(DatabaseAccountSelectData, selectData);
        }
      }
    });
  };

  it('render init snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authGetDBAccountSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('账号详情')).toBeInTheDocument();
    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(100));
  });

  it('render click copy password', async () => {
    jest.spyOn(window, 'prompt').mockImplementation(() => 'copy link pwd');
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));

    const copyBtn = getBySelector('.anticon-copy', baseElement);
    fireEvent.click(copyBtn);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render click copy connection_cmd', async () => {
    const execCommandFn = jest.fn();
    document.execCommand = execCommandFn;
    customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.click(screen.getByText('复制连接串'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(execCommandFn).toHaveBeenCalled();
    expect(screen.queryByText('复制成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(500));
    execCommandFn.mockRestore();
  });

  it('render click copy all', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.click(screen.getByText('全文复制'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.queryByText('复制成功')).toBeInTheDocument();
  });

  it('render click copy all when data is null', async () => {
    authGetDBAccountSpy.mockClear();
    authGetDBAccountSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...databaseAccountDetailMockData,
          auth_users: null,
          db_service: null,
          account_info: null,
          data_permissions: [
            {
              data_objects: null,
              data_operation_sets: null
            }
          ]
        }
      })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.click(screen.getByText('全文复制'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.queryByText('复制成功')).toBeInTheDocument();
  });
});
