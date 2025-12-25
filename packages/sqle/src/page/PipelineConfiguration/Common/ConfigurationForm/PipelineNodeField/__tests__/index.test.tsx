import PipelineNodeField from '../';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import configuration from '@actiontech/shared/lib/testUtil/mockApi/sqle/configuration';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  instanceInfoMockData,
  instanceTipsMockData
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance/data';
import { projectRuleTemplateList } from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template/data';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  pipelineNodeDetailObjectTypeEnum,
  pipelineNodeDetailAuditMethodEnum,
  pipelineNodeDetailTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/PipelineConfiguration/PipelineNodeField', () => {
  let getDriversSpy: jest.SpyInstance;
  let getProjectRuleTemplateTipSpy: jest.SpyInstance;
  let getInstanceSpy: jest.SpyInstance;
  let getGlobalRuleTemplateTipSpy: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    getDriversSpy = configuration.getDrivers();
    getProjectRuleTemplateTipSpy = rule_template.getProjectRuleTemplateTips();
    getGlobalRuleTemplateTipSpy = rule_template.getRuleTemplateTips();
    getInstanceTipListSpy = instance.getInstanceTipList();
    getInstanceSpy = instance.getInstance();
    getInstanceSpy.mockClear();
    getInstanceSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...instanceInfoMockData,
          rule_template: {
            name: projectRuleTemplateList[0].rule_template_name,
            is_global_rule_template: true
          }
        }
      })
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const mockNodes = {
    audit_method: pipelineNodeDetailAuditMethodEnum.offline,
    instance_type: 'mysql',
    name: 'node1',
    object_path: '/opt/sqle',
    object_type: pipelineNodeDetailObjectTypeEnum.sql,
    rule_template_name: 'default_MySQL1',
    type: pipelineNodeDetailTypeEnum.audit,
    id: '1'
  };

  it('render init snap shot', async () => {
    const { baseElement } = superRender(<PipelineNodeField />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
  });

  it('render field when value is not undefined', async () => {
    const { baseElement } = superRender(
      <PipelineNodeField value={[{ ...mockNodes }]} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render update node ', async () => {
    const onChangeSpy = jest.fn();
    const { baseElement } = superRender(
      <PipelineNodeField value={[{ ...mockNodes }]} onChange={onChangeSpy} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('编 辑').closest('button')!);
    expect(screen.getByText('编辑节点')).toBeVisible();
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseDown(getBySelector('#object_type'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="MyBatis文件"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#object_path'), {
      target: { value: '/opt/sqle/update' }
    });
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenNthCalledWith(1, [
      {
        ...mockNodes,
        object_path: '/opt/sqle/update',
        object_type: 'mybatis'
      }
    ]);
  });

  it('render add offline node ', async () => {
    const onChangeSpy = jest.fn();
    const { baseElement } = superRender(
      <PipelineNodeField value={[{ ...mockNodes }]} onChange={onChangeSpy} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('添加节点'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('创建节点')).toBeVisible();
    expect(baseElement).toMatchSnapshot();
    fireEvent.change(screen.getByLabelText('节点名称'), {
      target: { value: 'node2' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.mouseDown(getBySelector('#object_type'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="SQL文件"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#object_path'), {
      target: { value: '/opt/sqle' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.mouseDown(getBySelector('#instance_type'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('span[title="mysql"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.mouseDown(getBySelector('#rule_template_name'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="default_MySQL1"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenNthCalledWith(1, [
      mockNodes,
      {
        audit_method: pipelineNodeDetailAuditMethodEnum.offline,
        instance_type: 'mysql',
        name: 'node2',
        object_path: '/opt/sqle',
        object_type: pipelineNodeDetailObjectTypeEnum.sql,
        rule_template_name: 'default_MySQL1',
        type: pipelineNodeDetailTypeEnum.audit,
        id: 'node2'
      }
    ]);
  });

  it('render add online node ', async () => {
    const onChangeSpy = jest.fn();
    const { baseElement } = superRender(
      <PipelineNodeField value={[{ ...mockNodes }]} onChange={onChangeSpy} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('添加节点'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('创建节点')).toBeVisible();
    fireEvent.change(screen.getByLabelText('节点名称'), {
      target: { value: 'node2' }
    });

    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.mouseDown(getBySelector('#object_type'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="MyBatis文件"]'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#object_path'), {
      target: { value: '/opt/sqle' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.mouseDown(getBySelector('#audit_method'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="在线审核"]'));
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    fireEvent.mouseDown(getBySelector('#instance_name'));
    await act(async () => jest.advanceTimersByTime(0));
    const instanceInfo = instanceTipsMockData[0];
    await act(async () => {
      fireEvent.click(
        getBySelector(
          `div[title="${instanceInfo.instance_name}(${instanceInfo.host}:${instanceInfo.port})"]`
        )
      );
      await act(async () => jest.advanceTimersByTime(0));
    });
    expect(getInstanceSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('span[title="default_MySQL"]')).toBeInTheDocument();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenNthCalledWith(1, [
      mockNodes,
      {
        audit_method: pipelineNodeDetailAuditMethodEnum.online,
        instance_name: 'mysql-1',
        name: 'node2',
        object_path: '/opt/sqle',
        object_type: pipelineNodeDetailObjectTypeEnum.mybatis,
        rule_template_name: 'default_MySQL',
        type: pipelineNodeDetailTypeEnum.audit,
        id: 'node2'
      }
    ]);
  });

  it('render input duplicate name', async () => {
    const rejectSpy = jest.spyOn(Promise, 'reject');
    rejectSpy.mockImplementation(() => Promise.resolve());
    superRender(<PipelineNodeField value={[{ ...mockNodes }]} />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('添加节点'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('创建节点')).toBeVisible();
    fireEvent.change(screen.getByLabelText('节点名称'), {
      target: { value: 'node1' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    expect(rejectSpy).toHaveBeenCalledTimes(1);
    expect(rejectSpy).toHaveBeenNthCalledWith(1, '节点名称不可重复');
  });

  it('render delete node', async () => {
    const onChangeSpy = jest.fn();
    superRender(
      <PipelineNodeField value={[{ ...mockNodes }]} onChange={onChangeSpy} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('确认删除该流水线节点吗？')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });
});
