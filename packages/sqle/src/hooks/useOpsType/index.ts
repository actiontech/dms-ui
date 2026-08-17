import { useCallback, useMemo, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { DmsApi, SqleApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import type { IOpsType } from '@actiontech/shared/lib/api/base/service/common';

export {
  canMaintainOpsTypeDictionary,
  resolveOpsTypeEditableSelectPermissions,
  OPS_TYPE_EDITABLE_PERMISSIONS_ON,
  OPS_TYPE_EDITABLE_PERMISSIONS_OFF
} from './permissions';
export type {
  OpsTypeEditableSelectPermissions,
  ResolveOpsTypeEditablePermissionsInput
} from './permissions';
export { default as useOpsTypeEditablePermissions } from './useOpsTypeEditablePermissions';

export type OpsTypeDeleteResult =
  | { ok: true }
  | {
      ok: false;
      errorMessage: string;
      sqlWorkflowTotal: number;
      dataExportWorkflowTotal: number;
    };

/** 删除被引用时的 i18n 键（zh/en 见 execWorkflow.create.form.baseInfo） */
export const OPS_TYPE_DELETE_REFERENCED_I18N_KEY =
  'execWorkflow.create.form.baseInfo.deleteOpsTypeReferenced';

/** @deprecated 仅兼容既有单测断言默认中文文案；运行时请用 hook 内 t(key) */
export const OPS_TYPE_DELETE_REFERENCED_MESSAGE =
  '该运维类型已被工单引用，暂无法删除';

export type OpsTypeReferenceTotals = {
  sqlWorkflowTotal: number;
  dataExportWorkflowTotal: number;
};

/** 任一引用 total > 0 则拦截删除（不调用 DeleteOpsType） */
export const shouldBlockOpsTypeDelete = (
  sqlWorkflowTotal: number,
  dataExportWorkflowTotal: number
): boolean => sqlWorkflowTotal > 0 || dataExportWorkflowTotal > 0;

/**
 * 删除前双类工单引用预检（取 total_nums；page_size=1 仅需总数）。
 * 任一 > 0 则视为仍被引用。
 */
export const checkOpsTypeReferences = async (
  projectID: string,
  projectName: string,
  opsTypeUid: string
): Promise<OpsTypeReferenceTotals> => {
  const [sqlRes, exportRes] = await Promise.all([
    SqleApi.WorkflowService.getWorkflowsV1({
      project_name: projectName,
      filter_by_ops_type_uid: opsTypeUid,
      page_index: 1,
      page_size: 1
    }),
    DmsApi.DataExportWorkflowsService.ListDataExportWorkflows({
      project_uid: projectID,
      filter_by_ops_type_uid: opsTypeUid,
      page_index: 1,
      page_size: 1
    })
  ]);

  const sqlWorkflowTotal =
    sqlRes.data.code === ResponseCode.SUCCESS ? sqlRes.data.total_nums ?? 0 : 0;
  const dataExportWorkflowTotal =
    exportRes.data.code === ResponseCode.SUCCESS
      ? exportRes.data.total_nums ?? 0
      : 0;

  return { sqlWorkflowTotal, dataExportWorkflowTotal };
};

const useOpsType = () => {
  const { t } = useTranslation();
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<
    string | undefined
  >();
  const [
    operationLoading,
    { setTrue: startOperationLoading, setFalse: stopOperationLoading }
  ] = useBoolean();

  const {
    data,
    loading,
    run: updateOpsTypeList
  } = useRequest(
    (projectID: string) => {
      return DmsApi.ProjectService.ListOpsTypes({
        page_size: 1000,
        project_uid: projectID
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data ?? [];
          }
          return [] as IOpsType[];
        })
        .catch(() => {
          return [] as IOpsType[];
        });
    },
    {
      manual: true
    }
  );

  const opsTypeOptions = useMemo(() => {
    return (
      data?.map((opsType) => ({
        label: opsType.name ?? '',
        value: opsType.uid ?? ''
      })) ?? []
    );
  }, [data]);

  const clearDeleteError = useCallback(() => {
    setDeleteErrorMessage(undefined);
  }, []);

  const createOpsType = useCallback(
    async (projectID: string, opsTypeName: string) => {
      startOperationLoading();
      try {
        const res = await DmsApi.ProjectService.CreateOpsType({
          project_uid: projectID,
          ops_type_name: opsTypeName
        });
        if (res.data.code === ResponseCode.SUCCESS) {
          await updateOpsTypeList(projectID);
          return true;
        }
        return false;
      } finally {
        stopOperationLoading();
      }
    },
    [startOperationLoading, stopOperationLoading, updateOpsTypeList]
  );

  const updateOpsType = useCallback(
    async (projectID: string, opsTypeUid: string, opsTypeName: string) => {
      startOperationLoading();
      try {
        const res = await DmsApi.ProjectService.UpdateOpsType({
          project_uid: projectID,
          ops_type_uid: opsTypeUid,
          ops_type_name: opsTypeName
        });
        if (res.data.code === ResponseCode.SUCCESS) {
          await updateOpsTypeList(projectID);
          return true;
        }
        return false;
      } finally {
        stopOperationLoading();
      }
    },
    [startOperationLoading, stopOperationLoading, updateOpsTypeList]
  );

  const deleteOpsType = useCallback(
    async (
      projectID: string,
      projectName: string,
      opsTypeUid: string
    ): Promise<OpsTypeDeleteResult> => {
      startOperationLoading();
      setDeleteErrorMessage(undefined);
      try {
        const { sqlWorkflowTotal, dataExportWorkflowTotal } =
          await checkOpsTypeReferences(projectID, projectName, opsTypeUid);

        if (
          shouldBlockOpsTypeDelete(sqlWorkflowTotal, dataExportWorkflowTotal)
        ) {
          const referencedMessage = t(OPS_TYPE_DELETE_REFERENCED_I18N_KEY);
          setDeleteErrorMessage(referencedMessage);
          return {
            ok: false,
            errorMessage: referencedMessage,
            sqlWorkflowTotal,
            dataExportWorkflowTotal
          };
        }

        const delRes = await DmsApi.ProjectService.DeleteOpsType({
          project_uid: projectID,
          ops_type_uid: opsTypeUid
        });
        if (delRes.data.code === ResponseCode.SUCCESS) {
          await updateOpsTypeList(projectID);
          return { ok: true };
        }
        return {
          ok: false,
          errorMessage:
            delRes.data.message || t(OPS_TYPE_DELETE_REFERENCED_I18N_KEY),
          sqlWorkflowTotal: 0,
          dataExportWorkflowTotal: 0
        };
      } finally {
        stopOperationLoading();
      }
    },
    [startOperationLoading, stopOperationLoading, t, updateOpsTypeList]
  );

  return {
    opsTypeList: data ?? [],
    opsTypeOptions,
    loading,
    operationLoading,
    updateOpsTypeList,
    createOpsType,
    updateOpsType,
    deleteOpsType,
    deleteErrorMessage,
    clearDeleteError
  };
};

export default useOpsType;
