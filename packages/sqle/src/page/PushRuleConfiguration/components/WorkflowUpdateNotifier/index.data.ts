import {
  ReportPushConfigListPushUserTypeEnum,
  ReportPushConfigListTriggerTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { t } from '../../../../locale';

export const WorkflowPushUserTypeDictionary: Record<
  keyof typeof ReportPushConfigListPushUserTypeEnum,
  string
> = {
  permission_match: t(
    'pushRule.pushRule.workflowUpdateNotifier.permissionMatch'
  ),
  fixed: 'unknown'
};

export const WorkflowPushFrequencyDictionary: Record<
  keyof typeof ReportPushConfigListTriggerTypeEnum,
  string
> = {
  immediately: t('pushRule.pushRule.workflowUpdateNotifier.immediately'),
  timing: 'unknown'
};
