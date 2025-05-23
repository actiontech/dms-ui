import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import VersionDetail from '../index';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import sqlVersion from '@actiontech/shared/lib/testUtil/mockApi/sqle/sql_version';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import task from '@actiontech/shared/lib/testUtil/mockApi/sqle/task';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import { useSelector, useDispatch } from 'react-redux';
import { mockReactFlow } from '../mockData/mockReactFlow';
import { useNavigate } from 'react-router-dom';
import {
  getSqlVersionDetailV1MockData,
  mockVersionDetailWithoutWorkflowData,
  mockVersionDetailWhenWorkflowStatusISExecFailed,
  mockVersionDetailAllowExecWorkflowOrderData,
  mockVersionDetailAllowReleaseWorkflowOrderData
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/sql_version/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { SystemRole } from '@actiontech/shared/lib/enum';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('sqle/VersionManagement/Detail', () => {
  let getInstanceTipListSpy: jest.SpyInstance;
  let getSqlVersionDetailSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();
  const mockVersionData = getSqlVersionDetailV1MockData.data;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
    getInstanceTipListSpy = instance.getInstanceTipList();
    getSqlVersionDetailSpy = sqlVersion.mockGetSqlVersionDetailV1();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        versionManagement: {
          modalStatus: {},
          currentStageWorkflowList: []
        },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      });
    });
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);

    execWorkflow.getWorkflow();
    task.getAuditTask();
    mockReactFlow();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = sqleSuperRender(<VersionDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(getSqlVersionDetailSpy).toHaveBeenCalledTimes(1);
  });

  it('render version detail when no work order associated', async () => {
    getSqlVersionDetailSpy.mockClear();
    getSqlVersionDetailSpy.mockImplementation(() =>
      createSpySuccessResponse(mockVersionDetailWithoutWorkflowData)
    );
    const { baseElement } = sqleSuperRender(<VersionDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getAllBySelector('.empty-card').length).toBe(2);
  });

  it('render create new workflow order', async () => {
    sqleSuperRender(<VersionDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.queryAllByText('创建新工单')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'sqlExecWorkflow/updateVersionFirstStageInstances',
      payload: {
        versionFirstStageInstances:
          mockVersionData?.sql_version_stage_detail?.[0].stage_instances
      }
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${
        mockProjectInfo.projectID
      }/exec-workflow/create?versionId=${
        mockVersionData?.sql_version_id
      }&versionName=${encodeURIComponent(mockVersionData?.version ?? '')}`
    );
  });

  it('render associate workflow order', async () => {
    sqleSuperRender(<VersionDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.queryAllByText('添加已有工单')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'versionManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Version_Management_Associate_Workflow_Modal,
        status: true
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'versionManagement/updateSelectVersionStageId',
      payload: {
        stageId: 79
      }
    });
  });

  it('render offline executed', async () => {
    getSqlVersionDetailSpy.mockClear();
    getSqlVersionDetailSpy.mockImplementation(() =>
      createSpySuccessResponse(mockVersionDetailWhenWorkflowStatusISExecFailed)
    );
    const { baseElement } = sqleSuperRender(<VersionDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('上线失败')).toBeInTheDocument();
    expect(screen.getByText('重 试')).toBeInTheDocument();
    expect(screen.getByText('已线下执行')).toBeInTheDocument();

    fireEvent.click(screen.getByText('已线下执行'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'versionManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Version_Management_Offline_Execute_Modal,
        status: true
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'versionManagement/updateSelectWorkflowId',
      payload: {
        workflowId: '123456'
      }
    });
  });

  it('render workflow order retry', async () => {
    getSqlVersionDetailSpy.mockClear();
    getSqlVersionDetailSpy.mockImplementation(() =>
      createSpySuccessResponse(mockVersionDetailWhenWorkflowStatusISExecFailed)
    );
    const { baseElement } = sqleSuperRender(<VersionDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('重 试'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'versionManagement/updateSelectWorkflowId',
      payload: {
        workflowId: '123456'
      }
    });
    expect(screen.getByText('修改审核语句')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render batch execute workflow button is disabled', async () => {
    getSqlVersionDetailSpy.mockClear();
    getSqlVersionDetailSpy.mockImplementation(() =>
      createSpySuccessResponse(mockVersionDetailWhenWorkflowStatusISExecFailed)
    );
    sqleSuperRender(<VersionDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('上线').closest('button')).toBeDisabled();
    expect(screen.getByText('发布').closest('button')).toBeDisabled();
  });

  it('render batch execute workflow', async () => {
    getSqlVersionDetailSpy.mockClear();
    getSqlVersionDetailSpy.mockImplementation(() =>
      createSpySuccessResponse(mockVersionDetailAllowExecWorkflowOrderData)
    );
    sqleSuperRender(<VersionDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('上线'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'versionManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Version_Management_Execute_Modal,
        status: true
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'versionManagement/updateSelectVersionStageWorkflowList',
      payload: {
        workflowList: [
          mockVersionDetailAllowExecWorkflowOrderData.data
            .sql_version_stage_detail?.[0]?.workflow_details[2]
        ]
      }
    });
  });

  it('render batch release workflow', async () => {
    getSqlVersionDetailSpy.mockClear();
    getSqlVersionDetailSpy.mockImplementation(() =>
      createSpySuccessResponse(mockVersionDetailAllowReleaseWorkflowOrderData)
    );
    sqleSuperRender(<VersionDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('发布'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(dispatchSpy).toHaveBeenCalledTimes(4);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'versionManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Version_Management_Release_Modal,
        status: true
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'versionManagement/updateSelectVersionStageId',
      payload: {
        stageId: 79
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(4, {
      type: 'versionManagement/updateSelectVersionStageWorkflowList',
      payload: {
        workflowList: [
          mockVersionDetailAllowReleaseWorkflowOrderData.data
            .sql_version_stage_detail?.[0]?.workflow_details[2]
        ]
      }
    });
  });

  it('render disable batch release workflow button when current user has not next stage service permission', async () => {
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.auditAdministrator]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: false,
        [SystemRole.certainProjectManager]: false
      }
    });
    getSqlVersionDetailSpy.mockClear();
    getSqlVersionDetailSpy.mockImplementation(() =>
      createSpySuccessResponse(mockVersionDetailAllowReleaseWorkflowOrderData)
    );
    sqleSuperRender(<VersionDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('发布').closest('button')).toBeDisabled();
  });

  it('render refresh version detail', async () => {
    sqleSuperRender(<VersionDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSqlVersionDetailSpy).toHaveBeenCalledTimes(1);
    await act(async () => {
      EventEmitter.emit(EmitterKey.Refresh_Version_Management_Detail);
      async () => jest.advanceTimersByTime(0);
    });
    expect(getSqlVersionDetailSpy).toHaveBeenCalledTimes(2);
  });
});
