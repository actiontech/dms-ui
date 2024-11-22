import { SqlRollbackProps } from './index.type';
import {
  EmptyBox,
  PageHeader,
  BasicButton,
  useTypedNavigate
} from '@actiontech/shared';
import { LeftArrowOutlined } from '@actiontech/icons';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo } from 'react';
import {
  WorkflowRollbackSqlTableColumn,
  WorkflowRollbackSelectedSqlTableColumn,
  WorkflowRollbackSqlTableFilterParamType
} from './columns';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { SqlRollbackTableStyleWrapper } from './style';
import { TransferDirection } from 'antd/es/transfer';
import { cloneDeep } from 'lodash';
import {
  TableFilterContainer,
  useTableFilterContainer,
  useTableRequestParams,
  FilterCustomProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import TableTransfer from './TableTransfer';
import { ExpandedBackupSqlType, TableTransferProps } from './index.type';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { SqlExecStatusOptions } from './index.data';
import useInstance from '../../../../../hooks/useInstance';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { groupBy } from 'lodash';
import { SqlStatementFields } from '../../../Create/index.type';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useDispatch } from 'react-redux';
import {
  updateClonedExecWorkflowSqlAuditInfo,
  updateClonedExecWorkflowBaseInfo,
  updateWorkflowRollbackSqlIds
} from '../../../../../store/sqlExecWorkflow';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { Space, SelectProps } from 'antd';

