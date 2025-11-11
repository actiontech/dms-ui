import { fireEvent } from '@testing-library/dom';
import AuditResultStep from '..';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import { AuditTaskResData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';
import { MockSharedStepDetail } from '../../../hooks/mockData';
import { act, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useSelector } from 'react-redux';
import { ModalName } from '../../../../../../data/ModalName';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EventEmitter from '../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../data/EmitterKey';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { InstanceTipResV2SupportedBackupStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('test AuditResultStep', () => {
  const customRender = (createAction: () => Promise<void>) => {
    return sqleSuperRender(
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
        hasExceptionAuditRule={false}
        {...MockSharedStepDetail}
      />
    );
  };

  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED,
    UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE
  ]);

  let requestInstanceTip: jest.SpyInstance;

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
    mockUseDbServiceDriver();
    requestInstanceTip = instance.getInstanceTipList();
    requestInstanceTip.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            instance_id: '1739531854064652288',
            instance_name: AuditTaskResData[0].instance_name,
            instance_type: 'MySQL',
            workflow_template_id: 1,
            host: '10.186.62.13',
            port: '33061'
          }
        ]
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
