import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import sqlManage from '../../../../../../../testUtils/mockApi/sqlManage';
import { useSelector, useDispatch } from 'react-redux';
import { ModalName } from '../../../../../../../data/ModalName';
import { sqleSuperRender } from '../../../../../../../testUtils/superRender';
import PushToCodingModal from '..';
import { sqlManageListData } from '../../../../../../../testUtils/mockApi/sqlManage/data';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  SqlManageCodingReqTypeEnum,
  SqlManageCodingReqPriorityEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import EventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('page/SqlManagement/PushToCodingModal', () => {
  let sendSqlManageSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    sendSqlManageSpy = sqlManage.sendSqlManage();
    mockUseCurrentProject();

    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        sqlManagement: {
          modalStatus: {
            [ModalName.Push_To_Coding]: true
          },
          batchSelectSqlManagement: [sqlManageListData.data[0]]
        }
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });
  const customRender = () => sqleSuperRender(<PushToCodingModal />);

  it('render init snap', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render submit action', async () => {
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    customRender();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(sendSqlManageSpy).toHaveBeenCalledTimes(1);
    expect(sendSqlManageSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_manage_id_list: [sqlManageListData.data[0].id],
      coding_project_name: mockProjectInfo.projectName,
      type: SqlManageCodingReqTypeEnum.MISSION,
      priority: SqlManageCodingReqPriorityEnum.LOW
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('推送到其他平台成功'));
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(EmitterKey.Refresh_SQL_Management);
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Push_To_Coding,
        status: false
      }
    });
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementBatchSelectData',
      payload: null
    });
  });
});
