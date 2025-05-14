import CreatePipelineConfiguration from '../';
import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import pipeline from '../../../../testUtils/mockApi/pipeline';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import configuration from '../../../../testUtils/mockApi/configuration';
import instance from '../../../../testUtils/mockApi/instance';
import rule_template from '../../../../testUtils/mockApi/rule_template';
import {
  instanceInfoMockData,
  instanceTipsMockData
} from '../../../../testUtils/mockApi/instance/data';
import { projectRuleTemplateList } from '../../../../testUtils/mockApi/rule_template/data';
import { ModalName } from '../../../../data/ModalName';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('sqle//PipelineConfiguration/Create', () => {
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();

  let createPipelineSpy: jest.SpyInstance;
  let getDriversSpy: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;
  let getProjectRuleTemplateTipSpy: jest.SpyInstance;
  let getInstanceSpy: jest.SpyInstance;
  let getGlobalRuleTemplateTipSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    createPipelineSpy = pipeline.createPipeline();
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
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = superRender(<CreatePipelineConfiguration />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('创建流水线配置')).toBeInTheDocument();
    expect(screen.getByText('返回流水线配置列表')).toBeInTheDocument();
    expect(screen.getByText('重 置')).toBeInTheDocument();
    expect(screen.getByText('保 存')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
  });

  it('render create pipeline', async () => {
    const { baseElement } = superRender(<CreatePipelineConfiguration />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.change(getBySelector('#name'), {
      target: { value: 'test_pipeline' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#description'), {
      target: { value: 'desc' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#address'), {
      target: { value: 'http://127.0.0.1' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('添加节点'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('创建节点')).toBeVisible();
    expect(baseElement).toMatchSnapshot();
    fireEvent.change(
      getBySelector(
        '#name',
        getBySelector('label[title="节点名称"]').parentElement?.parentElement!
      ),
      {
        target: { value: 'node1' }
      }
    );
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
    expect(screen.getByText('创建节点')).not.toBeVisible();

    fireEvent.change(
      getBySelector(
        '#name',
        getBySelector('label[title="节点名称"]').parentElement?.parentElement!
      ),
      {
        target: { value: 'node2' }
      }
    );

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
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    fireEvent.mouseDown(getBySelector('#instance_name'));
    await act(async () => jest.advanceTimersByTime(0));
    const instance = instanceTipsMockData[0];
    await act(async () => {
      fireEvent.click(
        getBySelector(
          `div[title="${instance.instance_name}(${instance.host}:${instance.port})"]`
        )
      );
      await act(async () => jest.advanceTimersByTime(0));
    });
    expect(getInstanceSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('span[title="default_MySQL"]')).toBeInTheDocument();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('创建节点')).not.toBeVisible();
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(createPipelineSpy).toHaveBeenCalledTimes(1);
    expect(createPipelineSpy).toHaveBeenNthCalledWith(1, {
      address: 'http://127.0.0.1',
      description: 'desc',
      name: 'test_pipeline',
      nodes: [
        {
          audit_method: 'offline',
          instance_type: 'mysql',
          name: 'node1',
          object_path: '/opt/sqle',
          object_type: 'sql',
          rule_template_name: 'default_MySQL1',
          type: 'audit'
        },
        {
          audit_method: 'online',
          instance_name: 'mysql-1',
          name: 'node2',
          object_path: '/opt/sqle',
          object_type: 'mybatis',
          rule_template_name: 'default_MySQL',
          type: 'audit'
        }
      ],
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      payload: {
        id: 1
      },
      type: 'pipeline/updateSelectPipelineId'
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('流水线创建成功')).toBeInTheDocument();
    expect(screen.getByText('获取流水线对接说明')).toBeInTheDocument();
    fireEvent.click(screen.getByText('获取流水线对接说明'));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      payload: {
        modalName: ModalName.Pipeline_Configuration_Detail_Modal,
        status: true
      },
      type: 'pipeline/updateModalStatus'
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      payload: {
        show: true
      },
      type: 'pipeline/updatePipelineNodeTourStatus'
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('render reset form', async () => {
    superRender(<CreatePipelineConfiguration />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.change(getBySelector('#name'), {
      target: { value: 'test_pipeline' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#description'), {
      target: { value: 'desc' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#address'), {
      target: { value: 'http://127.0.0.1' }
    });
    expect(getBySelector('#name')).toHaveValue('test_pipeline');
    expect(getBySelector('#description')).toHaveValue('desc');
    expect(getBySelector('#address')).toHaveValue('http://127.0.0.1');
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#name')).toHaveValue('');
    expect(getBySelector('#description')).toHaveValue('');
    expect(getBySelector('#address')).toHaveValue('');
  });
});
