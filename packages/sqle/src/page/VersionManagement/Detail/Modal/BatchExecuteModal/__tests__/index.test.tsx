import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import BatchExecuteModal from '../index';
import { superRender } from '../../../../../..//testUtils/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { ModalName } from '../../../../../../data/ModalName';
import EmitterKey from '../../../../../../data/EmitterKey';
import EventEmitter from '../../../../../../utils/EventEmitter';
import sqlVersion from '../../../../../../testUtils/mockApi/sql_version';
import { useParams } from 'react-router-dom';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
  };
});

describe('sqle/VersionManagement/Detail/BatchExecuteModal', () => {
  const dispatchSpy = jest.fn();
  let batchExecuteWorkflowsSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        versionManagement: {
          modalStatus: {
            [ModalName.Version_Management_Execute_Modal]: true
          },
          currentStageWorkflowList: [
            {
              desc: '',
              status: 'wait_for_execution',
              workflow_exec_time: '2024-07-11T07:11:15.631Z',
              workflow_id: '12345678',
              workflow_instances: [
                {
                  instance_schema: 'muscat',
                  instances_id: 'dead',
                  instances_name: 'pension'
                }
              ],
              workflow_name: 'workflow3',
              workflow_release_status: 'wait_for_release',
              workflow_sequence: 89
            }
          ]
        }
      });
    });
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    batchExecuteWorkflowsSpy = sqlVersion.mockBatchExecuteWorkflowsV1();
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({ versionId: '123' });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap shot', async () => {
    const { baseElement } = superRender(<BatchExecuteModal />);
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('批量上线工单')).toBeInTheDocument();
  });

  it('render batch execute workflow', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    superRender(<BatchExecuteModal />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(batchExecuteWorkflowsSpy).toHaveBeenCalledTimes(1);
    expect(batchExecuteWorkflowsSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_version_id: '123',
      workflow_ids: ['12345678']
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Version_Management_Detail
    );
    expect(screen.getByText('批量上线工单成功')).toBeInTheDocument();
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'versionManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Version_Management_Execute_Modal,
        status: false
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'versionManagement/updateSelectVersionStageWorkflowList',
      payload: {
        workflowList: null
      }
    });
  });
});
