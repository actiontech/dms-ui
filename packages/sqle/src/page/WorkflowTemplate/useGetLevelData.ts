import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useMemo } from 'react';
import useThemeStyleData from '../../hooks/useThemeStyleData';
import { useTranslation } from 'react-i18next';
import { auditLevelDictionary } from '../../hooks/useStaticStatus/index.data';

export const useGetLevelData = (
  level:
    | WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
    | undefined
) => {
  const { t } = useTranslation();

  const { sqleTheme } = useThemeStyleData();

  const currentLevelData = useMemo(() => {
    const auditLevelColor = {
      [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.normal]: {
        color: sqleTheme.workflowTemplate.progress.normal,
        percent: 25
      },
      [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.notice]: {
        color: sqleTheme.workflowTemplate.progress.notice,
        percent: 50
      },
      [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn]: {
        color: sqleTheme.workflowTemplate.progress.warning,
        percent: 75
      },
      [WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.error]: {
        color: sqleTheme.workflowTemplate.progress.error,
        percent: 100
      }
    };
    return level
      ? auditLevelColor[level]
      : { color: sqleTheme.workflowTemplate.progress.remainColor, percent: 0 };
  }, [sqleTheme, level]);

  const levelText = level ? t(auditLevelDictionary[level]) : '';

  return { currentLevelData, levelText };
};
