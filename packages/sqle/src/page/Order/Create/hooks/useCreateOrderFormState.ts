import { useState } from 'react';
import {
  SchemaListType,
  RuleTemplateListType,
  InstanceInfoType
} from '../SQLInfoForm/index.type';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useBoolean } from 'ahooks';
import { SQLInputType } from '../../SQLStatementForm';
import { SQLInputTypeMapType } from '../index.type';

//todo 目前只提取一些 state 至最外层, 提供给 create 和 edit 使用, 后续考虑抽取逻辑
const useCreateOrderFormState = () => {
  const [schemaList, setSchemaList] = useState<SchemaListType>(
    new Map([[0, []]])
  );
  const [ruleTemplates, setRuleTemplates] = useState<RuleTemplateListType>(
    new Map([[0, undefined]])
  );

  const [changeSqlModeDisabled, setChangeSqlModeDisabled] = useState(false);
  const [isSupportFileModeExecuteSQL, setIsSupportFileModeExecuteSQL] =
    useState(false);

  /**
   * 多数据源不同 sql 模式下每一个  tab 都会存在一个 currentSQLInputType
   */
  const [sqlInputTypeMap, setSqlInputTypeMap] = useState<SQLInputTypeMapType>(
    new Map([['0', SQLInputType.manualInput]])
  );

  const [differentModeActiveKey, setDifferentModeActiveKey] =
    useState<string>('');

  const [currentSqlMode, setCurrentSqlMode] = useState(
    WorkflowResV2ModeEnum.same_sqls
  );
  const [instanceInfo, setInstanceInfo] = useState<InstanceInfoType>(
    new Map([[0, { instanceName: '' }]])
  );
  const [auditLoading, { setFalse: finishAudit, setTrue: startAudit }] =
    useBoolean(false);

  return {
    schemaList,
    setSchemaList,
    ruleTemplates,
    setRuleTemplates,
    changeSqlModeDisabled,
    setChangeSqlModeDisabled,
    currentSqlMode,
    setCurrentSqlMode,
    instanceInfo,
    setInstanceInfo,
    auditLoading,
    finishAudit,
    startAudit,
    isSupportFileModeExecuteSQL,
    setIsSupportFileModeExecuteSQL,
    sqlInputTypeMap,
    setSqlInputTypeMap,
    differentModeActiveKey,
    setDifferentModeActiveKey
  };
};

export default useCreateOrderFormState;
