import i18n from 'i18next';
import { useBoolean } from 'ahooks';
import { Key } from 'antd/es/table/interface';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { BatchUpdateSqlManageReqStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useMemo } from 'react';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const useBatchAction = (
  actionPermission: boolean,
  selectedRowKeys: Key[],
  batchSuccessOperate: (message: string) => void
) => {
  const { projectName } = useCurrentProject();

  const selectedRowKeysNum = useMemo(
    () => selectedRowKeys.map((v) => Number(v)),
    [selectedRowKeys]
  );

  const [
    batchActionsLoading,
    { setFalse: finishBatchAction, setTrue: startBatchAction }
  ] = useBoolean();

  const onBatchSolve = () => {
    if (!actionPermission || selectedRowKeys.length === 0) {
      return;
    }
    startBatchAction();
    SqlManage.BatchUpdateSqlManage({
      project_name: projectName,
      status: BatchUpdateSqlManageReqStatusEnum.solved,
      sql_manage_id_list: selectedRowKeysNum
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          batchSuccessOperate(
            i18n.t('sqlManagement.table.action.batch.solveSuccessTips')
          );
        }
      })
      .finally(() => {
        finishBatchAction();
      });
  };
  const onBatchIgnore = () => {
    if (!actionPermission || selectedRowKeys.length === 0) {
      return;
    }
    startBatchAction();
    SqlManage.BatchUpdateSqlManage({
      project_name: projectName,
      status: BatchUpdateSqlManageReqStatusEnum.ignored,
      sql_manage_id_list: selectedRowKeysNum
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          batchSuccessOperate(
            i18n.t('sqlManagement.table.action.batch.ignoreSuccessTips')
          );
        }
      })
      .finally(() => {
        finishBatchAction();
      });
  };

  return {
    batchActionsLoading,
    onBatchSolve,
    onBatchIgnore
  };
};

export default useBatchAction;
