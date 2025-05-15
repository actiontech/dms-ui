import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import AssignmentBatch from '.';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import user from '../../../../../../testUtils/mockApi/user';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { ModalName } from '../../../../../../data/ModalName';
import { sqlManageListData } from '../../../../../../testUtils/mockApi/sqlManage/data';
import sqlManage from '../../../../../../testUtils/mockApi/sqlManage';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { userTipListData } from '../../../../../../testUtils/mockApi/user/data';
import EventEmitter from '../../../../../../utils/EventEmitter';
import { useDispatch } from 'react-redux';
import EmitterKey from '../../../../../../data/EmitterKey';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('page/SqlManagement/AssignmentBatch', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    user.mockAllApi();
    sqlManage.mockAllApi();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (data?: boolean) => {
    return sqleSuperRender(<AssignmentBatch />, undefined, {
      initStore: {
        sqlManagement: {
          modalStatus: {
            [ModalName.Assignment_Member_Batch]: data ?? true
          },
          batchSelectSqlManagement: [sqlManageListData.data[0]]
        }
      }
    });
  };

  it('render modal when not open', () => {
    const { baseElement } = customRender(false);
    expect(baseElement).toMatchSnapshot();
  });

  it('update batch assign and submit change', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const optionRequest = user.getUserTipList();
    const submitRequest = sqlManage.batchUpdateSqlManage();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(optionRequest).toHaveBeenCalledWith({
      filter_project: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('批量指派')).toBeInTheDocument();
    fireEvent.mouseDown(getBySelector('#assignees'));
    await act(async () => jest.advanceTimersByTime(300));
    const options = getAllBySelector('.ant-select-item-option');
    fireEvent.click(options[0]);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(submitRequest).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_manage_id_list: [sqlManageListData.data[0].id],
      assignees: [userTipListData[0].user_id]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('批量指派负责人成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Assignment_Member_Batch,
        status: false
      }
    });
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementBatchSelectData',
      payload: null
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_SQL_Management
    );
  });

  it('close modal by click button', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('批量指派')).toBeInTheDocument();
    fireEvent.click(screen.getByText('取 消'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Assignment_Member_Batch,
        status: false
      }
    });
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementBatchSelectData',
      payload: null
    });
  });
});
