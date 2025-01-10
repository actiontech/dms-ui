import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './common';
import { EyeClosedOutlined } from '@actiontech/icons';
import { GenerateMenuItemI18nConfig } from './index.type';

export const dataMaskRuleMenuItem: GenerateMenuItemI18nConfig = (
  projectID
) => ({
  to: `/project/${projectID}/data-mask-rule-overview`,
  label: 'dmsMenu.dataMaskRuleOverview',
  key: `project/${SIDE_MENU_DATA_PLACEHOLDER_KEY}/data-mask-rule-overview`,
  icon: <EyeClosedOutlined width={18} height={18} />,
  structKey: 'data-mask-rule'
});
