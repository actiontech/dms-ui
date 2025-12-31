import { IconTheme } from '../type';
import {
  darkThemeUI,
  darkThemeBasic
} from '@actiontech/dms-kit/es/theme/dark/basic';

export const iconTheme: IconTheme = {
  bindUser: {
    user: darkThemeUI.uiToken.colorTextQuaternary,
    password: darkThemeUI.uiToken.colorTextQuaternary
  },
  dataExport: {
    infoCircle: darkThemeUI.uiToken.colorTextTertiary,
    clock: '#6094FC'
  },
  home: {
    common: darkThemeBasic.basic.colorWhite
  },
  system: {
    basicTitleTips: darkThemeUI.uiToken.colorTextTertiary,
    modify: darkThemeUI.uiToken.colorText
  }
};
