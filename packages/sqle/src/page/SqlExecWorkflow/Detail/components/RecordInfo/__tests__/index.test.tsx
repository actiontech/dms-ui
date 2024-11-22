import WorkflowRecordInfo from '..';
import { WorkflowRecordInfoProps } from '../index.type';
import { cleanup, fireEvent, act } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  WorkflowListData,
  WorkflowsOverviewListData
} from '../../../../../../testUtils/mockApi/execWorkflow/data';
import { superRender } from '../../../../../../testUtils/customRender';
import { mockThemeStyleData } from '../../../../../../testUtils/mockHooks/mockThemeStyleData';

describe('sqle/SqlExecWorkflow/Detail/RecordInfo', () => {
  const closeFn = jest.fn();
  const customRender = (params: WorkflowRecordInfoProps) => {
    return superRender(<WorkflowRecordInfo {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockThemeStyleData();
    mockUseCurrentProject();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap when open is false', () => {
    const { baseElement } = customRender({
      visibility: false,
      onClose: closeFn
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when open is true', async () => {
    const { baseElement } = customRender({
      visibility: true,
      onClose: closeFn
    });
    const closedIcon = getBySelector('.custom-icon-close', baseElement);
    fireEvent.click(closedIcon);
    await act(async () => jest.advanceTimersByTime(500));
    expect(closeFn).toHaveBeenCalled();
  });

  it('render snap when has workflow info', () => {
    const { baseElement } = customRender({
      visibility: true,
      onClose: closeFn,
      workflowInfo: WorkflowListData[0],
      tasksStatusCount: {
        success: 1,
        failed: 0,
        executing: 0
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has associated stage workflows and rollback workflows', () => {
    const { baseElement } = customRender({
      visibility: true,
      onClose: closeFn,
      workflowInfo: WorkflowsOverviewListData,
      tasksStatusCount: {
        success: 1,
        failed: 0,
        executing: 0
      }
    });
    expect(baseElement).toMatchSnapshot();
  });
});
