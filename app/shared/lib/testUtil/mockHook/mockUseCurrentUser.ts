import * as useCurrentUser from '../../features/useCurrentUser';
import { mockCurrentUserReturn } from './data';

export const mockUseCurrentUser = (
  data?: Partial<typeof mockCurrentUserReturn>
) => {
  const spy = jest.spyOn(useCurrentUser, 'default');
  spy.mockImplementation(() => ({ ...mockCurrentUserReturn, ...data }));
  return spy;
};
