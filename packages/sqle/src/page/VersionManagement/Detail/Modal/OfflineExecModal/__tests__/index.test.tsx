import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import OfflineExecModal from '../index';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { ModalName } from '../../../../../../data/ModalName';
import workflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EmitterKey from '../../../../../../data/EmitterKey';
import EventEmitter from '../../../../../../utils/EventEmitter';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('sqle/VersionManagement/Detail/OfflineExecModal', () => {
  const dispatchSpy = jest.fn();
  let batchCompleteWorkflowsSpy: jest.SpyInstance;
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        versionManagement: {
          modalStatus: {
            [ModalName.Version_Management_Offline_Execute_Modal]: true
          },
          workflowId: '123456',
          currentStageWorkflowList: []
        }
      });
    });
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    batchCompleteWorkflowsSpy = workflow.batchCompleteWorkflows();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap shot', async () => {
    const { baseElement } = sqleSuperRender(<OfflineExecModal />);
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('线下执行')).toBeInTheDocument();
  });

  it('render complete workflow', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    sqleSuperRender(<OfflineExecModal />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.change(getBySelector('#remarks'), {
      target: { value: 'test remarks' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(batchCompleteWorkflowsSpy).toHaveBeenCalledTimes(1);
    expect(batchCompleteWorkflowsSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_list: [
        {
          workflow_id: '123456',
          desc: 'test remarks'
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Version_Management_Detail
    );
    expect(screen.getByText('线下执行成功')).toBeInTheDocument();
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'versionManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Version_Management_Offline_Execute_Modal,
        status: false
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'versionManagement/updateSelectWorkflowId',
      payload: {
        workflowId: null
      }
    });
  });
});
