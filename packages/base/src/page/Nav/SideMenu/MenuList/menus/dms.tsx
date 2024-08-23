import { Link } from 'react-router-dom';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import { GenerateMenuItemType } from './index.type';
import { t } from '../../../../../locale';
import { EyeClosedOutlined } from '@actiontech/icons';

export const dataMaskRuleMenuItem: GenerateMenuItemType = (projectID) => ({
  label: (
    <Link to={`/project/${projectID}/data-mask-rule-overview`}>
      {t('dmsMenu.dataMaskRuleOverview')}
    </Link>
  ),

  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/data-mask-rule-overview`,
  icon: <EyeClosedOutlined width={18} height={18} />,
  structKey: 'data-mask-rule'
});
