import dms from '@actiontech/shared/lib/api/base/service/dms';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useForm } from 'antd/es/form/Form';
import { formatterSQL } from 'sqle/src/utils/FormatterSQL';
import useCreateDataExportReduxManage from './index.redux';
import {
  BaseFormFieldsType,
  MethodFormFieldsType,
  SourceFormFieldsType
} from '../components/CreateTask/index.type';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const useCreateExportTaskFrom = () => {
  const [baseForm] = useForm<BaseFormFieldsType>();
  const [sourceForm] = useForm<SourceFormFieldsType>();
  const [methodForm] = useForm<MethodFormFieldsType>();
  const { projectID } = useCurrentProject();
  const { auditLoading, updateAuditState, updateFormValues, updateTaskIDs } =
    useCreateDataExportReduxManage();

  const formatSQLAction = () => {
    const currentSQL = methodForm.getFieldValue('sql');
    const dbServiceID = sourceForm.getFieldValue('dbService');
    const getInstanceType = (id: string) => {
      return dms
        .ListDBServices({
          project_uid: projectID,
          page_size: 9999,
          page_index: 1,
          filter_by_uid: id
        })
        .then((res) => res.data.data?.[0]);
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

  const auditAction = async () => {
    const baseValues = await baseForm.validateFields();
    const sourceValues = await sourceForm.validateFields();
    const methodValues = await methodForm.validateFields();

    updateAuditState(true);

    return dms
      .AddDataExportTask({
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
        updateAuditState(false);
      });
  };

  return {
    baseForm,
    sourceForm,
    methodForm,
    auditLoading,
    formatSQLAction,
    auditAction
  };
};

export default useCreateExportTaskFrom;