import * as useFeaturePermission from '../../global/useFeaturePermission';
import { mockFeaturePermissionData } from './data';

export const mockUseFeaturePermission = (
  mockData?: Partial<typeof mockFeaturePermissionData>
) => {
  const spy = jest.spyOn(useFeaturePermission, 'default');
  spy.mockImplementation(() => ({
    ...mockFeaturePermissionData,
    ...mockData
  }));
  return spy;
};
