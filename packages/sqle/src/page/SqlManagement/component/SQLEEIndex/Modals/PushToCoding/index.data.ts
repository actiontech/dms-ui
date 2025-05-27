import {
  SqlManageCodingReqTypeEnum,
  SqlManageCodingReqPriorityEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { t } from '../../../../../../locale';

export const CodingIssueTypeDictionary: {
  [key in SqlManageCodingReqTypeEnum]: string;
} = {
  [SqlManageCodingReqTypeEnum.DEFECT]: t(
    'sqlManagement.table.action.pushToCodingForm.typeOptions.defect'
  ),
  [SqlManageCodingReqTypeEnum.EPIC]: t(
    'sqlManagement.table.action.pushToCodingForm.typeOptions.epic'
  ),
  [SqlManageCodingReqTypeEnum.MISSION]: t(
    'sqlManagement.table.action.pushToCodingForm.typeOptions.mission'
  ),
  [SqlManageCodingReqTypeEnum.REQUIREMENT]: t(
    'sqlManagement.table.action.pushToCodingForm.typeOptions.requirement'
  ),
  [SqlManageCodingReqTypeEnum.SUB_TASK]: t(
    'sqlManagement.table.action.pushToCodingForm.typeOptions.subTask'
  )
};

export const CodingIssueTypeOptions: Array<{
  label: string;
  value: SqlManageCodingReqTypeEnum;
}> = [
  {
    label: CodingIssueTypeDictionary[SqlManageCodingReqTypeEnum.DEFECT],
    value: SqlManageCodingReqTypeEnum.DEFECT
  },
  {
    label: CodingIssueTypeDictionary[SqlManageCodingReqTypeEnum.EPIC],
    value: SqlManageCodingReqTypeEnum.EPIC
  },
  {
    label: CodingIssueTypeDictionary[SqlManageCodingReqTypeEnum.MISSION],
    value: SqlManageCodingReqTypeEnum.MISSION
  },
  {
    label: CodingIssueTypeDictionary[SqlManageCodingReqTypeEnum.REQUIREMENT],
    value: SqlManageCodingReqTypeEnum.REQUIREMENT
  },
  {
    label: CodingIssueTypeDictionary[SqlManageCodingReqTypeEnum.SUB_TASK],
    value: SqlManageCodingReqTypeEnum.SUB_TASK
  }
];

export const CodingIssueUrgencyDictionary: {
  [key in SqlManageCodingReqPriorityEnum]: string;
} = {
  [SqlManageCodingReqPriorityEnum.EMERGENCY]: t(
    'sqlManagement.table.action.pushToCodingForm.urgencyOptions.emergency'
  ),
  [SqlManageCodingReqPriorityEnum.HIGH]: t(
    'sqlManagement.table.action.pushToCodingForm.urgencyOptions.high'
  ),
  [SqlManageCodingReqPriorityEnum.MEDIUM]: t(
    'sqlManagement.table.action.pushToCodingForm.urgencyOptions.medium'
  ),
  [SqlManageCodingReqPriorityEnum.LOW]: t(
    'sqlManagement.table.action.pushToCodingForm.urgencyOptions.low'
  )
};

export const CodingIssueUrgencyOptions: Array<{
  label: string;
  value: SqlManageCodingReqPriorityEnum;
}> = [
  {
    label:
      CodingIssueUrgencyDictionary[SqlManageCodingReqPriorityEnum.EMERGENCY],
    value: SqlManageCodingReqPriorityEnum.EMERGENCY
  },
  {
    label: CodingIssueUrgencyDictionary[SqlManageCodingReqPriorityEnum.HIGH],
    value: SqlManageCodingReqPriorityEnum.HIGH
  },

  {
    label: CodingIssueUrgencyDictionary[SqlManageCodingReqPriorityEnum.MEDIUM],
    value: SqlManageCodingReqPriorityEnum.MEDIUM
  },
  {
    label: CodingIssueUrgencyDictionary[SqlManageCodingReqPriorityEnum.LOW],
    value: SqlManageCodingReqPriorityEnum.LOW
  }
];
