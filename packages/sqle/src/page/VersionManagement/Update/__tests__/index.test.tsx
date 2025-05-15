import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import UpdateVersion from '..';
import sqlVersion from '../../../../testUtils/mockApi/sql_version';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import instance from '../../../../testUtils/mockApi/instance';
import { instanceTipsMockData } from '../../../../testUtils/mockApi/instance/data';
import { useParams } from 'react-router-dom';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
  };
});

describe('sqle/VersionManagement/Create', () => {
  let updateSqlVersionV1: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;
  let getSqlVersionDetailV1: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const versionId = 1;

  beforeEach(() => {
    jest.useFakeTimers();
    updateSqlVersionV1 = sqlVersion.mockUpdateSqlVersionV1();
    getSqlVersionDetailV1 = sqlVersion.mockGetSqlVersionDetailV1();
    getInstanceTipListSpy = instance.getInstanceTipList();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
    useParamsMock.mockReturnValue({ versionId });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const mockNoWorkflowVersionDetail = {
    data: {
      sql_version_id: versionId,
      version: 'V3_2409_0',
      status: 'is_being_released',
      desc: '测试',
      sql_version_stage_detail: [
        {
          stage_id: 1,
          stage_name: '开发',
          stage_sequence: 1,
          stage_instances: [
            {
              instances_id: instanceTipsMockData[0].instance_id,
              instances_name: instanceTipsMockData[0].instance_name
            }
          ]
        },
        {
          stage_id: 1,
          stage_name: '测试',
          stage_sequence: 2,
          stage_instances: [
            {
              instances_id: instanceTipsMockData[1].instance_id,
              instances_name: instanceTipsMockData[1].instance_name
            }
          ]
        },
        {
          stage_id: 3,
          stage_name: '生产',
          stage_sequence: 1,
          stage_instances: [
            {
              instances_id: instanceTipsMockData[2].instance_id,
              instances_name: instanceTipsMockData[2].instance_name
            }
          ]
        }
      ]
    }
  };

  it('render init snap shot', async () => {
    const { baseElement } = sqleSuperRender(<UpdateVersion />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('更新版本')).toBeInTheDocument();
    expect(screen.getByText('返回版本管理列表')).toBeInTheDocument();
    expect(screen.getByText('重 置')).toBeInTheDocument();
    expect(screen.getByText('保 存')).toBeInTheDocument();
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(getSqlVersionDetailV1).toHaveBeenCalledTimes(1);
    expect(getSqlVersionDetailV1).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_version_id: versionId
    });
  });

  it('update version when The current version has already bound a work order', async () => {
    const { baseElement } = sqleSuperRender(<UpdateVersion />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('#stages_0_name')).toBeDisabled();
    expect(getBySelector('#stages_0_instances_0')).toBeDisabled();
    expect(getBySelector('#version')).not.toBeDisabled();
    expect(getBySelector('#desc')).not.toBeDisabled();
    fireEvent.change(getBySelector('#version'), {
      target: { value: 'v1_1_0' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#desc'), {
      target: { value: 'test desc' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateSqlVersionV1).toHaveBeenCalledTimes(1);
    expect(updateSqlVersionV1).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_version_id: versionId,
      desc: 'test desc',
      version: 'v1_1_0'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('更新版本成功')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('update version when The current version no bound any work order', async () => {
    getSqlVersionDetailV1.mockClear();
    getSqlVersionDetailV1.mockImplementation(() =>
      createSpySuccessResponse(mockNoWorkflowVersionDetail)
    );
    sqleSuperRender(<UpdateVersion />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('#stages_0_name')).not.toBeDisabled();
    expect(getBySelector('#stages_0_instances_0')).not.toBeDisabled();
    expect(getBySelector('#version')).not.toBeDisabled();
    expect(getBySelector('#desc')).not.toBeDisabled();

    fireEvent.change(getBySelector('#stages_0_name'), {
      target: { value: '开发1' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateSqlVersionV1).toHaveBeenCalledTimes(1);
    expect(updateSqlVersionV1).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_version_id: versionId,
      version: 'V3_2409_0',
      desc: '测试',
      update_sql_version_stage: [
        {
          name: '开发1',
          stage_sequence: 1,
          update_stages_instance_dep: [
            {
              next_stage_instance_id: instanceTipsMockData[1].instance_id,
              stage_instance_id: instanceTipsMockData[0].instance_id
            }
          ]
        },
        {
          name: '测试',
          stage_sequence: 2,
          update_stages_instance_dep: [
            {
              next_stage_instance_id: instanceTipsMockData[2].instance_id,
              stage_instance_id: instanceTipsMockData[1].instance_id
            }
          ]
        },
        {
          name: '生产',
          stage_sequence: 3,
          update_stages_instance_dep: [
            {
              next_stage_instance_id: undefined,
              stage_instance_id: instanceTipsMockData[2].instance_id
            }
          ]
        }
      ]
    });
  });

  it('update version name when The current version no bound any work order', async () => {
    getSqlVersionDetailV1.mockClear();
    getSqlVersionDetailV1.mockImplementation(() =>
      createSpySuccessResponse(mockNoWorkflowVersionDetail)
    );
    sqleSuperRender(<UpdateVersion />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('#stages_0_name')).not.toBeDisabled();
    expect(getBySelector('#stages_0_instances_0')).not.toBeDisabled();
    expect(getBySelector('#version')).not.toBeDisabled();
    expect(getBySelector('#desc')).not.toBeDisabled();

    fireEvent.change(getBySelector('#version'), {
      target: { value: 'update_version_name' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateSqlVersionV1).toHaveBeenCalledTimes(1);
    expect(updateSqlVersionV1).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_version_id: versionId,
      version: 'update_version_name',
      desc: '测试'
    });
  });

  it('render reset form', async () => {
    getSqlVersionDetailV1.mockClear();
    getSqlVersionDetailV1.mockImplementation(() =>
      createSpySuccessResponse(mockNoWorkflowVersionDetail)
    );
    sqleSuperRender(<UpdateVersion />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('#version')).toHaveValue('V3_2409_0');
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('#version')).toHaveValue('');
  });
});
