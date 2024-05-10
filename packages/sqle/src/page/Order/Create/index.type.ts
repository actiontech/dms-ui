import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Dispatch, SetStateAction } from 'react';
import {
  SchemaListType,
  RuleTemplateListType,
  InstanceInfoType
} from './SQLInfoForm/index.type';
import { SQLInputType } from '../SQLStatementForm';

export type SQLInputTypeMapType = Map<string, SQLInputType>;

export type CreateOrderFormStateType = {
  schemaList: SchemaListType;
  setSchemaList: Dispatch<SetStateAction<SchemaListType>>;
  ruleTemplates: RuleTemplateListType;
  setRuleTemplates: Dispatch<SetStateAction<RuleTemplateListType>>;
  changeSqlModeDisabled: boolean;
  setChangeSqlModeDisabled: Dispatch<SetStateAction<boolean>>;
  currentSqlMode: WorkflowResV2ModeEnum;
  setCurrentSqlMode: Dispatch<SetStateAction<WorkflowResV2ModeEnum>>;
  instanceInfo: InstanceInfoType;
  setInstanceInfo: Dispatch<SetStateAction<InstanceInfoType>>;
  auditLoading: boolean;
  isSupportFileModeExecuteSQL: boolean;
  setIsSupportFileModeExecuteSQL: (val: boolean) => void;
  sqlInputTypeMap: SQLInputTypeMapType;
  setSqlInputTypeMap: Dispatch<SetStateAction<SQLInputTypeMapType>>;
  differentModeActiveKey: string;
  setDifferentModeActiveKey: Dispatch<SetStateAction<string>>;
};
