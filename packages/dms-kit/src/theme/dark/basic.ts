import { BasicTheme, UITokenTheme } from '../theme.type';

export const darkThemeUI: { uiToken: UITokenTheme } = {
  // antd token
  uiToken: {
    colorInfo: '#4583ff',
    colorPrimary: '#4583ff',
    colorSuccess: '#1cb889',
    colorWarning: '#edb054',
    colorError: '#f66074',
    colorTextBase: '#E5E5E5',
    colorBgBase: '#141414',
    colorText: '#E5E5E5',
    colorTextSecondary: '#BFBFBF',
    colorTextTertiary: '#999999',
    colorTextQuaternary: '#666666',
    colorBorderSecondary: '#404040',
    colorBorder: '#525252',
    colorFill: '#2A2A2A',
    colorFillSecondary: '#242424',
    colorFillTertiary: '#1D1D1D',
    colorFillQuaternary: '#171717',
    colorBgLayout: '#1F1F1F',
    colorWarningBgHover: '#4A3A1F',
    colorErrorBgHover: '#4A1F1F',
    colorSuccessBgHover: '#1A3A1F'
  }
};

export const darkThemeBasic: { basic: BasicTheme } = {
  // other color
  basic: {
    colorPrimaryActive: '#3B6FD9',
    colorPrimaryHover: '#6A9CFF',
    colorPrimaryBgHover: '#1A2F4D',
    colorPrimaryBgActive: '#0F1F33',
    colorPrimaryDisabled: '#4A5F7F',
    colorPrimaryShadow: '#4583FF33',
    colorDangerousActive: '#FAAFB9',
    colorBgLayoutGray: '#141414',
    colorFontGrayByWhite: '#808080',
    colorShadowByWhite: '#00000080',
    colorDefaultIcon: '#A6A6A6',
    colorWhite: '#FFFFFF',
    colorGrayLine: '#404040',
    controlHeight: 32,
    controlHeightLG: 36,
    controlHeightSM: 28,
    paddingNumber: 20,
    borderRadius4: 4
  }
};
