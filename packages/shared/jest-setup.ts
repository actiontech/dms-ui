import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SupportLanguage } from './lib/enum';
import zhCN from './lib/locale/zh-CN';
import TestMockApi from './lib/testUtil/mockApi';


i18n.use(initReactI18next).init({
  resources: {
    [SupportLanguage.zhCN]: zhCN
  },
  lng: SupportLanguage.zhCN,
  fallbackLng: SupportLanguage.zhCN,
  interpolation: {
    escapeValue: false
  }
});

const api = TestMockApi.getServer();

// mock api
beforeAll(() => {
  api.listen();
});

afterEach(() => {
  api.resetHandlers();
});

afterAll(() => {
  api.close();
});
