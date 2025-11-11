import { ICreateWorkflowV2Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { DatabaseSelectionFields } from './components/FormStep/SqlAuditInfoForm/SqlAuditInfoFormItem/DatabaseSelectionItems/index.type';
import {
  AuditTaskResV1SqlSourceEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  IInstanceConnectionResV1,
  IRuleTemplateV2
} from '@actiontech/shared/lib/api/sqle/service/common';

type Stateful<S> = {
  value: S;
  set: (newState: S | ((prevState: S) => S)) => void;
};

export type WorkflowBaseInfoFormFields = Pick<
  ICreateWorkflowV2Params,
  'desc' | 'workflow_subject'
>;

export type SqlStatementFields = Record<
  keyof typeof AuditTaskResV1SqlSourceEnum,
  string | any
> & {
  exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum;
  file_sort_method: string;
  currentUploadType: AuditTaskResV1SqlSourceEnum;
};

export type CreateWorkflowDatabaseInfo = Array<{
  key: string;
  instanceName?: string;
  schemaName?: string;
}>;

export type SqlAuditInfoFormFields = {
  isSameSqlForAll: boolean;
  databaseInfo: Array<DatabaseSelectionFields>;

  [key: string]:
    | SqlStatementFields
    | AuditTaskResV1SqlSourceEnum
    | boolean
    | Array<DatabaseSelectionFields>
    | CreateAuditTasksGroupReqV1ExecModeEnum;
};

/**
 * 由于 数据源信息没有 key 作为主键，并且添加数据源时可以选择重复的数据源，所以这里的 key 为 Form.List 中 field 提供的 key
 */
export type DataSourceSchemaCollection = Record<
  string,
  {
    instanceName?: string;
    schemaName?: string;
    schemaList?: string[];
    getSchemaLoading?: boolean;
    dbType?: string;
    ruleTemplate?: IRuleTemplateV2;
    testConnectResult?: IInstanceConnectionResV1;
    isSupportFileModeExecuteSql?: boolean;
  }
>;

export type SharedStepDetails = {
  isAuditing: Stateful<boolean>;
  dbSourceInfoCollection: {
    value: DataSourceSchemaCollection;
    set: (key: string, value?: DataSourceSchemaCollection[string]) => void;
  };
  instanceTestConnectResults: Stateful<IInstanceConnectionResV1[]>;
  isDisabledForDifferenceSql: Stateful<boolean>;
  sqlStatementTabActiveKey: Stateful<string>;
  getModifiedSQLsPending: Stateful<boolean>;

  resetAllSharedData: () => void;
  isAtFormStep?: boolean;
};
