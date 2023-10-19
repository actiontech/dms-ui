import { SupportTheme } from '../../enum';

export const changeThemeStyle = ({
  theme,
  startChangeTheme,
  finishChangeTheme
}: {
  theme: SupportTheme;
  startChangeTheme: () => void;
  finishChangeTheme: () => void;
}) => {
  let newId = 'light-theme';
  let styleTagId = '#dark-theme';
  let href = '/assets/css/antd.min.css';
  if (theme === SupportTheme.DARK) {
    newId = 'dark-theme';
    styleTagId = '#light-theme';
    href = '/assets/css/antd.dark.min.css';
    if (document.querySelector(`#${newId}`)) {
      return;
    }
  } else if (document.querySelector(`#${newId}`)) {
    return;
  }

  const styleElement = document.querySelector(styleTagId);
  const newStyleElement = document.createElement('link');
  newStyleElement.id = newId;
  newStyleElement.type = 'text/css';
  newStyleElement.rel = 'stylesheet';
  newStyleElement.href = href;
  startChangeTheme();
  if (styleElement) {
    newStyleElement.onload = () => {
      finishChangeTheme();
      styleElement.remove();
    };
    styleElement.after(newStyleElement);
  } else {
    const title = document.querySelector('head title');
    title?.after(newStyleElement);
  }
};
