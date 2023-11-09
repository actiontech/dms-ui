import { t } from '../../../../locale';
import { IconInspectionAndDiagnosis } from '../../../../icon/sideMenu';
import Icon from '@ant-design/icons';
import {
  GenerateMenuItemsType,
  SIDE_MENU_DATA_PLACEHOLDER_KEY
} from './common';

export const DiagnosisMenuItems: GenerateMenuItemsType = ({
  navigate,
  projectID = ''
}) => [
  {
    order: 11,
    type: 'divider'
  },
  {
    order: 12,
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
