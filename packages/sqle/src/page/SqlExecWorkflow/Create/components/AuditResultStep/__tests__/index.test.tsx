import { fireEvent } from '@testing-library/dom';
import AuditResultStep from '..';
import { superRender } from '../../../../../../testUtils/customRender';
import execWorkflow from '../../../../../../testUtils/mockApi/execWorkflow';
import { AuditTaskResData } from '../../../../../../testUtils/mockApi/execWorkflow/data';
import { MockSharedStepDetail } from '../../../hooks/mockData';
import { act } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useSelector } from 'react-redux';
import { ModalName } from '../../../../../../data/ModalName';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('test AuditResultStep', () => {
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
        isDisableFinallySubmitButton={false}
        disabledOperatorWorkflowBtnTips={''}
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

  it('should match snapshot', async () => {
    const createActionSpy = jest
      .fn()
      .mockImplementation(() => createSpySuccessResponse({}));
    const { container, getByText } = customRender(createActionSpy);

    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('提交工单'));
    expect(createActionSpy).toHaveBeenCalledTimes(1);
  });
});
