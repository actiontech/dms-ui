import DataExportTask from '@actiontech/shared/lib/api/base/service/DataExportTask';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useForm, useWatch } from 'antd/es/form/Form';
import useCreateDataExportReduxManage from './index.redux';
import {
  BaseFormFieldsType,
  MethodFormFieldsType,
  SourceFormFieldsType
} from '../components/CreateTask/index.type';
import {
  isSupportLanguage,
  ResponseCode,
  SQL_EDITOR_PLACEHOLDER_VALUE
} from '@actiontech/dms-kit';
import { formatterSQL } from '@actiontech/dms-kit';

const useCreateExportTaskForm = () => {
  const [baseForm] = useForm<BaseFormFieldsType>();
  const [sourceForm] = useForm<SourceFormFieldsType>();
  const [methodForm] = useForm<MethodFormFieldsType>();

  const formatted = useWatch('formatted', methodForm);
  const originSql = useWatch('originSql', methodForm);

  const { projectID } = useCurrentProject();
  const { auditLoading, updateAuditLoading, updateFormValues, updateTaskIDs } =
    useCreateDataExportReduxManage();

  const formatSQLAction = async () => {
    const currentSQL = methodForm.getFieldValue('sql');
    const dbType = sourceForm.getFieldValue('dbType');

    if (dbType && currentSQL !== SQL_EDITOR_PLACEHOLDER_VALUE) {
      if (formatted && !isSupportLanguage(dbType)) {
        methodForm.setFieldsValue({
          sql: originSql,
          formatted: false
        });
        return;
      }
      methodForm.setFieldsValue({
        sql: formatterSQL(currentSQL, dbType),
        formatted: true,
        originSql: currentSQL
      });
    }
  };

  const resetAllForms = () => {
    baseForm.resetFields();
    sourceForm.resetFields();
    methodForm.resetFields();
  };

  const auditAction = async () => {
    const baseValues = await baseForm.validateFields();
    const sourceValues = await sourceForm.validateFields();
    const methodValues = await methodForm.validateFields();

    updateAuditLoading(true);

    const sql = isSupportLanguage(sourceValues.dbType)
      ? methodValues.sql
      : methodValues.originSql;
    return DataExportTask.AddDataExportTask({
      project_uid: projectID,
      data_export_tasks: [
        {
          database_name: sourceValues.schema,
          db_service_uid: sourceValues.dbService,
          export_sql: sql
        }
      ]
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          updateFormValues({ baseValues, sourceValues, methodValues });
          updateTaskIDs(res.data.data?.data_export_task_uids ?? []);
          return true;
        }
        return false;
      })
      .finally(() => {
        updateAuditLoading(false);
      });
  };

  return {
    baseForm,
    sourceForm,
    methodForm,
    auditLoading,
    formatSQLAction,
    auditAction,
    resetAllForms,
    formatted
  };
};

export default useCreateExportTaskForm;
