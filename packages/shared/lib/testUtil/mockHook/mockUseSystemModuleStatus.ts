import * as useSystemModuleStatus from '../../global/useSystemModuleStatus';
import { mockSystemModuleStatus } from './data';

export const mockUseSystemModuleStatus = (
  mockData?: Partial<typeof mockSystemModuleStatus>
) => {
  const spy = jest.spyOn(useSystemModuleStatus, 'default');
  spy.mockImplementation(() => ({
    ...mockSystemModuleStatus,
    ...mockData
  }));
  return spy;
};
