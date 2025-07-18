import { act, fireEvent, renderHook } from '@testing-library/react';
import useRenderDatabaseSelectionItems from '../hooks/useRenderDatabaseSelectionItems';
import { MockSharedStepDetail } from '../../../../../../hooks/mockData';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  instanceInfoMockData,
  instanceSchemasMockData
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance/data';
import system from '@actiontech/shared/lib/testUtil/mockApi/sqle/system';
import { getSystemModuleStatusModuleNameEnum } from '@actiontech/shared/lib/api/sqle/service/system/index.enum';
import { sqleSuperRender } from '../../../../../../../../../testUtils/superRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useSelector } from 'react-redux';
import * as useCreationMode from '../../../../../../hooks/useCreationMode';
import { instanceTipsMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance/data';
import { InstanceTipResV2SupportedBackupStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('test useRenderDatabaseSelectionItems', () => {
  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    mockUseCurrentProject();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlExecWorkflow: {
          clonedExecWorkflowSqlAuditInfo: {
            databaseInfo: [
              {
                instanceName: 'mysql-1',
                instanceSchema: 'test'
              },
              {
                instanceName: 'mysql-1',
                instanceSchema: 'test'
              }
            ]
          },
          versionFirstStageInstances: [
            {
              instances_name: instanceTipsMockData[0].instance_name,
              instances_id: instanceTipsMockData[0].instance_id
            }
          ]
        }
      })
    );
    jest.spyOn(useCreationMode, 'default').mockImplementation(() => ({
      isCloneMode: false,
      isAssociationVersionMode: false,
      versionId: undefined,
      versionName: undefined,
      rollbackWorkflowId: undefined,
      isRollbackMode: false
    }));
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should handle instance change and update states correctly', async () => {
    const mockGetInstanceSchemas = instance.getInstanceSchemas();
    const mockGetInstance = instance.getInstance();
    const mockGetSystemModuleStatus = system.getSystemModuleStatus();

    const { result } = renderHook(() =>
      useRenderDatabaseSelectionItems({
        dbSourceInfoCollection: MockSharedStepDetail.dbSourceInfoCollection,
        sqlStatementTabActiveKey: MockSharedStepDetail.sqlStatementTabActiveKey,
        instanceList: [
          {
            instance_name: 'instance1',
            enable_backup: true,
            supported_backup_strategy: [
              InstanceTipResV2SupportedBackupStrategyEnum.manual,
              InstanceTipResV2SupportedBackupStrategyEnum.none,
              InstanceTipResV2SupportedBackupStrategyEnum.original_row,
              InstanceTipResV2SupportedBackupStrategyEnum.reverse_sql
            ],
            backup_max_rows: 2000
          }
        ]
      })
    );

    await act(async () => {
      result.current.handleInstanceChange('key1', 'instance1');
    });

    expect(mockGetInstanceSchemas).toHaveBeenCalledTimes(1);
    expect(mockGetInstanceSchemas).toHaveBeenCalledWith({
      instance_name: 'instance1',
      project_name: mockProjectInfo.projectName
    });

    expect(mockGetInstance).toHaveBeenCalledTimes(1);
    expect(mockGetInstance).toHaveBeenCalledWith({
      instance_name: 'instance1',
      project_name: mockProjectInfo.projectName
    });

    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledTimes(2);
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenNthCalledWith(2, 'key1', {
      instanceName: 'instance1',
      schemaName: undefined,
      getSchemaLoading: true,
      schemaList: [],
      ruleTemplate: undefined,
      dbType: undefined,
      testConnectResult: undefined,
      isSupportFileModeExecuteSql: true,
      enableBackup: true,
      allowBackup: true,
      backupMaxRows: 2000
    });

    await act(() => jest.advanceTimersByTime(3000));

    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledTimes(5);
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledWith('key1', {
      getSchemaLoading: false
    });
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledWith('key1', {
      dbType: instanceInfoMockData.db_type,
      ruleTemplate: instanceInfoMockData.rule_template
    });
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledWith('key1', {
      schemaList: instanceSchemasMockData
    });

    expect(
      MockSharedStepDetail.sqlStatementTabActiveKey.set
    ).toHaveBeenCalledTimes(1);
    expect(
      MockSharedStepDetail.sqlStatementTabActiveKey.set
    ).toHaveBeenCalledWith('key1');

    expect(mockGetSystemModuleStatus).toHaveBeenCalledTimes(1);
    expect(mockGetSystemModuleStatus).toHaveBeenCalledWith({
      db_type: instanceInfoMockData.db_type,
      module_name: getSystemModuleStatusModuleNameEnum.execute_sql_file_mode
    });

    await act(() => jest.advanceTimersByTime(3000));
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledTimes(6);

    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledWith('key1', {
      isSupportFileModeExecuteSql: true
    });
  });

  it('should handle instance schema change and update states correctly', () => {
    const { result } = renderHook(() =>
      useRenderDatabaseSelectionItems({
        dbSourceInfoCollection: MockSharedStepDetail.dbSourceInfoCollection,
        sqlStatementTabActiveKey: MockSharedStepDetail.sqlStatementTabActiveKey
      })
    );

    result.current.handleInstanceSchemaChange('key1', 'schema_name');

    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledTimes(2);
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledWith('key1', {
      schemaName: 'schema_name'
    });
  });

  it('should return instance schema options with schemaList', () => {
    const { result } = renderHook(() =>
      useRenderDatabaseSelectionItems({
        dbSourceInfoCollection: {
          value: { key1: { schemaList: ['test1', 'test2'] } },
          set: jest.fn()
        },
        sqlStatementTabActiveKey: MockSharedStepDetail.sqlStatementTabActiveKey
      })
    );

    expect(result.current.getInstanceSchemaOptions('key1')).toEqual([
      { label: 'test1', value: 'test1' },
      { label: 'test2', value: 'test2' }
    ]);
  });

  it('should render rule template display correctly with is_global_rule_template is equal false', () => {
    const { result } = renderHook(() =>
      useRenderDatabaseSelectionItems({
        dbSourceInfoCollection: {
          set: jest.fn(),
          value: {
            key1: {
              ruleTemplate: {
                name: 'template1',
                is_global_rule_template: false
              },
              dbType: 'mysql'
            }
          }
        },
        sqlStatementTabActiveKey: { set: jest.fn(), value: '' }
      })
    );

    const ruleTemplateDisplay =
      result.current.renderRuleTemplateDisplay('key1');

    // 断言渲染正确的组件和内容
    expect(ruleTemplateDisplay).toMatchSnapshot();
  });

  it('should render rule template display correctly with is_global_rule_template is equal true', () => {
    const { result } = renderHook(() =>
      useRenderDatabaseSelectionItems({
        dbSourceInfoCollection: {
          set: jest.fn(),
          value: {
            key1: {
              ruleTemplate: {
                name: 'template1',
                is_global_rule_template: true
              },
              dbType: 'mysql'
            }
          }
        },
        sqlStatementTabActiveKey: { set: jest.fn(), value: '' }
      })
    );

    const ruleTemplateDisplay =
      result.current.renderRuleTemplateDisplay('key1');

    // 断言渲染正确的组件和内容
    expect(ruleTemplateDisplay).toMatchSnapshot();
  });

  it('should render delete item button correctly with fields length is equal 1', () => {
    const handleClickSpy = jest.fn();
    const { result } = renderHook(() =>
      useRenderDatabaseSelectionItems({
        dbSourceInfoCollection: MockSharedStepDetail.dbSourceInfoCollection,
        sqlStatementTabActiveKey: MockSharedStepDetail.sqlStatementTabActiveKey
      })
    );

    const { container } = sqleSuperRender(
      result.current.renderDeleteItemButton(
        [{ key: 1, name: 1 }],
        '1',
        handleClickSpy
      )
    );

    fireEvent.click(container.querySelector('.data-source-col-delete-button')!);
    expect(handleClickSpy).not.toHaveBeenCalled();
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledTimes(1);
    expect(
      MockSharedStepDetail.sqlStatementTabActiveKey.set
    ).not.toHaveBeenCalled();
  });

  it('should render delete item button correctly with fields length is more than 1', () => {
    const handleClickSpy = jest.fn();
    const { result } = renderHook(() =>
      useRenderDatabaseSelectionItems({
        dbSourceInfoCollection: MockSharedStepDetail.dbSourceInfoCollection,
        sqlStatementTabActiveKey: MockSharedStepDetail.sqlStatementTabActiveKey
      })
    );

    const { container } = sqleSuperRender(
      result.current.renderDeleteItemButton(
        [
          { key: 1, name: 1 },
          { key: 3, name: 3 },
          { key: 2, name: 2 }
        ],
        '1',
        handleClickSpy
      )
    );

    fireEvent.click(container.querySelector('.data-source-col-delete-button')!);
    expect(handleClickSpy).toHaveBeenCalledTimes(1);
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledTimes(2);
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledWith('1', undefined);

    expect(
      MockSharedStepDetail.sqlStatementTabActiveKey.set
    ).toHaveBeenCalledTimes(1);
    expect(
      MockSharedStepDetail.sqlStatementTabActiveKey.set
    ).toHaveBeenCalledWith('0');
  });

  it('should render add item button correctly', () => {
    const handleClickSpy = jest.fn();
    const { result } = renderHook(() =>
      useRenderDatabaseSelectionItems({
        dbSourceInfoCollection: MockSharedStepDetail.dbSourceInfoCollection,
        sqlStatementTabActiveKey: MockSharedStepDetail.sqlStatementTabActiveKey
      })
    );

    const { getByText } = sqleSuperRender(
      result.current.renderAddItemButton(
        [
          { key: 1, name: 1 },
          { key: 2, name: 2 }
        ],
        handleClickSpy
      )
    );

    fireEvent.click(getByText('添加数据源')!);
    expect(handleClickSpy).toHaveBeenCalledTimes(1);
  });

  it('should render add item button correctly with fields length is more than 10', () => {
    const handleClickSpy = jest.fn();
    const { result } = renderHook(() =>
      useRenderDatabaseSelectionItems({
        dbSourceInfoCollection: MockSharedStepDetail.dbSourceInfoCollection,
        sqlStatementTabActiveKey: MockSharedStepDetail.sqlStatementTabActiveKey
      })
    );

    const { getByText } = sqleSuperRender(
      result.current.renderAddItemButton(
        Array.from({ length: 20 }, (_, index) => ({ name: index, key: index })),
        handleClickSpy
      )
    );

    expect(getByText('添加数据源').closest('button')).toBeDisabled();
    fireEvent.click(getByText('添加数据源')!);
    expect(handleClickSpy).not.toHaveBeenCalled();
  });

  it('should get instance info when isCloneMode is true', async () => {
    const mockGetInstanceSchemas = instance.getInstanceSchemas();
    const mockGetInstance = instance.getInstance();
    const mockGetSystemModuleStatus = system.getSystemModuleStatus();
    const spy = jest.spyOn(useCreationMode, 'default');
    spy.mockImplementation(() => ({
      isCloneMode: true,
      isAssociationVersionMode: false,
      versionId: undefined,
      versionName: undefined,
      rollbackWorkflowId: undefined,
      isRollbackMode: false
    }));
    renderHook(() =>
      useRenderDatabaseSelectionItems({
        dbSourceInfoCollection: MockSharedStepDetail.dbSourceInfoCollection,
        sqlStatementTabActiveKey: MockSharedStepDetail.sqlStatementTabActiveKey
      })
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockGetInstanceSchemas).toHaveBeenCalledTimes(2);
    expect(mockGetInstance).toHaveBeenCalledTimes(2);
    expect(mockGetSystemModuleStatus).toHaveBeenCalledTimes(2);
  });

  it('should get instance info when isRollbackMode is true and instanceList not undefined', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlExecWorkflow: {
          clonedExecWorkflowSqlAuditInfo: {
            databaseInfo: [
              {
                instanceName: 'mysql-1',
                instanceSchema: 'test'
              }
            ]
          }
        }
      })
    );
    const mockGetInstanceSchemas = instance.getInstanceSchemas();
    const mockGetInstance = instance.getInstance();
    const mockGetSystemModuleStatus = system.getSystemModuleStatus();
    const spy = jest.spyOn(useCreationMode, 'default');
    spy.mockImplementation(() => ({
      isCloneMode: false,
      isAssociationVersionMode: false,
      versionId: undefined,
      versionName: undefined,
      rollbackWorkflowId: undefined,
      isRollbackMode: true
    }));
    renderHook(() =>
      useRenderDatabaseSelectionItems({
        dbSourceInfoCollection: MockSharedStepDetail.dbSourceInfoCollection,
        sqlStatementTabActiveKey: MockSharedStepDetail.sqlStatementTabActiveKey,
        instanceList: [
          {
            instance_name: 'mysql-1',
            enable_backup: true,
            supported_backup_strategy: [
              InstanceTipResV2SupportedBackupStrategyEnum.manual,
              InstanceTipResV2SupportedBackupStrategyEnum.none,
              InstanceTipResV2SupportedBackupStrategyEnum.original_row,
              InstanceTipResV2SupportedBackupStrategyEnum.reverse_sql
            ],
            backup_max_rows: 2000
          }
        ]
      })
    );
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledTimes(3);
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledWith('0', {
      instanceName: 'mysql-1',
      schemaName: undefined,
      getSchemaLoading: true,
      schemaList: [],
      ruleTemplate: undefined,
      dbType: undefined,
      testConnectResult: undefined,
      isSupportFileModeExecuteSql: true,
      enableBackup: true,
      allowBackup: true,
      backupMaxRows: 2000
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockGetInstanceSchemas).toHaveBeenCalledTimes(1);
    expect(mockGetInstance).toHaveBeenCalledTimes(1);
    expect(mockGetSystemModuleStatus).toHaveBeenCalledTimes(1);
  });
});
