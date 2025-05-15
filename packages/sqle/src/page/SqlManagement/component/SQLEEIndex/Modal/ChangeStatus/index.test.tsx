import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import ChangeStatus from '.';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { ModalName } from '../../../../../../data/ModalName';
import { sqlManageListData } from '../../../../../../testUtils/mockApi/sqlManage/data';
import sqlManage from '../../../../../../testUtils/mockApi/sqlManage';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EventEmitter from '../../../../../../utils/EventEmitter';
import { useDispatch } from 'react-redux';
import EmitterKey from '../../../../../../data/EmitterKey';
import { BatchUpdateSqlManageReqStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('page/SqlManagement/ChangeStatus', () => {
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
    return sqleSuperRender(<ChangeStatus />, undefined, {
      initStore: {
        sqlManagement: {
          modalStatus: {
            [ModalName.Change_Status_Single]: data ?? true
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

  it('change status and submit data', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const submitRequest = sqlManage.batchUpdateSqlManage();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('变更状态为')).toBeInTheDocument();
    expect(screen.getByText('忽略')).toBeInTheDocument();
    const radioOptions = getAllBySelector('.ant-radio-input');
    expect(radioOptions.length).toBe(3);
    fireEvent.click(radioOptions?.[1]);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(submitRequest).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_manage_id_list: [sqlManageListData.data[0].id],
      status: BatchUpdateSqlManageReqStatusEnum.ignored
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('更新SQL状态成功')).toBeInTheDocument();
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Change_Status_Single,
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

  it('close modal by click button', async () => {
    customRender();
    fireEvent.click(screen.getByText('取 消'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Change_Status_Single,
        status: false
      }
    });
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementSelectData',
      payload: null
    });
  });
});
