import { useMemo } from 'react';
import { SupportLanguage } from '../../enum';
import antd_zh_CN from 'antd/locale/zh_CN';
import antd_en_US from 'antd/locale/en_US';

const usePreferredLanguages = () => {
  const getPreferredLanguages = () => {
    if (navigator.languages && navigator.languages.length) {
      return Array.from(navigator.languages);
    }
    return [navigator.language];
  };

  const { currentLanguage, antdLanguage, preferredEnUS, preferredZhCN } =
    useMemo(() => {
      const lang = getPreferredLanguages()?.[0].startsWith('en')
        ? SupportLanguage.enUS
        : SupportLanguage.zhCN;

      return {
        currentLanguage: lang,
        antdLanguage: lang === SupportLanguage.enUS ? antd_en_US : antd_zh_CN,
        preferredEnUS: lang === SupportLanguage.enUS,
        preferredZhCN: lang === SupportLanguage.zhCN
      };
    }, []);

  return {
    getPreferredLanguages,
    currentLanguage,
    antdLanguage,
    preferredEnUS,
    preferredZhCN
  };
};

export default usePreferredLanguages;
