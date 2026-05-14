import * as useBusinessWritePermission from '../../features/useBusinessWritePermission';

export const mockBusinessWritePermissionReturn = {
  isBusinessWriteDisabled: false,
  isBWPOff: false,
  businessWritePermission: true
};

export const mockUseBusinessWritePermission = (
  data?: Partial<typeof mockBusinessWritePermissionReturn>
) => {
  const spy = jest.spyOn(useBusinessWritePermission, 'default');
  spy.mockImplementation(() => ({
    ...mockBusinessWritePermissionReturn,
    ...data
  }));
  return spy;
};
