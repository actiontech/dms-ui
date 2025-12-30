import { BasicTagTheme } from '../../theme.type';
import { darkThemeUI } from '../basic';

const tagTheme: BasicTagTheme = {
  default: {
    color: darkThemeUI.uiToken.colorTextSecondary,
    backgroundColor: darkThemeUI.uiToken.colorFillTertiary
  },
  gray: {
    color: '#7d8ca8',
    backgroundColor: 'rgba(125, 140, 168, 0.2)'
  },
  red: {
    color: '#F66074',
    backgroundColor: 'rgba(246, 96, 116, 0.2)'
  },
  orange: {
    color: '#F59957',
    backgroundColor: 'rgba(245, 153, 87, 0.2)'
  },
  gold: {
    color: '#EBAD1C',
    backgroundColor: 'rgba(235, 173, 28, 0.2)'
  },
  green: {
    color: '#41BF9A',
    backgroundColor: 'rgba(65, 191, 154, 0.2)'
  },
  cyan: {
    color: '#15C7D4',
    backgroundColor: 'rgba(26, 206, 219, 0.2)'
  },
  blue: {
    color: '#3DB5F1',
    backgroundColor: 'rgba(61, 181, 241, 0.2)'
  },
  geekblue: {
    color: '#6094FC',
    backgroundColor: 'rgba(96, 148, 252, 0.2)'
  },
  purple: {
    color: '#7470ED',
    backgroundColor: 'rgba(116, 112, 237, 0.2)'
  },
  Grape: {
    color: '#7453DA',
    backgroundColor: 'rgba(116, 83, 218, 0.2)'
  },
  lilac: {
    color: '#9F6BE9',
    backgroundColor: 'rgba(159, 107, 233, 0.2)'
  }
};

export default tagTheme;
