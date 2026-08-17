/* tslint:disable no-duplicate-string */

export enum GetMaskingOverviewTreeMaskingConfigStatusesEnum {
  CONFIGURED = 'CONFIGURED',

  PENDING_CONFIRM = 'PENDING_CONFIRM',

  SYSTEM_CONFIRMED = 'SYSTEM_CONFIRMED'
}

export enum ListMaskingRulesSourceEnum {
  builtin = 'builtin',

  custom = 'custom'
}

export enum ListUnmaskingWorkflowsFilterByApprovalStatusEnum {
  pending = 'pending',

  approved = 'approved',

  rejected = 'rejected',

  cancelled = 'cancelled'
}

export enum ListUnmaskingWorkflowsFilterByUsageStatusEnum {
  unviewed = 'unviewed',

  viewed = 'viewed'
}
