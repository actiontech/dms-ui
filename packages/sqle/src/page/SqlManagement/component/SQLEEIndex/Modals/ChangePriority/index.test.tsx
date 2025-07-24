import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import ChangePriority from '.';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { ModalName } from '../../../../../../data/ModalName';
import { sqlManageListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlManage/data';
import sqlManage from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlManage';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EventEmitter from '../../../../../../utils/EventEmitter';
import { useDispatch } from 'react-redux';
import EmitterKey from '../../../../../../data/EmitterKey';
import { BatchUpdateSqlManageReqPriorityEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('page/SqlManagement/ChangePriority', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    sqlManage.mockAllApi();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (data?: boolean) => {
    return sqleSuperRender(<ChangePriority />, undefined, {
      initStore: {
        sqlManagement: {
          modalStatus: {
            [ModalName.Change_SQL_Priority]: data ?? true
          },
          selectSqlManagement: sqlManageListData.data[0]
        }
      }
    });
  };

  it('render modal when not open', () => {
    const { baseElement } = customRender(false);
    expect(baseElement).toMatchSnapshot();
  });

  it('change priority and submit data', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const submitRequest = sqlManage.batchUpdateSqlManage();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));

    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('变更优先级为')).toBeInTheDocument();
    const radioOptions = getAllBySelector('.ant-radio-input');
    expect(radioOptions.length).toBe(2);
    fireEvent.click(radioOptions?.[1]);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(submitRequest).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_manage_id_list: [sqlManageListData.data[0].id],
      priority: BatchUpdateSqlManageReqPriorityEnum.UNKNOWN
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('变更SQL优先级成功')).toBeInTheDocument();
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Change_SQL_Priority,
        status: false
      }
    });
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementSelectData',
      payload: null
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_SQL_Management
    );
  });

  it('close modal by click button', () => {
    customRender();
    fireEvent.click(screen.getByText('取 消'));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Change_SQL_Priority,
        status: false
      }
    });
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementSelectData',
      payload: null
    });
  });
});
