import * as usePermission from '../../global/usePermission/usePermission';
import { mockUsePermissionData } from './data';

export const mockUsePermission = (
  mockData?: Partial<typeof mockUsePermissionData>
) => {
  const spy = jest.spyOn(usePermission, 'default');
  spy.mockImplementation(() => ({ ...mockUsePermissionData, ...mockData }));
  return spy;
};
