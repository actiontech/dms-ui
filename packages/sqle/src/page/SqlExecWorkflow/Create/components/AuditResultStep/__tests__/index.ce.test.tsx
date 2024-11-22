/**
 * @test_version ce
 */
import AuditResultStep from '..';
import { superRender } from '../../../../../../testUtils/customRender';
import execWorkflow from '../../../../../../testUtils/mockApi/execWorkflow';
import { AuditTaskResData } from '../../../../../../testUtils/mockApi/execWorkflow/data';
import { MockSharedStepDetail } from '../../../hooks/mockData';
import { screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useSelector } from 'react-redux';
import { ModalName } from '../../../../../../data/ModalName';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('test AuditResultStep ce', () => {
  const customRender = (createAction: () => Promise<void>) => {
    return superRender(
      <AuditResultStep
        baseFormValues={{ desc: 'desc', workflow_subject: 'workflow_subject' }}
        tasks={AuditTaskResData}
        updateTaskRecordCount={jest.fn()}
        sqlAuditInfoFormValues={{
          isSameSqlForAll: true,
          databaseInfo: [{ instanceName: 'mysql-1', instanceSchema: 'test' }]
        }}
        isConfirmationRequiredForSubmission={false}
        submitWorkflowConfirmationMessage={''}
        createAction={createAction}
        auditAction={jest.fn()}
        {...MockSharedStepDetail}
      />
    );
  };

  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED,
    UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE
  ]);

  beforeEach(() => {
    mockUseCurrentUser();
    mockUseCurrentProject();
    jest.useFakeTimers();
    execWorkflow.mockAllApi();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('render init snap', async () => {
    const { baseElement } = customRender(jest.fn());
    expect(screen.queryByText('切换数据源备份策略')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});
