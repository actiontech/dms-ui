import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import CreateSqlManagementException from '../Create';
import blacklist from '../../../../testUtils/mockApi/blacklist';
import { CreateBlacklistReqV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import {
  queryBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import instance from '../../../../testUtils/mockApi/instance';
import { instanceTipsMockData } from '../../../../testUtils/mockApi/instance/data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('slqe/SqlManagementException/CreateSqlManagementException', () => {
  const dispatchSpy = jest.fn();
  let createBlacklistSpy: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlManagementException: {
          modalStatus: { [ModalName.Create_Sql_Management_Exception]: true }
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    createBlacklistSpy = blacklist.createBlacklist();
    getInstanceTipListSpy = instance.getInstanceTipList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render create sql management exception', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const mockCreated = jest.fn();
    const { baseElement } = renderWithReduxAndTheme(
      <CreateSqlManagementException onCreated={mockCreated} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('SQL指纹'));
    fireEvent.input(screen.getByLabelText('描述'), {
      target: { value: 'test desc' }
    });
    fireEvent.input(screen.getByLabelText('SQL语句'), {
      target: { value: 'SELECT 1;' }
    });
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(createBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(createBlacklistSpy).toHaveBeenCalledWith({
      content: 'SELECT 1;',
      desc: 'test desc',
      type: CreateBlacklistReqV1TypeEnum.fp_sql,
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/updateModalStatus',
      payload: {
        modalName: ModalName.Create_Sql_Management_Exception,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Sql_management_Exception_List
    );
    expect(mockCreated).toHaveBeenCalledTimes(1);
    expect(screen.getByText('提 交').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });

  it('render create sql management exception when type is ip', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = renderWithReduxAndTheme(
      <CreateSqlManagementException />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('IP'));
    fireEvent.input(getBySelector('#ip'), {
      target: { value: '127.0.0.1' }
    });
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(createBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(createBlacklistSpy).toHaveBeenCalledWith({
      content: '127.0.0.1',
      type: CreateBlacklistReqV1TypeEnum.ip,
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/updateModalStatus',
      payload: {
        modalName: ModalName.Create_Sql_Management_Exception,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Sql_management_Exception_List
    );
  });

  it('render create sql management exception when type is cidr', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = renderWithReduxAndTheme(
      <CreateSqlManagementException />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('网段'));
    fireEvent.input(getBySelector('#cidr'), {
      target: { value: '192.168.21' }
    });
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(createBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(createBlacklistSpy).toHaveBeenCalledWith({
      content: '192.168.21',
      type: CreateBlacklistReqV1TypeEnum.cidr,
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/updateModalStatus',
      payload: {
        modalName: ModalName.Create_Sql_Management_Exception,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Sql_management_Exception_List
    );
  });

  it('render create sql management exception when type is host', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = renderWithReduxAndTheme(
      <CreateSqlManagementException />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('主机名'));
    fireEvent.input(getBySelector('#host'), {
      target: { value: '/' }
    });
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(createBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(createBlacklistSpy).toHaveBeenCalledWith({
      content: '/',
      type: CreateBlacklistReqV1TypeEnum.host,
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/updateModalStatus',
      payload: {
        modalName: ModalName.Create_Sql_Management_Exception,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Sql_management_Exception_List
    );
  });

  it('render create sql management exception when type is instance', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = renderWithReduxAndTheme(
      <CreateSqlManagementException />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('数据源'));
    fireEvent.mouseDown(getBySelector('#instance'));
    fireEvent.click(
      screen.getByText(
        `${instanceTipsMockData[0].instance_name} (${instanceTipsMockData[0].host}:${instanceTipsMockData[0].port})`
      )
    );
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(createBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(createBlacklistSpy).toHaveBeenCalledWith({
      content: instanceTipsMockData[0].instance_name,
      type: CreateBlacklistReqV1TypeEnum.instance,
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/updateModalStatus',
      payload: {
        modalName: ModalName.Create_Sql_Management_Exception,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Sql_management_Exception_List
    );
  });

  it('should close modal when click close button', async () => {
    const { baseElement } = renderWithReduxAndTheme(
      <CreateSqlManagementException />
    );
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/updateModalStatus',
      payload: {
        modalName: ModalName.Create_Sql_Management_Exception,
        status: false
      }
    });
  });
});
