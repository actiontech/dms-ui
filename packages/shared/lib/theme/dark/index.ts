import { createTheme } from '@mui/system';
import { darkThemeBasic, darkThemeUI } from './basic';
import { darkComponentsTheme } from './components';

const oldDarkTheme = {
  common: {
    padding: 24,
    color: {
      warning: '#faad14',
      disabledFont: 'rgba(255, 255, 255, .85)'
    }
  },
  header: {
    background: '#001529',
    color: '#fff'
  },
  provisionHeader: {
    background: 'rgb(15, 28, 41)',
    color: '#fff'
  },
  editor: {
    border: '1px solid #434343'
  },
  projectLayoutSider: {
    border: '1px solid #303030'
  },
  optionsHover: {
    background: 'hsla(0, 0%, 100%, 0.08)'
  },
  layout: {
    padding: '24px'
  },
  slide: {
    title: {
      color: '#fff'
    }
  },
  guide: {
    stepBox: {
      titleBorderBottom: '1px solid #424242',
      innerBoxBgColor: '#262626',
      innerBoxBorderRight: '1px dashed #424242'
    }
  },
  color: {
    link: '#1890ff',
    success: '#52c41a',
    warn: '#faad14',
    danger: '#ff4d4f',
    secondary: '#00000073',
    disabled: '#00000040'
  },
  auditResultLevelNormalBox: {
    color: 'rgba(255, 255, 255, .85)',
    border: '1px solid rgba(255, 255, 255, .85)'
  }
};

const darkTheme = createTheme({
  ...oldDarkTheme,
  sharedTheme: {
    ...darkThemeUI,
    ...darkThemeBasic,
    components: darkComponentsTheme
  }
});

export default darkTheme;
