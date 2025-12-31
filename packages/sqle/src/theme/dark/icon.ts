import { IconTheme } from '../type';
import {
  darkThemeUI,
  darkThemeBasic
} from '@actiontech/dms-kit/es/theme/dark/basic';

export const iconTheme: IconTheme = {
  execWorkFlow: {
    minusCircleFilledDisabled: darkThemeUI.uiToken.colorTextQuaternary,
    profileSquareFilled: '#4583FF',
    databaseFilled: '#4583FF',
    schemaFilled: '#15C7D4',
    fileList: '#4583FF',
    clock: '#6094FC'
  },
  workflowTemplate: {
    common: darkThemeBasic.basic.colorWhite,
    userCircleFilled: '#1CB889'
  }
};
