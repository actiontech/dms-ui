import * as useUserOperationPermission from '../../global/useUserOperationPermission';

import { mockUseUserOperationPermissionData } from './data';

export const mockUseUserOperationPermission = (
  mockData?: Partial<typeof mockUseUserOperationPermissionData>
) => {
  const spy = jest.spyOn(useUserOperationPermission, 'default');
  spy.mockImplementation(() => ({
    ...mockUseUserOperationPermissionData,
    ...mockData
  }));
  return spy;
};
