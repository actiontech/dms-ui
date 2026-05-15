import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import CreateVersion from '..';
import sqlVersion from '@actiontech/shared/lib/testUtil/mockApi/sqle/sql_version';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import { instanceTipsMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance/data';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';

describe('sqle/VersionManagement/Create', () => {
  let createSqlVersionV1: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    createSqlVersionV1 = sqlVersion.mockCreateSqlVersionV1();
    getInstanceTipListSpy = instance.getInstanceTipList();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
    createSqlVersionV1.mockImplementation(() =>
      resolveThreeSecond({ sql_version_id: 1 })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap shot', () => {
    const { baseElement } = sqleSuperRender(<CreateVersion />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('创建版本')).toBeInTheDocument();
    expect(screen.getByText('返回版本管理列表')).toBeInTheDocument();
    expect(screen.getByText('重 置')).toBeInTheDocument();
    expect(screen.getByText('保 存')).toBeInTheDocument();
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
  });

  it('render create version', async () => {
    const { baseElement } = sqleSuperRender(<CreateVersion />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.change(getBySelector('#version'), {
      target: { value: 'v1_1_0' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#desc'), {
      target: { value: 'test desc' }
    });
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#stages_0_instances_0'));
    await act(async () => jest.advanceTimersByTime(0));
    const firstInstance = instanceTipsMockData[0];
    const secondInstance = instanceTipsMockData[1];
    const lastInstance = instanceTipsMockData[2];
    fireEvent.click(
      getBySelector(
        `div[title="${firstInstance.instance_name}(${firstInstance.host}:${firstInstance.port})"]`
      )
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#stages_1_instances_0'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(
      getAllBySelector(
        `div[title="${secondInstance.instance_name}(${secondInstance.host}:${secondInstance.port})"]`
      )[1]
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.mouseDown(getBySelector('#stages_2_instances_0'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(
      getAllBySelector(
        `div[title="${lastInstance.instance_name}(${lastInstance.host}:${lastInstance.port})"]`
      )[2]
    );
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(createSqlVersionV1).toHaveBeenCalledTimes(1);
    expect(createSqlVersionV1).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      version: 'v1_1_0',
      desc: 'test desc',
      create_sql_version_stage: [
        {
          name: '开发',
          stage_sequence: 1,
          create_stages_instance_dep: [
            {
              stage_instance_id: firstInstance.instance_id,
              next_stage_instance_id: secondInstance.instance_id
            }
          ]
        },
        {
          name: '测试',
          stage_sequence: 2,
          create_stages_instance_dep: [
            {
              stage_instance_id: secondInstance.instance_id,
              next_stage_instance_id: lastInstance.instance_id
            }
          ]
        },
        {
          name: '生产',
          stage_sequence: 3,
          create_stages_instance_dep: [
            {
              stage_instance_id: lastInstance.instance_id,
              next_stage_instance_id: undefined
            }
          ]
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('创建版本成功')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('保 存')).not.toBeVisible();
    fireEvent.click(screen.getByText('继续创建版本'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('保 存')).toBeVisible();
  });

  it('render version stage configuration', async () => {
    sqleSuperRender(<CreateVersion />);
    await act(async () => jest.advanceTimersByTime(3000));

    // 添加阶段数据源
    fireEvent.click(getBySelector('.add-instance-btn'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('.add-instance-btn'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getAllBySelector('.remove-instance-btn').length).toBe(3);

    // 添加部署阶段
    fireEvent.click(screen.getByText('添加部署阶段'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getAllBySelector('.delete-stage-btn').length).toBe(4);

    // 删除部署阶段
    fireEvent.click(getAllBySelector('.delete-stage-btn')[3]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getAllBySelector('.delete-stage-btn').length).toBe(3);

    // 删除阶段数据源
    fireEvent.click(getAllBySelector('.remove-instance-btn')[2]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getAllBySelector('.remove-instance-btn').length).toBe(2);
  });
});
