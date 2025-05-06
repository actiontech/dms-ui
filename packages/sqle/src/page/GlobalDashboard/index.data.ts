import { ProjectV2ProjectPriorityEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { t } from '../../locale/index';

export const ProjectPriorityDictionary: {
  [key in ProjectV2ProjectPriorityEnum]: string;
} = {
  [ProjectV2ProjectPriorityEnum.high]: t('globalDashboard.high'),
  [ProjectV2ProjectPriorityEnum.medium]: t('globalDashboard.medium'),
  [ProjectV2ProjectPriorityEnum.low]: t('globalDashboard.low'),
  [ProjectV2ProjectPriorityEnum.unknown]: t('common.unknown')
};

export const ProjectPriorityOptions: Array<{
  label: string;
  value: ProjectV2ProjectPriorityEnum;
}> = [
  {
    label: ProjectPriorityDictionary[ProjectV2ProjectPriorityEnum.high],
    value: ProjectV2ProjectPriorityEnum.high
  },
  {
    label: ProjectPriorityDictionary[ProjectV2ProjectPriorityEnum.medium],
    value: ProjectV2ProjectPriorityEnum.medium
  },
  {
    label: ProjectPriorityDictionary[ProjectV2ProjectPriorityEnum.low],
    value: ProjectV2ProjectPriorityEnum.low
  }
];
