import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import usePipelineConfigurationFormState from '../hooks/usePipelineConfigurationFormState';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cleanup, act } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { ModalName } from '../../../../../data/ModalName';

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

describe('sqle//PipelineConfiguration/usePipelineConfigurationFormState', () => {
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    mockUseCurrentProject();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render update selected pipeline id', async () => {
    const { result } = renderHooksWithTheme(usePipelineConfigurationFormState);
    await act(async () => result.current.setSelectPipelineId(1));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      payload: { id: 1 },
      type: 'pipeline/updateSelectPipelineId'
    });
  });

  it('render open pipeline detail modal', async () => {
    const { result } = renderHooksWithTheme(usePipelineConfigurationFormState);
    await act(async () => result.current.openPipelineDetailModal());
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      payload: {
        modalName: ModalName.Pipeline_Configuration_Detail_Modal,
        status: true
      },
      type: 'pipeline/updateModalStatus'
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      payload: {
        show: true
      },
      type: 'pipeline/updatePipelineNodeTourStatus'
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      1,
      `/sqle/project/${mockProjectInfo.projectID}/pipeline-configuration`
    );
  });
});
