import DBService from '@actiontech/shared/lib/api/base/service/DBService';
import DataExportTask from '@actiontech/shared/lib/api/base/service/DataExportTask';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useForm } from 'antd/es/form/Form';
import useCreateDataExportReduxManage from './index.redux';
import {
  BaseFormFieldsType,
  MethodFormFieldsType,
  SourceFormFieldsType
} from '../components/CreateTask/index.type';
import { ResponseCode } from '@actiontech/dms-kit';
import { formatterSQL } from '@actiontech/dms-kit';

const useCreateExportTaskForm = () => {
  const [baseForm] = useForm<BaseFormFieldsType>();
  const [sourceForm] = useForm<SourceFormFieldsType>();
  const [methodForm] = useForm<MethodFormFieldsType>();
  const { projectID } = useCurrentProject();
  const { auditLoading, updateAuditLoading, updateFormValues, updateTaskIDs } =
    useCreateDataExportReduxManage();

  const formatSQLAction = () => {
    const currentSQL = methodForm.getFieldValue('sql');
    const dbServiceID = sourceForm.getFieldValue('dbService');
    const getInstanceType = (id: string) => {
      return DBService.ListDBServices({
        project_uid: projectID,
        page_size: 9999,
        page_index: 1,
        filter_by_uid: id
      }).then((res) => res.data.data?.[0]);
    };
    if (dbServiceID) {
      getInstanceType(dbServiceID).then((res) => {
        methodForm.setFields([
          {
            name: 'sql',
            value: formatterSQL(currentSQL, res?.db_type)
          }
        ]);
      });
    } else {
      methodForm.setFields([
        {
          name: 'sql',
          value: formatterSQL(currentSQL)
        }
      ]);
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

    return DataExportTask.AddDataExportTask({
      project_uid: projectID,
      data_export_tasks: [
        {
          database_name: sourceValues.schema,
          db_service_uid: sourceValues.dbService,
          export_sql: methodValues.sql
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
    resetAllForms
  };
};

export default useCreateExportTaskForm;
