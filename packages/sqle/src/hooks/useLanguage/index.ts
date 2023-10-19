import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import zhCN from 'antd/es/locale/zh_CN';
import en from 'antd/es/locale/en_US';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../store';
import { updateLanguage } from '../../store/locale';
import { SupportLanguage } from '@actiontech/shared/lib/enum';
import { ZhCN, EnUS } from '@actiontech/shared/lib/components/Icons';

const languageData = {
  [SupportLanguage.zhCN]: {
    moment: 'zh-cn',
    antd: zhCN,
    label: '中文',
    icon: ZhCN
  },
  [SupportLanguage.enUS]: {
    moment: 'en-gb',
    antd: en,
    label: 'English',
    icon: EnUS
  }
};

const assertLanguage = (language: string): language is SupportLanguage => {
  return language in languageData;
};

const useLanguage = () => {
  const language = useSelector<IReduxState, string>(
    (state) => state.locale.language
  );
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const antdLocale = React.useMemo(() => {
    let currentLanguage = SupportLanguage.zhCN;
    if (assertLanguage(language)) {
      currentLanguage = language;
    }
    return languageData[currentLanguage].antd;
  }, [language]);

  React.useEffect(() => {
    if (!assertLanguage(language)) {
      dispatch(updateLanguage({ language: SupportLanguage.zhCN }));
      return;
    }
    i18n.changeLanguage(language);
    moment.locale(languageData[language].moment);
  }, [language, i18n, dispatch]);

  return {
    antdLocale
  };
};

export { languageData };
export default useLanguage;
