import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useBoolean } from 'ahooks';
import blacklist from '@actiontech/shared/lib/api/sqle/service/blacklist';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  buildRuleExceptionFromSqlManage,
  parseConflictBlacklistId,
  buildRuleExceptionDetailPath,
  resolveRuleExceptionDbType
} from '../../page/RuleException/utils';
import type { ISqlManageRuleExceptionContext } from '../../page/RuleException/utils';
import { RULE_EXCEPTION_CONFLICT_CODE } from '../../page/RuleException/index.type';

const useRuleExceptionActions = (options?: {
  sqlManageContext?: ISqlManageRuleExceptionContext;
  onSuccess?: () => void;
}) => {
  const { sqlManageContext, onSuccess } = options ?? {};
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectName, projectID } = useCurrentProject();
  const { isAdmin, isProjectManager } = useCurrentUser();
  const [submitting, { setTrue: startSubmit, setFalse: finishSubmit }] =
    useBoolean();

  const canWrite = useMemo(
    () => isAdmin || isProjectManager(projectName),
    [isAdmin, isProjectManager, projectName]
  );

  const navigateToExceptionDetail = useCallback(
    (blacklistId?: number | null) => {
      if (!blacklistId) {
        return;
      }
      navigate(buildRuleExceptionDetailPath(projectID, blacklistId));
    },
    [navigate, projectID]
  );

  const handleConflict = useCallback(
    (errorMessage?: string) => {
      const conflictId = parseConflictBlacklistId(errorMessage);
      message.warning(
        conflictId
          ? `${t('ruleException.quickAdd.conflict')} (ID: ${conflictId})`
          : t('ruleException.quickAdd.conflict')
      );
      if (conflictId) {
        navigate(buildRuleExceptionDetailPath(projectID, conflictId));
      }
    },
    [navigate, projectID, t]
  );

  const addRuleException = useCallback(
    async (ruleName: string, desc?: string, dbType?: string) => {
      if (!canWrite || !sqlManageContext?.sql_fingerprint) {
        return false;
      }
      const resolvedDbType = resolveRuleExceptionDbType(
        sqlManageContext,
        undefined,
        undefined
      );
      const effectiveDbType = dbType ?? resolvedDbType;
      if (!effectiveDbType) {
        message.error(t('ruleException.quickAdd.missingDbType'));
        return false;
      }
      startSubmit();
      try {
        const payload = buildRuleExceptionFromSqlManage(
          {
            ...sqlManageContext,
            db_type: effectiveDbType
          },
          ruleName,
          desc,
          effectiveDbType
        );
        const res = await blacklist.createBlacklistV1({
          type: payload.type,
          content: payload.content,
          match_conditions: payload.match_conditions,
          rule_scope: payload.rule_scope as unknown as string,
          desc: payload.desc,
          project_name: projectName
        });
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('ruleException.quickAdd.success'));
          onSuccess?.();
          return true;
        }
        if (res.data.code === RULE_EXCEPTION_CONFLICT_CODE) {
          handleConflict(res.data.message);
        }
        return false;
      } finally {
        finishSubmit();
      }
    },
    [
      canWrite,
      finishSubmit,
      handleConflict,
      onSuccess,
      projectName,
      sqlManageContext,
      startSubmit,
      t
    ]
  );

  const removeRuleException = useCallback(
    async (exceptionId: number) => {
      if (!canWrite || !exceptionId) {
        return false;
      }
      startSubmit();
      try {
        const res = await blacklist.deleteBlackList({
          project_name: projectName,
          blacklist_id: `${exceptionId}`
        });
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('ruleException.cancel.success'));
          onSuccess?.();
          return true;
        }
        return false;
      } finally {
        finishSubmit();
      }
    },
    [canWrite, finishSubmit, onSuccess, projectName, startSubmit, t]
  );

  return {
    canWrite,
    submitting,
    addRuleException,
    removeRuleException,
    navigateToExceptionDetail
  };
};

export default useRuleExceptionActions;
