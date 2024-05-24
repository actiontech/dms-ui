import { SharedStepDetails } from '../../index.type';

export const MockSharedStepDetail: SharedStepDetails = {
  isAuditing: {
    value: false,
    set: jest.fn()
  },
  dbSourceInfoCollection: {
    value: { '0': {} },
    set: jest.fn()
  },
  instanceTestConnectResults: {
    value: [],
    set: jest.fn()
  },
  isDisabledForDifferenceSql: {
    value: false,
    set: jest.fn()
  },
  sqlStatementTabActiveKey: {
    value: '1',
    set: jest.fn()
  },
  resetAllSharedData: jest.fn()
};
