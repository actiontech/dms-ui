import { createTheme } from '@mui/system';
import { lightThemeBasic, lightThemeUI } from './basic';
import { lightComponentsTheme } from './components';

//todo remove
const oldLightTheme = {
  common: {
    padding: 24,
    color: {
      warning: '#faad14',
      disabledFont: 'rgba(0, 0, 0, .85)'
    }
  },

  header: {
    background: '#001529',
    color: '#fff'
  },
  provisionHeader: {
    background: '#fff',
    color: '#fff'
  },
  editor: {
    border: '1px solid #d9d9d9'
  },
  projectLayoutSider: {
    border: '1px solid #d9d9d9'
  },
  optionsHover: {
    background: '#f5f5f5'
  },
  layout: {
    padding: '24px'
  },
  slide: {
    title: {
      color: 'rgba(0, 0, 0, 0.85)'
    }
  },
  guide: {
    stepBox: {
      titleBorderBottom: '1px solid #d9d9d9',
      innerBoxBgColor: '#f5f5f5',
      innerBoxBorderRight: '1px dashed #d9d9d9'
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

const lightTheme = createTheme({
  ...oldLightTheme,
  sharedTheme: {
    ...lightThemeUI,
    ...lightThemeBasic,
    components: lightComponentsTheme
  }
});

export default lightTheme;
