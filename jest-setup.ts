import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import baseZhCN from './packages/base/src/locale/zh-CN';
import commonZhCN from './packages/shared/lib/locale/zh-CN';
import TestMockApi from './packages/shared/lib/testUtil/mockApi';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import * as Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

const isSqle = !!(global as any).IS_SQLE;
const isBase = !!(global as any).IS_BASE;

Object.defineProperty(global, 'matchMedia', {
  writable: true,
  value: (query: any) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    };
  }
});
i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': isSqle
      ? { translation: {} }
      : {
          translation: {
            ...baseZhCN.translation,
            ...commonZhCN.translation
          }
        }
  },
  lng: 'zh-CN',
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false
  }
});

jest.setTimeout(60 * 1000);

if (isBase) {
  (globalThis as any).ASYNC_VALIDATOR_NO_WARNING = 1;
} else {
  (globalThis as any).ASYNC_VALIDATOR_NO_WARNING = undefined;
}

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
