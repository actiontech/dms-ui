import CreatePipelineConfiguration from '../';
import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import pipeline from '@actiontech/shared/lib/testUtil/mockApi/sqle/pipeline';
import { mockPipelineDetailData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/pipeline/data';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import configuration from '@actiontech/shared/lib/testUtil/mockApi/sqle/configuration';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { instanceInfoMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance/data';
import { projectRuleTemplateList } from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template/data';
import { ModalName } from '../../../../data/ModalName';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('sqle//PipelineConfiguration/Update', () => {
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  const pipelineId = mockPipelineDetailData.id;

  let updatePipelineSpy: jest.SpyInstance;
  let getPipelineDetailSpy: jest.SpyInstance;
  let getDriversSpy: jest.SpyInstance;
  let getProjectRuleTemplateTipSpy: jest.SpyInstance;
  let getInstanceSpy: jest.SpyInstance;
  let getGlobalRuleTemplateTipSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    useParamsMock.mockReturnValue({ id: pipelineId });
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    updatePipelineSpy = pipeline.updatePipeline();
    getPipelineDetailSpy = pipeline.getPipelineDetail();
    getDriversSpy = configuration.getDrivers();
    getProjectRuleTemplateTipSpy = rule_template.getProjectRuleTemplateTips();
    getGlobalRuleTemplateTipSpy = rule_template.getRuleTemplateTips();
    instance.getInstanceTipList();
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
    expect(screen.getByText('更新流水线配置')).toBeInTheDocument();
    expect(screen.getByText('返回流水线配置列表')).toBeInTheDocument();
    expect(screen.getByText('重 置')).toBeInTheDocument();
    expect(screen.getByText('保 存')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
    expect(getPipelineDetailSpy).toHaveBeenCalledTimes(1);
    expect(getPipelineDetailSpy).toHaveBeenNthCalledWith(1, {
      pipeline_id: pipelineId,
      project_name: mockProjectInfo.projectName
    });
    expect(getBySelector('#name')).toHaveValue(mockPipelineDetailData.name);
    expect(getBySelector('#name')).toBeDisabled();
    expect(screen.getByText('node1')).toBeInTheDocument();
  });

  it('render update pipeline', async () => {
    const { baseElement } = superRender(<CreatePipelineConfiguration />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.change(getBySelector('#description'), {
      target: { value: 'update desc' }
    });
    await act(async () => jest.advanceTimersByTime(0));
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
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updatePipelineSpy).toHaveBeenCalledTimes(1);
    expect(updatePipelineSpy).toHaveBeenNthCalledWith(1, {
      address: mockPipelineDetailData.address,
      description: 'update desc',
      name: mockPipelineDetailData.name,
      pipeline_id: mockPipelineDetailData.id,
      nodes: [
        {
          audit_method: 'offline',
          instance_type: 'mysql',
          name: 'node1',
          object_path: '/opt/sqle/update',
          object_type: 'mybatis',
          rule_template_name: 'default_MySQL1',
          type: 'audit',
          id: 1
        }
      ],
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      payload: {
        id: pipelineId
      },
      type: 'pipeline/updateSelectPipelineId'
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('流水线更新成功')).toBeInTheDocument();
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
    expect(getBySelector('#name')).toHaveValue(mockPipelineDetailData.name);
    expect(getBySelector('#description')).toHaveValue(
      mockPipelineDetailData.description
    );
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(getBySelector('#name')).toHaveValue(mockPipelineDetailData.name);
    expect(getBySelector('#description')).toHaveValue('');
  });
});
