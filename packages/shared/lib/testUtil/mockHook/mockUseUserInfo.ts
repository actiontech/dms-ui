import * as useUserInfo from '../../features/useUserInfo';
import { mockUserInfo } from './data';

export const mockUseUserInfo = (mockData?: Partial<typeof mockUserInfo>) => {
  const spy = jest.spyOn(useUserInfo, 'default');
  spy.mockImplementation(() => ({ ...mockUserInfo, ...mockData }));
  return spy;
};
