import { fireEvent } from '@testing-library/dom';
import AuditResultStep from '..';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import execWorkflow from '../../../../../../testUtils/mockApi/execWorkflow';
import { AuditTaskResData } from '../../../../../../testUtils/mockApi/execWorkflow/data';
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
import instance from '../../../../../../testUtils/mockApi/instance';
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

  let updateTaskBackupStrategySpy: jest.SpyInstance;
  let requestInstanceTip: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentUser();
    mockUseCurrentProject();
    jest.useFakeTimers();
    updateTaskBackupStrategySpy = execWorkflow.updateTaskBackupStrategy();
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
            port: '33061',
            enable_backup: true,
            supported_backup_strategy: [
              InstanceTipResV2SupportedBackupStrategyEnum.manual,
              InstanceTipResV2SupportedBackupStrategyEnum.none,
              InstanceTipResV2SupportedBackupStrategyEnum.original_row,
              InstanceTipResV2SupportedBackupStrategyEnum.reverse_sql
            ],
            backup_max_rows: 1000
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

  it('render switch data source backup policy', async () => {
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = customRender(jest.fn());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestInstanceTip).toHaveBeenCalledTimes(1);
    expect(screen.getByText('切换数据源备份策略')).toBeInTheDocument();
    fireEvent.click(screen.getByText('切换数据源备份策略'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText('统一变更当前数据源上SQL的备份回滚策略为')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseDown(getBySelector('#strategy'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('基于行级备份回滚'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateTaskBackupStrategySpy).toHaveBeenCalledTimes(1);
    expect(updateTaskBackupStrategySpy).toHaveBeenCalledWith({
      task_id: '1',
      strategy: 'original_row'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('切换数据源备份策略成功')).toBeInTheDocument();
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Sql_Exec_workflow_Audit_Result_List
    );
  });

  it('render switch backup policy button', async () => {
    const { baseElement } = customRender(jest.fn());

    expect(screen.getByText('切换数据源备份策略')).toBeInTheDocument();
    fireEvent.click(screen.getByText('instance_name a'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.queryByText('切换数据源备份策略')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});
