import { BasicTheme, UITokenTheme } from '../theme.type';

export const darkThemeUI: { uiToken: UITokenTheme } = {
  // antd token
  uiToken: {
    colorInfo: '#4583ff',
    colorPrimary: '#4583ff',
    colorSuccess: '#1cb889',
    colorWarning: '#edb054',
    colorError: '#f66074',
    colorTextBase: '#292c33',
    colorBgBase: '#fcfbf9',
    colorText: '#292C33',
    colorTextSecondary: '#575c66',
    colorTextTertiary: '#8a8f99',
    colorTextQuaternary: '#c3c6cd',
    colorBorderSecondary: '#E8E7E6',
    colorBorder: '#C7C6C3',
    colorFill: '#ebeae7',
    colorFillSecondary: '#f2f1ef',
    colorFillTertiary: '#f7f6f4',
    colorFillQuaternary: '#fcfbf9',
    colorBgLayout: '#f2f1ef',
    colorWarningBgHover: '#FFF7E0',
    colorErrorBgHover: '#FEE5E5'
  }
};

export const darkThemeBasic: { basic: BasicTheme } = {
  // other color
  basic: {
    colorPrimaryActive: '#3B6FD9',
    colorPrimaryHover: '#6A9CFF',
    colorPrimaryBgHover: '#E8F3FF',
    colorPrimaryBgActive: '#f0f7ff',
    colorPrimaryDisabled: '#B5CDFF',
    colorPrimaryShadow: '#4583FF66',
    colorDangerousActive: '#FAAFB9',
    colorBgLayoutGray: '#fcfbf9',
    colorFontGrayByWhite: '#C3C6CD',
    colorShadowByWhite: '#332C1F1F',
    colorDefaultIcon: '#575C66',
    colorWhite: '#FFFFFF',
    colorGrayLine: '#f2f1f0',
    controlHeight: 32,
    controlHeightLG: 36,
    controlHeightSM: 28,
    paddingNumber: 20,
    borderRadius4: 4
  }
};
