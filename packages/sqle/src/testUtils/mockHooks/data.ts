import { driverMeta } from '../../hooks/useDatabaseType/index.test.data';

export const mockUseDatabaseType = {
  loading: false,
  driverNameList: [],
  updateDriverNameList: jest.fn(),
  generateDriverSelectOptions: jest.fn(),
  driverMeta: driverMeta,
  dbTypeOptions: [],
  getLogoUrlByDbType: jest.fn()
};
