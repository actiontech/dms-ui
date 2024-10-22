import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import AssociateWorkflowModal from '../index';
import { superRender } from '../../../../../..//testUtils/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { ModalName } from '../../../../../../data/ModalName';
import EmitterKey from '../../../../../../data/EmitterKey';
import EventEmitter from '../../../../../../utils/EventEmitter';
import sqlVersion from '../../../../../../testUtils/mockApi/sql_version';
import { GetWorkflowsThatCanBeAssociatedToVersionV1MockData } from '../../../../../../testUtils/mockApi/sql_version/data';
import { useParams } from 'react-router-dom';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

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

describe('sqle/VersionManagement/Detail/AssociateWorkflowModal', () => {
  const dispatchSpy = jest.fn();
  let batchAssociateWorkflowsWithVersionSpy: jest.SpyInstance;
  let getWorkflowsThatCanBeAssociatedToVersionSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        versionManagement: {
          modalStatus: {
            [ModalName.Version_Management_Associate_Workflow_Modal]: true
          },
          stageId: 11
        }
      });
    });
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    batchAssociateWorkflowsWithVersionSpy =
      sqlVersion.mockBatchAssociateWorkflowsWithVersionV1();
    getWorkflowsThatCanBeAssociatedToVersionSpy =
      sqlVersion.mockGetWorkflowsThatCanBeAssociatedToVersionV1();
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({ versionId: '123' });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap shot', async () => {
    const { baseElement } = superRender(<AssociateWorkflowModal />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('关联已有工单')).toBeInTheDocument();
    expect(getWorkflowsThatCanBeAssociatedToVersionSpy).toHaveBeenCalledTimes(
      1
    );
    expect(getWorkflowsThatCanBeAssociatedToVersionSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_version_id: '123',
      sql_version_stage_id: '11'
    });
  });

  it('render associate workflow', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    superRender(<AssociateWorkflowModal />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.ant-table-thead .ant-checkbox-input'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(batchAssociateWorkflowsWithVersionSpy).toHaveBeenCalledTimes(1);
    expect(batchAssociateWorkflowsWithVersionSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_version_id: '123',
      sql_version_stage_id: '11',
      workflow_ids:
        GetWorkflowsThatCanBeAssociatedToVersionV1MockData.data?.map(
          (i) => i.workflow_id
        )
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Version_Management_Detail
    );
    expect(screen.getByText('关联工单成功')).toBeInTheDocument();
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'versionManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Version_Management_Associate_Workflow_Modal,
        status: false
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'versionManagement/updateSelectVersionStageId',
      payload: {
        stageId: null
      }
    });
  });
});
