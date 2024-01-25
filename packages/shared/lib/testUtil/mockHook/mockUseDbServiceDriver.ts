import * as useDbServiceDriver from '../../global/useDbServiceDriver';
import { mockDBServiceDriverInfo } from './data';

export const mockUseDbServiceDriver = (
  mockData?: Partial<typeof mockDBServiceDriverInfo>
) => {
  const spy = jest.spyOn(useDbServiceDriver, 'default');
  spy.mockImplementation(() => ({
    ...mockDBServiceDriverInfo,
    ...mockData
  }));
  return spy;
};
