/**
 * @test_version ce
 */
import WorkflowRecordInfo from '..';
import { WorkflowRecordInfoProps } from '../index.type';
import { cleanup } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { WorkflowsOverviewListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import { mockThemeStyleData } from '../../../../../../testUtils/mockHooks/mockThemeStyleData';

describe('sqle/SqlExecWorkflow/Detail/RecordInfo ce', () => {
  const closeFn = jest.fn();
  const customRender = (params: WorkflowRecordInfoProps) => {
    return sqleSuperRender(<WorkflowRecordInfo {...params} />);
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

  it('render init snap', () => {
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
