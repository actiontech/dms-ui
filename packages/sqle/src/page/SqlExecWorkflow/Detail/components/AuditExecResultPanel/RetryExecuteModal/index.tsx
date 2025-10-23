import {
  BasicTable,
  useTableRequestParams,
  ResponseCode,
  BasicButton,
  BasicTypographyEllipsis,
  ROUTE_PATHS
} from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetAuditTaskSQLsV2Params } from '@actiontech/shared/lib/api/sqle/service/task/index.d';
import { useEffect, useState } from 'react';
import { SQLRenderer, useTypedParams } from '@actiontech/shared';
import { Space, message } from 'antd';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import {
  RetryExecuteModalStyleWrapper,
  RetryExecuteModalTitleDescStyleWrapper
} from './style';
import ExecStatusTag from '../TaskResultList/Common/ResultCard/components/ExecStatusTag';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../../../store';
import { ModalName } from '../../../../../../data/ModalName';
import { updateSqlExecWorkflowModalStatus } from '../../../../../../store/sqlExecWorkflow/index';
import EmitterKey from '../../../../../../data/EmitterKey';
import EventEmitter from '../../../../../../utils/EventEmitter';

const RetryExecuteModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const urlParams =
    useTypedParams<typeof ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail>();

  const { taskId, execSqlId, pageIndex, pageSize, visible } = useSelector(
    (state: IReduxState) => ({
      taskId: state.sqlExecWorkflow.retryExecuteData?.taskId ?? '',
      execSqlId: state.sqlExecWorkflow.retryExecuteData?.execSqlId,
      pageIndex: state.sqlExecWorkflow.retryExecuteData?.pageIndex,
      pageSize: state.sqlExecWorkflow.retryExecuteData?.pageSize,
      visible:
        !!state.sqlExecWorkflow.modalStatus[
          ModalName.Sql_Exec_Workflow_Retry_Execute_Modal
        ]
    })
  );

  const { projectName } = useCurrentProject();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [allSelectedKeys, setAllSelectedKeys] = useState<React.Key[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const { tableChange, pagination } = useTableRequestParams<
    IAuditTaskSQLResV2,
    IGetAuditTaskSQLsV2Params
  >();

  const { data, loading } = useRequest(
    () => {
      return task
        .getAuditTaskSQLsV2({
          page_index: `${pagination.page_index}`,
          page_size: `${pagination.page_size}`,
          task_id: taskId
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data;
          }
        });
    },
    {
      ready: visible && !!taskId,
      refreshDeps: [taskId, pagination],
      onSuccess: (result) => {
        const currentPageKeys =
          result?.data?.map((item) => item.exec_sql_id) || [];
        const currentPageSelectedKeys = allSelectedKeys.filter((key) =>
          currentPageKeys.includes(Number(key))
        );
        setSelectedRowKeys(currentPageSelectedKeys);
      }
    }
  );

  const { run: retryExecute, loading: retryExecuteLoading } = useRequest(
    () => {
      return workflow
        .reExecuteTaskOnWorkflowV1({
          project_name: projectName,
          workflow_id: urlParams.workflowId ?? '',
          task_id: taskId,
          exec_sql_ids: allSelectedKeys as number[]
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('execWorkflow.detail.overview.table.retryExecuteSuccess')
            );
            handleClose();
            EventEmitter.emit(EmitterKey.Sql_Retry_Execute_Done, taskId);
          }
        });
    },
    {
      manual: true
    }
  );

  const handleClose = () => {
    setSelectedRowKeys([]);
    setAllSelectedKeys([]);
    tableChange(
      {
        current: 1,
        pageSize: 20
      },
      {},
      {},
      {
        action: 'paginate',
        currentDataSource: []
      }
    );
    dispatch(
      updateSqlExecWorkflowModalStatus({
        modalName: ModalName.Sql_Exec_Workflow_Retry_Execute_Modal,
        status: false
      })
    );
  };

  useEffect(() => {
    if (pageIndex && pageSize && visible) {
      tableChange(
        {
          current: pageIndex,
          pageSize: pageSize
        },
        {},
        {},
        {
          action: 'paginate',
          currentDataSource: []
        }
      );
    }

    if (execSqlId && !allSelectedKeys.length && visible) {
      setAllSelectedKeys([execSqlId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, visible, tableChange, execSqlId]);

  const handleRetryExecute = () => {
    if (!allSelectedKeys.length) {
      messageApi.error(t('execWorkflow.detail.overview.table.pleaseSelectSql'));
      return;
    }
    retryExecute();
  };

  return (
    <RetryExecuteModalStyleWrapper
      open={visible}
      size="large"
      title={
        <Space>
          {t('execWorkflow.detail.overview.table.selectRetryExecuteSql')}
          <RetryExecuteModalTitleDescStyleWrapper type="secondary">
            {t('execWorkflow.detail.overview.table.selectRetryExecuteSqlDesc')}
          </RetryExecuteModalTitleDescStyleWrapper>
        </Space>
      }
      footer={
        <Space>
          <BasicButton onClick={handleClose}>{t('common.cancel')}</BasicButton>
          <BasicButton
            type="primary"
            onClick={handleRetryExecute}
            loading={retryExecuteLoading}
          >
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
      closable={false}
      centered
    >
      {contextHolder}
      <BasicTable
        rowKey="exec_sql_id"
        columns={[
          {
            dataIndex: 'exec_sql',
            title: 'SQL',
            width: 350,
            render: (sql) => {
              if (!sql) return null;
              return (
                <SQLRenderer.Snippet
                  tooltip={false}
                  sql={sql}
                  rows={1}
                  showCopyIcon
                  cuttingLength={200}
                />
              );
            }
          },
          {
            dataIndex: 'exec_status',
            width: 110,
            title: () => t('execWorkflow.audit.table.execStatus'),
            render: (status) => {
              return <ExecStatusTag status={status} />;
            }
          },
          {
            dataIndex: 'exec_result',
            className: 'ellipsis-column-width',
            title: () => t('execWorkflow.audit.table.execResult'),
            render: (result) => {
              return result ? (
                <BasicTypographyEllipsis textCont={result} />
              ) : (
                '-'
              );
            }
          }
        ]}
        dataSource={data?.data}
        onChange={tableChange}
        pagination={{
          total: data?.total_nums ?? 0,
          current: pagination.page_index,
          pageSize: pagination.page_size
        }}
        loading={loading || retryExecuteLoading}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys) => {
            setSelectedRowKeys(selectedKeys);

            const currentPageKeys =
              data?.data?.map((item) => item.exec_sql_id) || [];

            const otherPageSelectedKeys = allSelectedKeys.filter(
              (key) => !currentPageKeys.includes(Number(key))
            );
            const newAllSelectedKeys = [
              ...otherPageSelectedKeys,
              ...selectedKeys
            ];
            setAllSelectedKeys(newAllSelectedKeys);
          },
          columnWidth: 60,
          getCheckboxProps: (record) => {
            return {
              disabled:
                record.exec_status ===
                getAuditTaskSQLsV2FilterExecStatusEnum.succeeded
            };
          }
        }}
        scroll={{ y: '500px' }}
      />
    </RetryExecuteModalStyleWrapper>
  );
};

export default RetryExecuteModal;
