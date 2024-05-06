import * as useCurrentPermission from '../../global/useCurrentPermission';
import { mockCurrentPermissionData } from './data';

export const mockUseCurrentPermission = (
  mockData?: Partial<typeof mockCurrentPermissionData>
) => {
  const spy = jest.spyOn(useCurrentPermission, 'default');
  spy.mockImplementation(() => ({
    ...mockCurrentPermissionData,
    ...mockData
  }));
  return spy;
};
