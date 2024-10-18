import { ProjectProjectPriorityEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { t } from '../../locale/index';

export const ProjectPriorityDictionary: {
  [key in ProjectProjectPriorityEnum]: string;
} = {
  [ProjectProjectPriorityEnum.high]: t('globalDashboard.high'),
  [ProjectProjectPriorityEnum.medium]: t('globalDashboard.medium'),
  [ProjectProjectPriorityEnum.low]: t('globalDashboard.low')
};

export const ProjectPriorityOptions: Array<{
  label: string;
  value: ProjectProjectPriorityEnum;
}> = [
  {
    label: ProjectPriorityDictionary[ProjectProjectPriorityEnum.high],
    value: ProjectProjectPriorityEnum.high
  },
  {
    label: ProjectPriorityDictionary[ProjectProjectPriorityEnum.medium],
    value: ProjectProjectPriorityEnum.medium
  },
  {
    label: ProjectPriorityDictionary[ProjectProjectPriorityEnum.low],
    value: ProjectProjectPriorityEnum.low
  }
];
