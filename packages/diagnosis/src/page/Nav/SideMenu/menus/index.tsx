import i18n from 'i18next';
import { GenerateMenuItemsType } from './common';
import { ThunderBulbFilled, UserShieldFilled } from '@actiontech/icons';

export const DiagnosisMenuItems: GenerateMenuItemsType = ({ navigate }) => [
  {
    order: 0,
    type: 'divider'
  },
  {
    order: 1,
    label: <>{i18n.t('diagnosisMenu.monitorSourceConfig')}</>,
    key: `/monitor-source-config`,
    icon: <ThunderBulbFilled width={18} height={18} />,
    onClick: () => navigate(`/monitor-source-config`)
  },
  {
    order: 2,
    label: <>{i18n.t('diagnosisMenu.userManagement')}</>,
    key: `/user-management`,
    icon: <UserShieldFilled width={18} height={18} />,
    onClick: () => navigate(`/user-management`)
  }
];
