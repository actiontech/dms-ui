import RoleDetail from '..';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { act, fireEvent, screen } from '@testing-library/react';
import dbRole from '../../../../../testUtil/mockApi/dbRole';
import { mockDBRoleData } from '../../../../../testUtil/mockApi/dbRole/data';
import { IListDBRole } from '@actiontech/shared/lib/api/provision/service/common';
import {
  DatabaseRoleFilteredDBServiceID,
  DatabaseRoleFilteredDBServiceName,
  DatabaseRoleModalStatus,
  DatabaseRoleSelectData
} from '../../../../../store/databaseRole';
import { ModalName } from '../../../../../data/enum';

describe('page/DatabaseRole/Modal/RoleDetail', () => {
  let authDBRoleDetailSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    authDBRoleDetailSpy = dbRole.authDBRoleDetail();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const customRender = (
    defaultVisible = true,
    selectData: IListDBRole = mockDBRoleData[0]
  ) => {
    return superRender(<RoleDetail />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(DatabaseRoleModalStatus, {
            [ModalName.DatabaseRoleDetailModal]: defaultVisible
          });
          set(DatabaseRoleSelectData, selectData);
          set(DatabaseRoleFilteredDBServiceID, '123');
          set(DatabaseRoleFilteredDBServiceName, 'oracle-1');
        }
      }
    });
  };

  it('render init snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(authDBRoleDetailSpy).toHaveBeenCalledTimes(1);
  });

  it('render close modal', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
  });
});
