import { useDispatch } from 'react-redux';
import {
  IWorkflowResV2,
  IAuditTaskResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  WorkflowResV2ModeEnum,
  AuditTaskResV1SqlSourceEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  updateClonedExecWorkflowSqlAuditInfo,
  updateClonedExecWorkflowBaseInfo
} from '../../../../store/sqlExecWorkflow';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useCallback } from 'react';
import { SqlStatementFields } from '../../Create/index.type';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { ResponseCode } from '@actiontech/dms-kit';
import { jsonParse } from '@actiontech/dms-kit';
import { ResponseBlobJsonType } from '@actiontech/dms-kit';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';

const useCloneExecWorkflowInfo = (
  taskInfos: IAuditTaskResV1[],
  workflowInfo?: IWorkflowResV2
) => {
  const dispatch = useDispatch();

  const navigate = useTypedNavigate();

  const { projectID, projectName } = useCurrentProject();

  const getTaskAllSql = (task_id?: number) => {
    return task
      .getAuditTaskSQLsV2({
        task_id: `${task_id ?? ''}`,
        page_index: '1',
        page_size: '9999'
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data?.reduce((p, n) => {
            return `${p}${n.exec_sql ?? ''}`;
          }, '');
        }
      });
  };

  const getSqlUploadFileContent = useCallback(
    (task_id?: number) => {
      return workflow
        .getWorkflowAttachment(
          {
            project_name: projectName,
            workflow_id: workflowInfo?.workflow_id ?? '',
            task_id: task_id?.toString() ?? ''
          },
          { responseType: 'blob' }
        )
        .then((res) => {
          return res.data.text().then((text: string) => {
            const json = jsonParse<ResponseBlobJsonType>(text);
            if (!!json.code && !!json.message) {
              return null;
            }
            return res.data;
          });
        });
    },
    [projectName, workflowInfo?.workflow_id]
  );

  const executeInOtherInstance = useCallback(async () => {
    const isSameSqlForAll =
      workflowInfo?.mode === WorkflowResV2ModeEnum.same_sqls;
    const sqlStatement: { [key: string]: SqlStatementFields } = {};
    if (isSameSqlForAll) {
      const isFormDataUploadType = taskInfos.every(
        (i) => i.sql_source === AuditTaskResV1SqlSourceEnum.form_data
      );
      const isSqlFileUploadType = taskInfos.every(
        (i) => i.sql_source === AuditTaskResV1SqlSourceEnum.sql_file
      );
      const isZipFileUploadType = taskInfos.every(
        (i) => i.sql_source === AuditTaskResV1SqlSourceEnum.zip_file
      );

      // 因为是相同sql模式 所以文件信息 执行模式 文件排序等 默认取第一个task中的数据
      const defaultTask = taskInfos[0];
      const fileName = defaultTask?.audit_files?.[0]?.file_name ?? '';

      if (isFormDataUploadType) {
        await getTaskAllSql(defaultTask.task_id).then((res) => {
          sqlStatement['0'] = {
            currentUploadType: AuditTaskResV1SqlSourceEnum.form_data,
            form_data: res,
            backup: defaultTask.enable_backup,
            backupMaxRows: defaultTask.backup_max_rows
          } as SqlStatementFields;
        });
      } else if (isSqlFileUploadType) {
        await getSqlUploadFileContent(defaultTask.task_id).then((res) => {
          sqlStatement['0'] = {
            currentUploadType: AuditTaskResV1SqlSourceEnum.sql_file,
            sql_file: res ? [new File([res], fileName)] : undefined,
            exec_mode: defaultTask.exec_mode,
            backup: defaultTask.enable_backup,
            backupMaxRows: defaultTask.backup_max_rows
          } as SqlStatementFields;
        });
      } else if (isZipFileUploadType) {
        await getSqlUploadFileContent(defaultTask.task_id).then((res) => {
          sqlStatement['0'] = {
            currentUploadType: AuditTaskResV1SqlSourceEnum.zip_file,
            zip_file: res ? [new File([res], fileName)] : undefined,
            exec_mode: defaultTask.exec_mode,
            file_sort_method: defaultTask.file_order_method,
            backup: defaultTask.enable_backup,
            backupMaxRows: defaultTask.backup_max_rows
          } as SqlStatementFields;
        });
      }
    } else {
      const requestList = taskInfos.map((taskInfo) => {
        const isFormDataUploadType =
          taskInfo.sql_source === AuditTaskResV1SqlSourceEnum.form_data;
        const isSqlFileUploadType =
          taskInfo.sql_source === AuditTaskResV1SqlSourceEnum.sql_file;
        const isZipFileUploadType =
          taskInfo.sql_source === AuditTaskResV1SqlSourceEnum.zip_file;

        const fileName = taskInfo.audit_files?.[0]?.file_name ?? '';

        if (isFormDataUploadType) {
          return getTaskAllSql(taskInfo.task_id).then((res) => {
            return {
              currentUploadType: AuditTaskResV1SqlSourceEnum.form_data,
              form_data: res,
              backup: taskInfo.enable_backup,
              backupMaxRows: taskInfo.backup_max_rows
            } as SqlStatementFields;
          });
        } else if (isSqlFileUploadType) {
          return getSqlUploadFileContent(taskInfo.task_id).then((res) => {
            return {
              currentUploadType: AuditTaskResV1SqlSourceEnum.sql_file,
              sql_file: res ? [new File([res], fileName)] : undefined,
              exec_mode: taskInfo.exec_mode,
              backup: taskInfo.enable_backup,
              backupMaxRows: taskInfo.backup_max_rows
            } as SqlStatementFields;
          });
        } else if (isZipFileUploadType) {
          return getSqlUploadFileContent(taskInfo.task_id).then((res) => {
            return {
              currentUploadType: AuditTaskResV1SqlSourceEnum.zip_file,
              zip_file: res ? [new File([res], fileName)] : undefined,
              exec_mode: taskInfo.exec_mode,
              file_sort_method: taskInfo.file_order_method,
              backup: taskInfo.enable_backup,
              backupMaxRows: taskInfo.backup_max_rows
            } as SqlStatementFields;
          });
        }
        return null;
      });
      await Promise.all(requestList).then((res) => {
        res.forEach((r, i) => {
          if (r) {
            sqlStatement[i] = r;
          }
        });
      });
    }
    dispatch(
      updateClonedExecWorkflowBaseInfo({
        workflow_subject: workflowInfo?.workflow_name ?? '',
        desc: workflowInfo?.desc ?? ''
      })
    );

    dispatch(
      updateClonedExecWorkflowSqlAuditInfo({
        isSameSqlForAll:
          workflowInfo?.mode === WorkflowResV2ModeEnum.same_sqls ? true : false,
        databaseInfo: taskInfos.map((taskInfo) => {
          return {
            instanceName: taskInfo.instance_name,
            instanceSchema: taskInfo.instance_schema
          };
        }),
        ...sqlStatement
      })
    );
    navigate(ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create, {
      params: { projectID },
      queries: { sourceWorkflowId: workflowInfo?.workflow_id ?? '' }
    });
  }, [
    taskInfos,
    workflowInfo,
    dispatch,
    getSqlUploadFileContent,
    navigate,
    projectID
  ]);

  return {
    executeInOtherInstance
  };
};

export default useCloneExecWorkflowInfo;
