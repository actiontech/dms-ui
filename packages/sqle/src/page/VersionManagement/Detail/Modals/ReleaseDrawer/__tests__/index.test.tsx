import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import AssociateWorkflowModal from '../index';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { ModalName } from '../../../../../../data/ModalName';
import EmitterKey from '../../../../../../data/EmitterKey';
import EventEmitter from '../../../../../../utils/EventEmitter';
import sqlVersion from '@actiontech/shared/lib/testUtil/mockApi/sqle/sql_version';
import { useParams } from 'react-router-dom';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import {
  instanceTipsMockData,
  instanceInfoMockData,
  instanceSchemasMockData
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { ResponseCode } from '@actiontech/shared/lib/enum';

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
  let getDependenciesBetweenStageInstanceSpy: jest.SpyInstance;
  let batchReleaseWorkflowsSpy: jest.SpyInstance;
  // instance options
  let getInstanceTipListSpy: jest.SpyInstance;
  // instance detail
  let getInstanceSpy: jest.SpyInstance;
  // instance schema
  let getInstanceSchemasSpy: jest.SpyInstance;
  let batchCheckInstanceIsConnectableByNameSpy: jest.SpyInstance;

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        versionManagement: {
          modalStatus: {
            [ModalName.Version_Management_Release_Modal]: true
          },
          currentStageWorkflowList: [
            {
              desc: '',
              status: 'wait_for_execution',
              workflow_exec_time: '2024-07-11T07:11:15.631Z',
              workflow_id: '12345678',
              workflow_instances: [
                {
                  instance_schema: '',
                  instances_id: instanceTipsMockData[0].instance_id,
                  instances_name: instanceTipsMockData[0].instance_name
                }
              ],
              workflow_name: 'workflow3',
              workflow_release_status: 'wait_for_release',
              workflow_sequence: 89
            }
          ],
          stageId: 11
        }
      });
    });
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    getDependenciesBetweenStageInstanceSpy =
      sqlVersion.mockGetDependenciesBetweenStageInstanceV1();
    batchReleaseWorkflowsSpy = sqlVersion.mockBatchReleaseWorkflowsV1();
    getInstanceTipListSpy = instance.getInstanceTipList();
    getInstanceSpy = instance.getInstance();
    getInstanceSchemasSpy = instance.getInstanceSchemas();
    batchCheckInstanceIsConnectableByNameSpy =
      instance.batchCheckInstanceIsConnectableByName();
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({ versionId: '123' });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap shot', async () => {
    const { baseElement } = sqleSuperRender(<AssociateWorkflowModal />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('批量发布工单')).toBeInTheDocument();
    expect(getDependenciesBetweenStageInstanceSpy).toHaveBeenCalledTimes(1);
    expect(getDependenciesBetweenStageInstanceSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_version_id: '123',
      sql_version_stage_id: '11'
    });
  });

  it('render release form  default value when next stage instance has only one', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = sqleSuperRender(<AssociateWorkflowModal />);
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDependenciesBetweenStageInstanceSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: instanceTipsMockData[1].instance_name
    });
    expect(getInstanceSchemasSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceSchemasSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: instanceTipsMockData[1].instance_name
    });
    expect(
      screen.queryAllByText(
        `${instanceTipsMockData[1].instance_name}(${instanceTipsMockData[1].host}:${instanceTipsMockData[1].port})`
      ).length
    ).toBe(2);
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(batchReleaseWorkflowsSpy).toHaveBeenCalledTimes(1);
    expect(batchReleaseWorkflowsSpy).toHaveBeenCalledWith({
      project_name: 'default',
      release_workflows: [
        {
          target_release_instances: [
            {
              instance_id: instanceTipsMockData[0].instance_id,
              instance_schema: '',
              target_instance_id: instanceTipsMockData[1].instance_id,
              target_instance_name: instanceTipsMockData[1].instance_name,
              target_instance_schema: undefined
            }
          ],
          workflow_id: '12345678'
        }
      ],
      sql_version_id: '123'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Version_Management_Detail
    );
    expect(screen.getByText('批量发布工单成功')).toBeInTheDocument();
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'versionManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Version_Management_Release_Modal,
        status: false
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'versionManagement/updateSelectVersionStageId',
      payload: {
        stageId: null
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'versionManagement/updateSelectVersionStageWorkflowList',
      payload: {
        workflowList: null
      }
    });
  });

  it('render release form when next stage has several instance', async () => {
    getDependenciesBetweenStageInstanceSpy.mockClear();
    getDependenciesBetweenStageInstanceSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            next_stage_instance_id: instanceTipsMockData[1].instance_id,
            next_stage_instance_name: instanceTipsMockData[1].instance_name,
            stage_instance_id: instanceTipsMockData[0].instance_id,
            stage_instance_name: instanceTipsMockData[0].instance_name
          },
          {
            next_stage_instance_id: instanceTipsMockData[2].instance_id,
            next_stage_instance_name: instanceTipsMockData[2].instance_name,
            stage_instance_id: instanceTipsMockData[0].instance_id,
            stage_instance_name: instanceTipsMockData[0].instance_name
          }
        ]
      })
    );
    getInstanceSpy.mockClear();
    getInstanceSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...instanceInfoMockData,
          rule_template: {
            name: 'mysql',
            is_global_rule_template: true
          }
        }
      })
    );
    const { baseElement } = sqleSuperRender(<AssociateWorkflowModal />);
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDependenciesBetweenStageInstanceSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceSpy).toHaveBeenCalledTimes(0);
    expect(getInstanceSchemasSpy).toHaveBeenCalledTimes(0);
    fireEvent.mouseDown(
      getBySelector(
        '#release_workflows_0_target_release_instances_0_target_instance_id'
      )
    );
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(
      screen.getByText(
        `${instanceTipsMockData[2].instance_name}(${instanceTipsMockData[2].host}:${instanceTipsMockData[2].port})`
      )
    );
    await act(async () => jest.advanceTimersByTime(0));
    expect(getInstanceSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: instanceTipsMockData[2].instance_name
    });
    expect(getInstanceSchemasSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceSchemasSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: instanceTipsMockData[2].instance_name
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(
      getBySelector(
        '#release_workflows_0_target_release_instances_0_target_instance_schema'
      )
    );
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(
      getBySelector(`div[title="${instanceSchemasMockData[0]}"]`)
    );
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(batchReleaseWorkflowsSpy).toHaveBeenCalledTimes(1);
    expect(batchReleaseWorkflowsSpy).toHaveBeenCalledWith({
      project_name: 'default',
      release_workflows: [
        {
          target_release_instances: [
            {
              instance_id: instanceTipsMockData[0].instance_id,
              instance_schema: '',
              target_instance_id: instanceTipsMockData[2].instance_id,
              target_instance_name: instanceTipsMockData[2].instance_name,
              target_instance_schema: instanceSchemasMockData[0]
            }
          ],
          workflow_id: '12345678'
        }
      ],
      sql_version_id: '123'
    });
  });

  it('render release request return BatchTaskNotFullyCompleted code', async () => {
    batchReleaseWorkflowsSpy.mockClear();
    batchReleaseWorkflowsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        code: ResponseCode.BatchTaskNotFullyCompleted
      })
    );
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    sqleSuperRender(<AssociateWorkflowModal />);
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDependenciesBetweenStageInstanceSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceSchemasSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(batchReleaseWorkflowsSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Version_Management_Detail
    );
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'versionManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Version_Management_Release_Modal,
        status: false
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'versionManagement/updateSelectVersionStageId',
      payload: {
        stageId: null
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'versionManagement/updateSelectVersionStageWorkflowList',
      payload: {
        workflowList: null
      }
    });
  });

  it('render test instance connection when instance is connectable', async () => {
    batchCheckInstanceIsConnectableByNameSpy.mockClear();
    batchCheckInstanceIsConnectableByNameSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            instance_name: instanceTipsMockData[1].instance_name,
            is_instance_connectable: true
          }
        ]
      })
    );
    const { baseElement } = sqleSuperRender(<AssociateWorkflowModal />);
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText('测试数据源连通性').closest('button')
    ).toBeDisabled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDependenciesBetweenStageInstanceSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('测试数据源连通性').closest('button')
    ).not.toBeDisabled();
    fireEvent.click(screen.getByText('测试数据源连通性'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(batchCheckInstanceIsConnectableByNameSpy).toHaveBeenCalledTimes(1);
    expect(batchCheckInstanceIsConnectableByNameSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instances: [{ name: instanceTipsMockData[1].instance_name }]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('数据源连通性测试成功')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render test instance connection when instance is not connectable', async () => {
    batchCheckInstanceIsConnectableByNameSpy.mockClear();
    batchCheckInstanceIsConnectableByNameSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            instance_name: instanceTipsMockData[1].instance_name,
            is_instance_connectable: false,
            connect_error_message: '连接错误'
          }
        ]
      })
    );
    const { baseElement } = sqleSuperRender(<AssociateWorkflowModal />);
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText('测试数据源连通性').closest('button')
    ).toBeDisabled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDependenciesBetweenStageInstanceSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('测试数据源连通性').closest('button')
    ).not.toBeDisabled();
    fireEvent.click(screen.getByText('测试数据源连通性'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(batchCheckInstanceIsConnectableByNameSpy).toHaveBeenCalledTimes(1);
    expect(batchCheckInstanceIsConnectableByNameSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instances: [{ name: instanceTipsMockData[1].instance_name }]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('连接错误')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render test instance connection when not return result', async () => {
    batchCheckInstanceIsConnectableByNameSpy.mockClear();
    batchCheckInstanceIsConnectableByNameSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            instance_name: instanceTipsMockData[0].instance_name,
            is_instance_connectable: false,
            connect_error_message: '连接错误'
          }
        ]
      })
    );
    const { baseElement } = sqleSuperRender(<AssociateWorkflowModal />);
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText('测试数据源连通性').closest('button')
    ).toBeDisabled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDependenciesBetweenStageInstanceSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('测试数据源连通性').closest('button')
    ).not.toBeDisabled();
    fireEvent.click(screen.getByText('测试数据源连通性'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(batchCheckInstanceIsConnectableByNameSpy).toHaveBeenCalledTimes(1);
    expect(batchCheckInstanceIsConnectableByNameSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instances: [{ name: instanceTipsMockData[1].instance_name }]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
