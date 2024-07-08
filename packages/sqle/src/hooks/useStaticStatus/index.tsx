import { Select } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  auditStatusDictionary,
  execStatusDictionary,
  ruleLevelDictionary,
  auditLevelDictionary
} from './index.data';
import {
  RuleResV1LevelEnum,
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  getAuditTaskSQLsV2FilterExecStatusEnum,
  getAuditTaskSQLsV1FilterAuditStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/task/index.enum';

const useStaticStatus = () => {
  const { t } = useTranslation();

  const generateExecStatusSelectOption = React.useCallback(() => {
    return (
      <>
        {Object.keys(getAuditTaskSQLsV2FilterExecStatusEnum).map((v) => {
          const key = v as keyof typeof getAuditTaskSQLsV2FilterExecStatusEnum;
          return (
            <Select.Option
              key={key}
              value={getAuditTaskSQLsV2FilterExecStatusEnum[key]}
            >
              {t(
                execStatusDictionary[
                  getAuditTaskSQLsV2FilterExecStatusEnum[key]
                ]
              )}
            </Select.Option>
          );
        })}
      </>
    );
  }, [t]);

  const generateAuditStatusSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          value={getAuditTaskSQLsV1FilterAuditStatusEnum.initialized}
          key={getAuditTaskSQLsV1FilterAuditStatusEnum.initialized}
        >
          {t(
            auditStatusDictionary[
              getAuditTaskSQLsV1FilterAuditStatusEnum.initialized
            ]
          )}
        </Select.Option>
        <Select.Option
          value={getAuditTaskSQLsV1FilterAuditStatusEnum.doing}
          key={getAuditTaskSQLsV1FilterAuditStatusEnum.doing}
        >
          {t(
            auditStatusDictionary[getAuditTaskSQLsV1FilterAuditStatusEnum.doing]
          )}
        </Select.Option>
        <Select.Option
          value={getAuditTaskSQLsV1FilterAuditStatusEnum.finished}
          key={getAuditTaskSQLsV1FilterAuditStatusEnum.finished}
        >
          {t(
            auditStatusDictionary[
              getAuditTaskSQLsV1FilterAuditStatusEnum.finished
            ]
          )}
        </Select.Option>
      </>
    );
  }, [t]);

  // const generateSqlTaskStatusSelectOption = React.useCallback(() => {
  //   return (
  //     <>
  //       <Select.Option
  //         key={getWorkflowListV1FilterTaskStatusEnum.initialized}
  //         value={getWorkflowListV1FilterTaskStatusEnum.initialized}
  //       >
  //         {t(
  //           sqlTaskStatusDictionary[
  //             getWorkflowListV1FilterTaskStatusEnum.initialized
  //           ]
  //         )}
  //       </Select.Option>
  //       <Select.Option
  //         key={getWorkflowListV1FilterTaskStatusEnum.audited}
  //         value={getWorkflowListV1FilterTaskStatusEnum.audited}
  //       >
  //         {t(
  //           sqlTaskStatusDictionary[
  //             getWorkflowListV1FilterTaskStatusEnum.audited
  //           ]
  //         )}
  //       </Select.Option>
  //       <Select.Option
  //         key={getWorkflowListV1FilterTaskStatusEnum.executing}
  //         value={getWorkflowListV1FilterTaskStatusEnum.executing}
  //       >
  //         {t(
  //           sqlTaskStatusDictionary[
  //             getWorkflowListV1FilterTaskStatusEnum.executing
  //           ]
  //         )}
  //       </Select.Option>
  //       <Select.Option
  //         key={getWorkflowListV1FilterTaskStatusEnum.exec_succeeded}
  //         value={getWorkflowListV1FilterTaskStatusEnum.exec_succeeded}
  //       >
  //         {t(
  //           sqlTaskStatusDictionary[
  //             getWorkflowListV1FilterTaskStatusEnum.exec_succeeded
  //           ]
  //         )}
  //       </Select.Option>
  //       <Select.Option
  //         key={getWorkflowListV1FilterTaskStatusEnum.exec_failed}
  //         value={getWorkflowListV1FilterTaskStatusEnum.exec_failed}
  //       >
  //         {t(
  //           sqlTaskStatusDictionary[
  //             getWorkflowListV1FilterTaskStatusEnum.exec_failed
  //           ]
  //         )}
  //       </Select.Option>
  //     </>
  //   );
  // }, [t]);

  const getRuleLevelStatusSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          value={RuleResV1LevelEnum.normal}
          key={RuleResV1LevelEnum.normal}
        >
          {t(ruleLevelDictionary[RuleResV1LevelEnum.normal])}
        </Select.Option>
        <Select.Option
          value={RuleResV1LevelEnum.notice}
          key={RuleResV1LevelEnum.notice}
        >
          {t(ruleLevelDictionary[RuleResV1LevelEnum.notice])}
        </Select.Option>
        <Select.Option
          value={RuleResV1LevelEnum.warn}
          key={RuleResV1LevelEnum.warn}
        >
          {t(ruleLevelDictionary[RuleResV1LevelEnum.warn])}
        </Select.Option>
        <Select.Option
          value={RuleResV1LevelEnum.error}
          key={RuleResV1LevelEnum.error}
        >
          {t(ruleLevelDictionary[RuleResV1LevelEnum.error])}
        </Select.Option>
      </>
    );
  }, [t]);

  const getAuditLevelStatusSelectOptionValues = useMemo(() => {
    return Object.keys(
      WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
    ).map((v) => {
      const key =
        v as keyof typeof WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum;
      return {
        label: t(auditLevelDictionary[key]),
        value: key
      };
    });
  }, [t]);

  const getAuditLevelStatusSelectOption = React.useCallback(() => {
    return (
      <>
        <Select.Option
          value={
            WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.normal
          }
          key={
            WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.normal
          }
        >
          {t(
            auditLevelDictionary[
              WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
                .normal
            ]
          )}
        </Select.Option>
        <Select.Option
          value={
            WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.notice
          }
          key={
            WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.notice
          }
        >
          {t(
            auditLevelDictionary[
              WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
                .notice
            ]
          )}
        </Select.Option>
        <Select.Option
          value={
            WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn
          }
          key={
            WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn
          }
        >
          {t(
            auditLevelDictionary[
              WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn
            ]
          )}
        </Select.Option>
        <Select.Option
          value={
            WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.error
          }
          key={
            WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.error
          }
        >
          {t(
            auditLevelDictionary[
              WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.error
            ]
          )}
        </Select.Option>
      </>
    );
  }, [t]);

  return {
    generateAuditStatusSelectOption,
    generateExecStatusSelectOption,
    // generateSqlTaskStatusSelectOption,
    getRuleLevelStatusSelectOption,
    getAuditLevelStatusSelectOption,
    getAuditLevelStatusSelectOptionValues
  };
};

export default useStaticStatus;
