import * as useSessionUser from '../../hooks/useSessionUser';
import { mockUseSessionUserData } from './data';

export const mockUseSessionUser = (
  data?: Partial<typeof mockUseSessionUserData>
) => {
  const spy = jest.spyOn(useSessionUser, 'default');
  spy.mockImplementation(() => ({
    ...mockUseSessionUserData,
    ...data
  }));
  return spy;
};
