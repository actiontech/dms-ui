import { Link } from 'react-router-dom';
import { IconDataMask } from '../../../../../icon/sideMenu';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import { GenerateMenuItemType } from './index.type';
import Icon from '@ant-design/icons';
import { t } from '../../../../../locale';

export const dataMaskRuleMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/project/${projectID}/data-mask-rule-overview`}>
      {t('dmsMenu.dataMaskRuleOverview')}
    </Link>
  ),

  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/data-mask-rule-overview/list`,
  icon: <Icon component={IconDataMask} />,
  structKey: 'data-mask-rule'
});
