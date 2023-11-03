import { t } from '../../../../locale';
import { IconInspectionAndDiagnosis } from '../../../../icon/sideMenu';
import Icon from '@ant-design/icons';
import {
  GenerateMenuItemsType,
  SIDE_MENU_DATA_PLACEHOLDER_KEY
} from './common';
import { BaseMenuItems } from './base';

export const DiagnosisMenuItems: GenerateMenuItemsType = ({
  navigate,
  projectID = ''
}) => [
  ...BaseMenuItems({ navigate, projectID }),
  {
    order: 5,
    type: 'divider'
  },
  {
    order: 7,
    type: 'group',
    label: t('dmsMenu.inspectionAndDiagnosis'),
    children: [
      {
        label: t('dmsMenu.monitorSourceConfig'),
        key: `diagnosis/project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/monitorSourceConfig`,
        icon: <Icon component={IconInspectionAndDiagnosis} />,
        onClick: () =>
          navigate(`/diagnosis/project/${projectID}/monitorSourceConfig`)
      }
    ]
  }
];
