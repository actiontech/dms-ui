import i18n from 'i18next';
import { IconInspectionAndDiagnosis, IconUserCenter } from '../../../../icon';
import Icon from '@ant-design/icons';
import { GenerateMenuItemsType } from './common';

export const DiagnosisMenuItems: GenerateMenuItemsType = ({ navigate }) => [
  {
    order: 0,
    type: 'divider'
  },
  {
    order: 1,
    label: <>{i18n.t('menu.monitorSourceConfig')}</>,
    key: `/monitor-source-config`,
    icon: <Icon component={IconInspectionAndDiagnosis} />,
    onClick: () => navigate(`/monitor-source-config`)
  },
  {
    order: 2,
    label: <>{i18n.t('menu.userManagement')}</>,
    key: `/user-management`,
    icon: <Icon component={IconUserCenter} />,
    onClick: () => navigate(`/user-management`)
  }
];
