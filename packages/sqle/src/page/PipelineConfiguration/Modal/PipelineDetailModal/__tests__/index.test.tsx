import PipelineDetailModal from '../';
import pipeline from '../../../../../testUtils/mockApi/pipeline';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import { useDispatch } from 'react-redux';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { ModalName } from '../../../../../data/ModalName';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/PipelineConfiguration/Modal/PipelineDetailModal', () => {
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();

  let getPipelineDetailSpy: jest.SpyInstance;
  let deletePipelineSpy: jest.SpyInstance;
  let refreshPipelineNodeTokenSpy: jest.SpyInstance;
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.TRIGGER_ELEMENT_SAME_ROOT]);

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    getPipelineDetailSpy = pipeline.getPipelineDetail();
    deletePipelineSpy = pipeline.deletePipeline();
    refreshPipelineNodeTokenSpy = pipeline.refreshPipelineNodeToken();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (showPipelineNodeTour = false) => {
    return sqleSuperRender(<PipelineDetailModal />, undefined, {
      initStore: {
        pipeline: {
          modalStatus: {
            [ModalName.Pipeline_Configuration_Detail_Modal]: true
          },
          selectPipelineId: '1',
          showPipelineNodeTour
        }
      }
    });
  };

  it('render init snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getPipelineDetailSpy).toHaveBeenCalledTimes(1);
  });

  it('render delete pipeline', async () => {
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('确认删除该流水线吗？')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(deletePipelineSpy).toHaveBeenCalledTimes(1);
    expect(deletePipelineSpy).toHaveBeenCalledWith({
      pipeline_id: '1',
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Pipeline_Configuration_list
    );
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      payload: { id: undefined },
      type: 'pipeline/updateSelectPipelineId'
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      payload: { show: false },
      type: 'pipeline/updatePipelineNodeTourStatus'
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      payload: {
        modalName: ModalName.Pipeline_Configuration_Detail_Modal,
        status: false
      },
      type: 'pipeline/updateModalStatus'
    });
  });

  it('render edit pipeline', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      payload: { id: undefined },
      type: 'pipeline/updateSelectPipelineId'
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      payload: { show: false },
      type: 'pipeline/updatePipelineNodeTourStatus'
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      payload: {
        modalName: ModalName.Pipeline_Configuration_Detail_Modal,
        status: false
      },
      type: 'pipeline/updateModalStatus'
    });
  });

  it('render show tour', async () => {
    const eventListenerSpy = jest.spyOn(window, 'addEventListener');
    const { baseElement } = customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.focus-node-list')).toBeInTheDocument();
    expect(eventListenerSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('查看'));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      payload: { show: false },
      type: 'pipeline/updatePipelineNodeTourStatus'
    });
  });

  it('reset token', async () => {
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('重置Token'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText(
        '重置后将生成新的Token，有效期365天。旧Token将立即失效，是否继续？'
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(refreshPipelineNodeTokenSpy).toHaveBeenCalledTimes(1);
    expect(refreshPipelineNodeTokenSpy).toHaveBeenCalledWith({
      node_id: '1',
      pipeline_id: '1',
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('重置Token成功！')).toBeInTheDocument();
    expect(getPipelineDetailSpy).toHaveBeenCalledTimes(2);
  });
});
