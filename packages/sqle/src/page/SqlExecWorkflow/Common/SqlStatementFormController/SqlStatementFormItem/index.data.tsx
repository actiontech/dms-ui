import { ModeSwitcherOptionsType } from '@actiontech/shared/lib/components/ModeSwitcher/index.type';
import {
  AuditTaskResV1SqlSourceEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  IconWorkflowFileUpload,
  IconWorkflowSQLUpload
} from '../../../../../icon/SqlExecWorkflow';
import { t } from '../../../../../locale';

export const SAME_SQL_MODE_DEFAULT_FIELD_KEY = '0';

export const defaultUploadTypeOptions: ModeSwitcherOptionsType = [
  {
    icon: <IconWorkflowSQLUpload />,
    label: t('execWorkflow.create.form.sqlInfo.manualInput'),
    value: AuditTaskResV1SqlSourceEnum.form_data,
    colProps: {
      span: 8
    }
  },
  {
    icon: <IconWorkflowFileUpload />,
    label: t('execWorkflow.create.form.sqlInfo.uploadFile'),
    value: AuditTaskResV1SqlSourceEnum.sql_file,
    colProps: {
      span: 8
    }
  },
  {
    icon: <IconWorkflowFileUpload />,
    label: t('execWorkflow.create.form.sqlInfo.uploadZipFile'),
    value: AuditTaskResV1SqlSourceEnum.zip_file,
    colProps: {
      span: 8
    }
  }
];

export const sqlExecModeOptions: ModeSwitcherOptionsType = [
  {
    label: t('execWorkflow.create.form.sqlInfo.executeSqlMode'),
    icon: <IconWorkflowFileUpload />,
    value: CreateAuditTasksGroupReqV1ExecModeEnum.sqls,
    colProps: {
      span: 12
    }
  },
  {
    label: t('execWorkflow.create.form.sqlInfo.executeFileMode'),
    icon: <IconWorkflowFileUpload />,
    value: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
    colProps: {
      span: 12
    }
  }
];
