import i18n from 'i18next';
import { useBoolean } from 'ahooks';
import { Key } from 'antd/es/table/interface';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  BatchUpdateSqlManageReqStatusEnum,
  SqlManageStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useMemo } from 'react';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { SqlManageOptimisticWritePayload } from '../optimisticWrite';

const useBatchIgnoreOrSolve = (
  hasPermissionAndNotArchive: boolean,
  selectedRowKeys: Key[],
  batchSuccessOperate: (
    message: string,
    payload?: SqlManageOptimisticWritePayload
  ) => void
) => {
  const { projectName } = useCurrentProject();

  const selectedRowKeysNum = useMemo(
    () => selectedRowKeys.map((v) => Number(v)),
    [selectedRowKeys]
  );

  const [
    batchIgnoreLoading,
    { setFalse: finishBatchIgnore, setTrue: startBatchIgnore }
  ] = useBoolean();
  const [
    batchSolveLoading,
    { setFalse: finishBatchSolve, setTrue: startBatchSolve }
  ] = useBoolean();

  const onBatchSolve = () => {
    if (!hasPermissionAndNotArchive || selectedRowKeys.length === 0) {
      return;
    }
    startBatchSolve();
    SqlManage.BatchUpdateSqlManage({
      project_name: projectName,
      status: BatchUpdateSqlManageReqStatusEnum.solved,
      sql_manage_id_list: selectedRowKeysNum
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          batchSuccessOperate(
            i18n.t('sqlManagement.table.action.batch.solveSuccessTips'),
            {
              ids: selectedRowKeysNum,
              patch: { status: SqlManageStatusEnum.solved }
            }
          );
        }
      })
      .finally(() => {
        finishBatchSolve();
      });
  };

  const onBatchIgnore = () => {
    if (!hasPermissionAndNotArchive || selectedRowKeys.length === 0) {
      return;
    }
    startBatchIgnore();
    SqlManage.BatchUpdateSqlManage({
      project_name: projectName,
      status: BatchUpdateSqlManageReqStatusEnum.ignored,
      sql_manage_id_list: selectedRowKeysNum
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          batchSuccessOperate(
            i18n.t('sqlManagement.table.action.batch.ignoreSuccessTips'),
            {
              ids: selectedRowKeysNum,
              patch: { status: SqlManageStatusEnum.ignored }
            }
          );
        }
      })
      .finally(() => {
        finishBatchIgnore();
      });
  };

  return {
    batchSolveLoading,
    batchIgnoreLoading,
    onBatchSolve,
    onBatchIgnore
  };
};

export default useBatchIgnoreOrSolve;
