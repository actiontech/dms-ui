import * as useDbServiceDriver from '../../global/useDbServiceDriver';
import { mockDBServiceDriverInfo } from './data';

export const mockUseDbServiceDriver = () => {
  const spy = jest.spyOn(useDbServiceDriver, 'default');
  spy.mockImplementation(() => mockDBServiceDriverInfo);
  return spy;
};
