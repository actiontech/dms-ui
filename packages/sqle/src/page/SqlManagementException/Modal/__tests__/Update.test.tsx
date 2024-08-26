import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../../testUtils/customRender';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import UpdateSqlManagementException from '../Update';
import blacklist from '../../../../testUtils/mockApi/blacklist';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import {
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { BlacklistResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import instance from '../../../../testUtils/mockApi/instance';
import { instanceTipsMockData } from '../../../../testUtils/mockApi/instance/data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('slqe/SqlManagementException/UpdateSqlManagementException', () => {
  const dispatchSpy = jest.fn();
  let updateBlacklistSpy: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    updateBlacklistSpy = blacklist.updateBlacklist();
    getInstanceTipListSpy = instance.getInstanceTipList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (selectRow?: IBlacklistResV1) => {
    return superRender(<UpdateSqlManagementException />, undefined, {
      initStore: {
        sqlManagementException: {
          modalStatus: { [ModalName.Update_Sql_Management_Exception]: true },
          selectSqlManagementExceptionRecord: selectRow
        }
      }
    });
  };

  it('render update sql management exception when type is sql', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const mackSelectRow = {
      type: BlacklistResV1TypeEnum.sql,
      desc: 'desc',
      content: 'SELECT',
      blacklist_id: 1
    };
    const { baseElement } = customRender(mackSelectRow);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByLabelText('字符串')).toBeChecked();
    expect(screen.getByLabelText('描述')).toHaveValue(mackSelectRow.desc);
    expect(screen.getByLabelText('SQL语句')).toHaveValue(mackSelectRow.content);
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
    expect(updateBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(updateBlacklistSpy).toHaveBeenCalledWith({
      content: 'SELECT 1;',
      desc: 'test desc',
      type: BlacklistResV1TypeEnum.sql,
      project_name: mockProjectInfo.projectName,
      blacklist_id: `${mackSelectRow.blacklist_id}`
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Sql_Management_Exception,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Sql_management_Exception_List
    );
    expect(screen.getByText('提 交').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });

  it('render update sql management exception when type is fp_sql', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const mackSelectRow = {
      type: BlacklistResV1TypeEnum.fp_sql,
      desc: 'desc',
      content: 'SELECT',
      blacklist_id: 1
    };
    const { baseElement } = customRender(mackSelectRow);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByLabelText('SQL指纹')).toBeChecked();
    expect(screen.getByLabelText('描述')).toHaveValue(mackSelectRow.desc);
    expect(screen.getByLabelText('SQL语句')).toHaveValue(mackSelectRow.content);
    fireEvent.input(screen.getByLabelText('描述'), {
      target: { value: 'test desc' }
    });
    fireEvent.input(screen.getByLabelText('SQL语句'), {
      target: { value: 'SELECT 1;' }
    });
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(updateBlacklistSpy).toHaveBeenCalledWith({
      content: 'SELECT 1;',
      desc: 'test desc',
      type: BlacklistResV1TypeEnum.fp_sql,
      project_name: mockProjectInfo.projectName,
      blacklist_id: `${mackSelectRow.blacklist_id}`
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Sql_Management_Exception,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Sql_management_Exception_List
    );
  });

  it('render update sql management exception when type is ip', async () => {
    const mackSelectRow = {
      type: BlacklistResV1TypeEnum.ip,
      content: '127.0.0.1',
      blacklist_id: 1
    };
    const { baseElement } = customRender(mackSelectRow);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#ip')).toHaveValue(mackSelectRow.content);
    fireEvent.input(getBySelector('#ip'), {
      target: { value: '127.0.0.2' }
    });
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(updateBlacklistSpy).toHaveBeenCalledWith({
      content: '127.0.0.2',
      type: BlacklistResV1TypeEnum.ip,
      project_name: mockProjectInfo.projectName,
      blacklist_id: `${mackSelectRow.blacklist_id}`
    });
  });

  it('render update sql management exception when type is cidr', async () => {
    const mackSelectRow = {
      type: BlacklistResV1TypeEnum.cidr,
      content: '10.182.11',
      blacklist_id: 1
    };
    const { baseElement } = customRender(mackSelectRow);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#cidr')).toHaveValue(mackSelectRow.content);
    fireEvent.input(getBySelector('#cidr'), {
      target: { value: '10.182.12' }
    });
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(updateBlacklistSpy).toHaveBeenCalledWith({
      content: '10.182.12',
      type: BlacklistResV1TypeEnum.cidr,
      project_name: mockProjectInfo.projectName,
      blacklist_id: `${mackSelectRow.blacklist_id}`
    });
  });

  it('render update sql management exception when type is host', async () => {
    const mackSelectRow = {
      type: BlacklistResV1TypeEnum.host,
      content: '#',
      blacklist_id: 1
    };
    const { baseElement } = customRender(mackSelectRow);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#host')).toHaveValue(mackSelectRow.content);
    fireEvent.input(getBySelector('#host'), {
      target: { value: '/' }
    });
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(updateBlacklistSpy).toHaveBeenCalledWith({
      content: '/',
      type: BlacklistResV1TypeEnum.host,
      project_name: mockProjectInfo.projectName,
      blacklist_id: `${mackSelectRow.blacklist_id}`
    });
  });

  it('render update sql management exception when type is instance', async () => {
    const mackSelectRow = {
      type: BlacklistResV1TypeEnum.instance,
      content: `${instanceTipsMockData[0].instance_name} (${instanceTipsMockData[0].host}:${instanceTipsMockData[0].port})`,
      blacklist_id: 1
    };
    const { baseElement } = customRender(mackSelectRow);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(
      getBySelector(`span[title="${mackSelectRow.content}"]`)
    ).toBeInTheDocument();
    fireEvent.mouseDown(getBySelector('#instance'));
    fireEvent.click(
      screen.getByText(
        `${instanceTipsMockData[1].instance_name} (${instanceTipsMockData[1].host}:${instanceTipsMockData[1].port})`
      )
    );
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(updateBlacklistSpy).toHaveBeenCalledWith({
      content: instanceTipsMockData[1].instance_name,
      type: BlacklistResV1TypeEnum.instance,
      project_name: mockProjectInfo.projectName,
      blacklist_id: `${mackSelectRow.blacklist_id}`
    });
  });

  it('should close modal when click close button', async () => {
    const { baseElement } = customRender();
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Sql_Management_Exception,
        status: false
      }
    });
  });
});
