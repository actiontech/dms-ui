import * as useCurrentUser from '../../global/useCurrentUser';
import { mockCurrentUserReturn } from './data';

export const mockUseCurrentUser = () => {
  const spy = jest.spyOn(useCurrentUser, 'default');
  spy.mockImplementation(() => mockCurrentUserReturn);
  return spy;
};
