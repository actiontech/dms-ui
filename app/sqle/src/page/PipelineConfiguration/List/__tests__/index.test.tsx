import PipelineConfigurationList from '..';
import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import pipeline from '@actiontech/shared/lib/testUtil/mockApi/sqle/pipeline';
import { mockPipelineListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/pipeline/data';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
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
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('sqle/PipelineConfiguration/List', () => {
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();

  let getPipelinesSpy: jest.SpyInstance;
  let deletePipelineSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        pipeline: {
          modalStatus: {}
        },
        permission: {
          moduleFeatureSupport: {
            sqlOptimization: false,
            knowledge: false
          },
          userOperationPermissions: null
        }
      });
    });
    getPipelinesSpy = pipeline.getPipelines();
    deletePipelineSpy = pipeline.deletePipeline();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render pipeline list', async () => {
    const { baseElement } = superRender(<PipelineConfigurationList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getPipelinesSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('创建流水线')).toBeInTheDocument();
  });

  it('render prompt when no pipeline', async () => {
    getPipelinesSpy.mockClear();
    getPipelinesSpy.mockResolvedValueOnce(
      createSpySuccessResponse({ data: [] })
    );
    const { baseElement } = superRender(<PipelineConfigurationList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getPipelinesSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂未生成流水线')).toBeInTheDocument();
  });

  it('render filter list data by search', async () => {
    superRender(<PipelineConfigurationList />);
    await act(async () => jest.advanceTimersByTime(3000));

    const searchText = 'test search';
    const inputEle = getBySelector('#actiontech-table-search-input');
    fireEvent.change(inputEle, {
      target: { value: searchText }
    });

    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getPipelinesSpy).toHaveBeenCalledTimes(2);
    expect(getPipelinesSpy).toHaveBeenNthCalledWith(2, {
      fuzzy_search_name_desc: searchText,
      page_index: 1,
      page_size: 20,
      project_name: mockProjectInfo.projectName
    });
  });

  it('render edit pipeline', async () => {
    getPipelinesSpy.mockClear();
    getPipelinesSpy.mockResolvedValueOnce(
      createSpySuccessResponse({ data: [mockPipelineListData[0]] })
    );
    superRender(<PipelineConfigurationList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('render delete pipeline', async () => {
    getPipelinesSpy.mockClear();
    getPipelinesSpy.mockResolvedValueOnce(
      createSpySuccessResponse({ data: [mockPipelineListData[0]] })
    );
    superRender(<PipelineConfigurationList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('确认删除该流水线吗？')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(deletePipelineSpy).toHaveBeenCalledTimes(1);
    expect(deletePipelineSpy).toHaveBeenCalledWith({
      pipeline_id: `${mockPipelineListData[0].id}`,
      project_name: mockProjectInfo.projectName
    });
    expect(screen.getByText('删除流水线配置成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getPipelinesSpy).toHaveBeenCalled();
  });

  it('refresh pipeline list', async () => {
    superRender(<PipelineConfigurationList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getPipelinesSpy).toHaveBeenCalledTimes(1);
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Pipeline_Configuration_list)
    );
    expect(getPipelinesSpy).toHaveBeenCalledTimes(2);
  });

  it('render view pipeline detail', async () => {
    superRender(<PipelineConfigurationList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('pipeline1'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'pipeline/updateSelectPipelineId',
      payload: { id: 1 }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'pipeline/updateModalStatus',
      payload: {
        modalName: ModalName.Pipeline_Configuration_Detail_Modal,
        status: true
      }
    });
  });
});