const SqlRollback: React.FC<SqlRollbackProps> = ({
  isAtRollbackStep,
  backToWorkflowDetail,
  taskInfos,
  workflowInfo
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useTypedNavigate();

  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const [selectedList, setSelectedList] = useState<ExpandedBackupSqlType[]>([]);

  const { pagination, tableChange, updateTableFilterInfo, tableFilterInfo } =
    useTableRequestParams<
      ExpandedBackupSqlType,
      WorkflowRollbackSqlTableFilterParamType
    >();

  const { updateAllSelectedFilterItem, filterContainerMeta } =
    useTableFilterContainer(
      WorkflowRollbackSqlTableColumn(),
      updateTableFilterInfo
    );

  const { projectName, projectID } = useCurrentProject();

  const { updateInstanceList, instanceIDOptions, instanceList } = useInstance();

  const { data, loading, mutate } = useRequest(
    () => {
      return workflow
        .GetBackupSqlListV1({
          ...tableFilterInfo,
          page_index: pagination.page_index.toString(),
          page_size: pagination.page_size.toString(),
          project_name: projectName,
          workflow_id: workflowInfo?.workflow_id ?? ''
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return {
              list:
                res.data.data?.map((item) => ({
                  ...item,
                  id: item.exec_sql_id?.toString(),
                  disabled: selectedList.some(
                    (i) => i.id === item.exec_sql_id?.toString()
                  )
                })) || [],
              total: res.data.total_nums || 0
            };
          }
        });
    },
    {
      refreshDeps: [pagination, tableFilterInfo],
      ready: isAtRollbackStep
    }
  );

  const onChange: TableTransferProps['onChange'] = (
    nextTargetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[]
  ) => {
    if (direction === 'left') {
      const selected = selectedList.filter((i) => {
        return !moveKeys.includes(i.id ?? '');
      });
      const clonedData = cloneDeep(data?.list ?? []);
      clonedData.forEach((i) => {
        if (moveKeys.includes(i.id ?? '')) {
          i.disabled = false;
        }
      });
      setSelectedList(selected);
      mutate({
        list: clonedData,
        total: data?.total ?? 0
      });
    } else {
      const selected: ExpandedBackupSqlType[] = [];
      const clonedData = cloneDeep(data?.list ?? []);
      moveKeys.forEach((key) => {
        const dataSource = clonedData.find((i) => {
          if (i.id === key) {
            i.disabled = true;
            return true;
          }
          return false;
        });
        if (dataSource) {
          selected.push(dataSource);
        }
      });
      setSelectedList(selectedList.concat(selected));
      mutate({
        list: clonedData,
        total: data?.total ?? 0
      });
    }
    setTargetKeys(nextTargetKeys);
  };

  const taskInstanceIdOptions = useMemo(() => {
    const instanceNames = taskInfos?.map((i) => i.instance_name);
    const instanceIds = instanceNames?.map(
      (name) => instanceList.find((i) => i.instance_name === name)?.instance_id
    );
    const instanceOptions: SelectProps['options'] = [];
    instanceIDOptions.forEach((instance) => {
      if (instance.options.some((i) => instanceIds?.includes(i.value))) {
        instanceOptions.push({
          ...instance,
          options: instance.options.filter((i) =>
            instanceIds?.includes(i.value)
          )
        });
      }
    });
    return instanceOptions;
  }, [taskInfos, instanceIDOptions, instanceList]);

  const filterCustomProps = useMemo(() => {
    return new Map<keyof ExpandedBackupSqlType, FilterCustomProps>([
      ['instance_name', { options: taskInstanceIdOptions }],
      ['exec_status', { options: SqlExecStatusOptions }]
    ]);
  }, [taskInstanceIdOptions]);

  const onUpdateSqlRemake = (id: string, remark?: string) => {
    const clonedSelectedList = cloneDeep(selectedList);
    const editItemIndex = clonedSelectedList.findIndex((i) => i.id === id) ?? 0;
    clonedSelectedList[editItemIndex].remark = remark;
    setSelectedList(clonedSelectedList);
  };

  const removeMultilineComments = (sql: string) => {
    return sql.replace(/\/\*/g, '--').replace(/\*\//g, '');
  };

  const onCreateWorkflow = () => {
    const sqlStatement: { [key: string]: SqlStatementFields } = {};
    let description = '';
    selectedList.forEach((i) => {
      if (i.remark) {
        description += `${i.remark};`;
      }
    });
    const sqlIds = selectedList.map((i) => i.exec_sql_id ?? 0);
    const taskSqlGroup = groupBy(selectedList, 'origin_task_id');
    const taskIds = Object.keys(taskSqlGroup);
    const databaseInfo = taskIds?.map((id) => {
      const taskInfo = taskInfos?.find((i) => `${i.task_id}` === id) ?? {};
      return {
        instanceName: taskInfo.instance_name,
        instanceSchema: taskInfo.instance_schema
      };
    });

    taskIds.forEach((id, index) => {
      let sqlFormData = '';
      const sortedBackupSqlList = taskSqlGroup[id].sort(
        (a, b) => (a.exec_order ?? 0) - (b.exec_order ?? 0)
      );
      sortedBackupSqlList.forEach((item) => {
        let backupSqlStatement = '';
        backupSqlStatement += `/*${t(
          'execWorkflow.detail.rollback.originSql'
        )}: ${removeMultilineComments(item.origin_sql ?? '')}*/ \n`;
        item.backup_sqls?.forEach((i) => (backupSqlStatement += `${i}\n`));
        sqlFormData += backupSqlStatement;
      });
      sqlStatement[`${index}`] = {
        currentUploadType: AuditTaskResV1SqlSourceEnum.form_data,
        form_data: sqlFormData
      } as SqlStatementFields;
    });
    dispatch(
      updateClonedExecWorkflowBaseInfo({
        workflow_subject: `${workflowInfo?.workflow_name}_Rollback`,
        desc: description
      })
    );

    dispatch(
      updateClonedExecWorkflowSqlAuditInfo({
        isSameSqlForAll: false,
        databaseInfo,
        ...sqlStatement
      })
    );
    dispatch(
      updateWorkflowRollbackSqlIds({
        workflowRollbackSqlIds: sqlIds
      })
    );

    navigate(ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create, {
      params: { projectID },
      queries: {
        rollbackWorkflowId: workflowInfo?.workflow_id
      }
    });
  };

  const onBack = () => {
    setSelectedList([]);
    backToWorkflowDetail();
  };

  useEffect(() => {
    updateInstanceList({
      project_name: projectName,
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_workflow
    });
  }, [updateInstanceList, projectName]);

  useEffect(() => {
    updateAllSelectedFilterItem(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EmptyBox if={isAtRollbackStep}>
      <PageHeader
        title={
          <BasicButton icon={<LeftArrowOutlined />} onClick={onBack}>
            {t('execWorkflow.detail.operator.backToDetail')}
          </BasicButton>
        }
        extra={
          <BasicButton
            type="primary"
            disabled={!selectedList.length}
            onClick={onCreateWorkflow}
          >
            {t('execWorkflow.list.createButtonText')}
          </BasicButton>
        }
      />

      <SqlRollbackTableStyleWrapper>
        <TableTransfer
          dataSource={data?.list ?? []}
          targetKeys={targetKeys}
          showSelectAll={false}
          onChange={onChange}
          leftColumns={WorkflowRollbackSqlTableColumn()}
          rightColumns={WorkflowRollbackSelectedSqlTableColumn(
            onUpdateSqlRemake
          )}
          titles={[
            <Space key="left-table">
              {t('execWorkflow.detail.rollback.allSql')}
              <TableFilterContainer
                filterContainerMeta={filterContainerMeta}
                updateTableFilterInfo={updateTableFilterInfo}
                filterCustomProps={filterCustomProps}
              />
            </Space>,
            t('execWorkflow.detail.rollback.selectedRollbackSql')
          ]}
          loading={loading}
          leftDataSource={data?.list ?? []}
          rightDataSource={selectedList}
          leftPagination={{
            total: data?.total || 0,
            current: pagination.page_index
          }}
          onTableChange={tableChange}
        />
      </SqlRollbackTableStyleWrapper>
    </EmptyBox>
  );
};

export default SqlRollback;
