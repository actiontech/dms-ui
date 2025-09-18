import { GetUserSystemEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { t } from '../../../locale';

export const systemDictionary = {
  [GetUserSystemEnum.WORKBENCH]: t('dmsMenu.userGuide.sqlWorkbench.label'),
  [GetUserSystemEnum.MANAGEMENT]: t('dmsMenu.userGuide.adminPanel.label')
};
