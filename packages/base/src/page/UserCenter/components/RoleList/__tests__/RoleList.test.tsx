import userCenter from '../../../../../testUtils/mockApi/userCenter';
import { roleList } from '../../../../../testUtils/mockApi/userCenter/data';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { act, screen, cleanup, fireEvent } from '@testing-library/react';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import RoleList from '../List';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { IListRole } from '@actiontech/shared/lib/api/base/service/common';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { UserCenterListEnum } from '../../../index.enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('base/UserCenter/RoleList', () => {
  let roleListSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    roleListSpy = userCenter.getRoleList();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render role table', async () => {
    const { baseElement } = renderWithReduxAndTheme(
      <RoleList activePage={UserCenterListEnum.role_list} />
    );

    await act(async () => jest.advanceTimersByTime(3300));
    expect(roleListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('test role 1')).toBeInTheDocument();
    expect(screen.getAllByText('编 辑')).toHaveLength(3);
    expect(screen.getAllByText('删 除')).toHaveLength(3);
  });

  it('should render empty tips when request not success', async () => {
    roleListSpy.mockClear();
    roleListSpy.mockImplementation(() => createSpyErrorResponse({ data: [] }));
    const { baseElement } = renderWithReduxAndTheme(
      <RoleList activePage={UserCenterListEnum.role_list} />
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    const element = queryBySelector('.ant-table-placeholder', baseElement);
    expect(element).toBeInTheDocument();
  });

  it('should refresh role table when change current page', async () => {
    roleListSpy.mockClear();
    const total = 40;
    const mockData: IListRole[] = [];
    for (let i = 0; i < total; i++) {
      mockData.push({
        uid: `1001${i}`,
        name: `test${i}`
      });
    }
    roleListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockData
      })
    );
    const { baseElement } = renderWithReduxAndTheme(
      <RoleList activePage={UserCenterListEnum.role_list} />
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('共 40 条数据')).toBeInTheDocument();
    const element = queryBySelector('.ant-pagination-item-2', baseElement);
    await act(async () => {
      fireEvent.click(element!);
      await jest.advanceTimersByTime(300);
    });

    expect(roleListSpy).toHaveBeenCalledTimes(2);
    expect(baseElement).toMatchSnapshot();
  });

  it('should refresh role table when emit "DMS_Refresh_User_Center_List" event', async () => {
    renderWithReduxAndTheme(
      <RoleList activePage={UserCenterListEnum.role_list} />
    );
    await act(async () =>
      EventEmitter.emit(EmitterKey.DMS_Refresh_User_Center_List)
    );
    expect(roleListSpy).toHaveBeenCalledTimes(2);
  });

  it('should send delete role request', async () => {
    roleListSpy.mockClear();
    roleListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [roleList[0]]
      })
    );
    const deleteRoleSpy = userCenter.deleteRole();
    const roleName = roleList[0].name;
    renderWithReduxAndTheme(
      <RoleList activePage={UserCenterListEnum.role_list} />
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(roleListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText(`确认要删除角色 "${roleName}"?`)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(deleteRoleSpy).toHaveBeenCalledTimes(1);
    expect(deleteRoleSpy).toHaveBeenCalledWith({
      role_uid: roleList[0].uid
    });
    expect(screen.getByText(`删除角色 "${roleName}" 成功`)).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3600));
    expect(roleListSpy).toHaveBeenCalled();
  });

  it('should dispatch action when edit role info', async () => {
    roleListSpy.mockClear();
    roleListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [roleList[0]]
      })
    );
    renderWithReduxAndTheme(
      <RoleList activePage={UserCenterListEnum.role_list} />
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(roleListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'userCenter/updateSelectRole',
      payload: {
        role: roleList[0]
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Role,
        status: true
      }
    });
  });
});
