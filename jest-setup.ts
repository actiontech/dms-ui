import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import baseZhCN from './packages/base/src/locale/zh-CN';
import sqleZhCN from './packages/sqle/src/locale/zh-CN';
import commonZhCN from './packages/shared/lib/locale/zh-CN';
import provisionZhCN from './packages/provision/src/locale/zh-CN';
import diagnosisZhCN from './packages/diagnosis/src/locale/zh-CN';
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
        ...provisionZhCN.translation,
        ...diagnosisZhCN.translation,
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
