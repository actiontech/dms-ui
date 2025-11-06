import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import baseZhCN from './packages/base/src/locale/zh-CN';
import sqleZhCN from './packages/sqle/src/locale/zh-CN';
import commonZhCN from './packages/dms-kit/src/locale/zh-CN';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import * as Enzyme from 'enzyme';
import 'jest-canvas-mock';

jest.mock('rehype-sanitize', () => () => jest.fn());
Enzyme.configure({ adapter: new Adapter() });
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
    'zh-CN': {
      translation: {
        ...baseZhCN.translation,
        ...sqleZhCN.translation,
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

const ignoreReactConsoleErrors = () => {
  const rules = [
    'Warning: findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-nod'
  ];

  const originalError = console.error;

  beforeAll(() => {
    console.error = (...arg) => {
      if (typeof arg[0] === 'string' && rules.some((v) => arg[0].includes(v))) {
        return;
      }
      originalError(...arg);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });
};

ignoreReactConsoleErrors();

jest.setTimeout(60 * 1000);
