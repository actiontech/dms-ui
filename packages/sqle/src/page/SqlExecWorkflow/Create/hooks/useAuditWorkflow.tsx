import { useBoolean } from 'ahooks';
import { useCallback, useState } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useAllowAuditLevel } from './useAllowAuditLevel';
import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  AuditTaskResV1SqlSourceEnum,
  CreateAuditTaskReqV1ExecModeEnum,
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  ICreateAuditTasksV1Params,
  IAuditTaskGroupIdV1Params,
  ICreateAndAuditTaskV1Params
} from '@actiontech/shared/lib/api/sqle/service/task/index.d';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  SqlAuditInfoFormFields,
  SqlStatementFields,
  CreateWorkflowDatabaseInfo
} from '../index.type';
import { SAME_SQL_MODE_DEFAULT_FIELD_KEY } from '../../Common/SqlStatementFormController/SqlStatementFormItem/index.data';

const useAuditWorkflow = () => {
  const { projectName } = useCurrentProject();
  const [taskInfos, setTaskInfos] = useState<IAuditTaskResV1[]>([]);
  const [
    isDisableFinallySubmitButton,
    {
      setTrue: disableFinallySubmitButton,
      setFalse: cancelDisableFinallySubmitButton
    }
  ] = useBoolean(false);

  const {
    disabledOperatorWorkflowBtnTips,
    judgeAuditLevel,
    setDisabledOperatorWorkflowBtnTips
  } = useAllowAuditLevel();

  const resetFinallySubmitButtonStatus = useCallback(() => {
    cancelDisableFinallySubmitButton();
    setDisabledOperatorWorkflowBtnTips('');
  }, [cancelDisableFinallySubmitButton, setDisabledOperatorWorkflowBtnTips]);

  const commonJudgeAuditLevel = useCallback(
    (tasks: IAuditTaskResV1[]) => {
      judgeAuditLevel(
        tasks.map((v) => ({
          projectName,
          instanceName: v.instance_name ?? '',
          currentAuditLevel: v.audit_level as
            | WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
            | undefined
        })) ?? [],
        disableFinallySubmitButton,
        cancelDisableFinallySubmitButton
      );
    },
    [
      cancelDisableFinallySubmitButton,
      disableFinallySubmitButton,
      judgeAuditLevel,
      projectName
    ]
  );

  const getSqlSourceWithUploadType = (
    sqlStatementInfo: SqlStatementFields
  ):
    | Pick<
        IAuditTaskGroupIdV1Params | ICreateAndAuditTaskV1Params,
        'sql' | 'input_sql_file' | 'input_zip_file'
      >
    | undefined => {
    const currentSqlUpload = sqlStatementInfo.currentUploadType;

    if (currentSqlUpload === AuditTaskResV1SqlSourceEnum.form_data) {
      return {
        sql: sqlStatementInfo.form_data
      };
    }
    if (currentSqlUpload === AuditTaskResV1SqlSourceEnum.sql_file) {
      return {
        input_sql_file: sqlStatementInfo.sql_file?.[0]
      };
    }
    if (currentSqlUpload === AuditTaskResV1SqlSourceEnum.zip_file) {
      return {
        input_zip_file: sqlStatementInfo.zip_file?.[0]
      };
    }
  };

  /**
   * 相同 sql 模式下的表单提交
   * @param values 提交的表单数据
   *
   * 2024.04.23 changelog: 支持sql上线、文件上线模式
   *
   * values 数据格式:
   * {
   *    SAME_SQL_MODE_DEFAULT_FIELD_KEY: SqlStatementFields, sql语句信息, 因为相同sql模式下只会有一份该数据
   *    databaseInfo:  Array<DatabaseInfoFields>, 数据源以及数据库信息, 可能会有多份
   *    other data
   * }
   * 1. 首先使用 createAuditTasksV1 接口提交数据 获取 task_group_id
   * 2. 再使用 auditTaskGroupIdV1 提交后获取最后的 tasks 数据
   * 3. 通过 tasks 数据去判断是否可以进行最后的创建或者修改. 大致逻辑为判断 sql 语句的规则等级, 详细逻辑见 useAllowAuditLevel
   * 4. 返回 taskInfos
   */
  const auditWorkflowWithSameSql = useCallback(
    async (values: SqlAuditInfoFormFields, onSuccess?: () => void) => {
      const sqlStatementInfo = values[
        SAME_SQL_MODE_DEFAULT_FIELD_KEY
      ] as SqlStatementFields;

      const createAuditTasksParams: ICreateAuditTasksV1Params = {
        // #if [ee]
        exec_mode: sqlStatementInfo.exec_mode,
        file_order_method: sqlStatementInfo.file_sort_method,
        // #endif
        project_name: projectName,
        instances:
          values.databaseInfo.map((v) => ({
            instance_name: v.instanceName,
            instance_schema: v.instanceSchema
          })) ?? []
      };
      const taskGroupInfo = await task.createAuditTasksV1(
        createAuditTasksParams
      );
      if (
        taskGroupInfo.data.code === ResponseCode.SUCCESS &&
        taskGroupInfo.data.data?.task_group_id
      ) {
        const auditTaskPrams: IAuditTaskGroupIdV1Params = {
          task_group_id: taskGroupInfo.data.data?.task_group_id,
          ...getSqlSourceWithUploadType(sqlStatementInfo)
        };
        const res = await task.auditTaskGroupIdV1(auditTaskPrams);
        if (res && res.data.code === ResponseCode.SUCCESS) {
          const tasks = res.data.data?.tasks ?? [];
          setTaskInfos(tasks);
          if (tasks.length > 0) {
            commonJudgeAuditLevel(tasks);
          }
          onSuccess?.();
        }
      }
    },
    [commonJudgeAuditLevel, projectName]
  );

  /**
   * 不同 sql 模式下的表单提交
   *
   * 2023.09.19 changelog: 审核多数据源时批量审核
   *
   * 2024.04.23 changelog: 支持sql上线、文件上线模式
   *
   * @param values 提交的表单数据
   *
   * values 数据格式
   * {
   *   [key in {0, 1, 2...}]: SqlStatementFields, sql语句信息, 因为不同sql模式下只会多份数据, 这里的 key 值对应的是 sql 语句录入 的 tabs 的 key, 也是 DataSourceSchemaCollection 中的 key
   *   databaseInfo:  Array<DatabaseInfoFields>, 数据源以及数据库信息, 可能会有多份
   *   other data
   * }
   *
   * 1. 直接通过 createAndAuditTaskV1 获取 taskInfo 数据
   * 2. 因为每次提交时 仅仅只对当前 tab 下个 sql 语句进行审核, 所以需要注意的是再次对已经审核过的 tab 时, 需要使用新的 taskInfo 替换掉之前的数据
   */
  const auditWorkflowWthDifferenceSql = useCallback(
    async (
      values: SqlAuditInfoFormFields,
      databaseInfo: CreateWorkflowDatabaseInfo,
      onSuccess?: () => void
    ) => {
      const params: ICreateAndAuditTaskV1Params[] = databaseInfo.map((item) => {
        const sqlStatementInfo = values[item.key] as SqlStatementFields;

        return {
          project_name: projectName,
          instance_name: item.instanceName!,
          instance_schema: item.schemaName,
          ...getSqlSourceWithUploadType(sqlStatementInfo),
          // #if [ee]
          exec_mode:
            sqlStatementInfo.exec_mode as unknown as CreateAuditTaskReqV1ExecModeEnum,
          file_order_method: sqlStatementInfo.file_sort_method
          // #endif
        };
      });

      const results = await Promise.all(
        params.map((param) => task.createAndAuditTaskV1(param))
      );
      //todo 需要考虑部分成功, 部分失败的情况
      if (
        results.every(
          (res) => res.data.code === ResponseCode.SUCCESS && !!res.data.data
        )
      ) {
        const tasks = results.map((v) => v.data.data!);
        setTaskInfos(tasks);
        if (tasks.length > 0) {
          commonJudgeAuditLevel(tasks);
        }
        onSuccess?.();
      }
    },
    [commonJudgeAuditLevel, projectName]
  );

  const clearTaskInfos = useCallback(() => {
    setTaskInfos([]);
  }, []);

  return {
    taskInfos,
    clearTaskInfos,
    auditWorkflowWithSameSql,
    auditWorkflowWthDifferenceSql,
    isDisableFinallySubmitButton,
    disabledOperatorWorkflowBtnTips,
    resetFinallySubmitButtonStatus
  };
};

export default useAuditWorkflow;
