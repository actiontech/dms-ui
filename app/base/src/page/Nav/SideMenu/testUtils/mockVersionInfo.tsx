import * as useVersionInfo from '../UserMenu/hooks/useVersionInfo';
import { mockVersionInfoData } from './data';

export const mockVersionInfo = (data?: Partial<typeof mockVersionInfoData>) => {
  const spy = jest.spyOn(useVersionInfo, 'default');
  spy.mockImplementation(() => ({
    ...mockVersionInfoData,
    ...data
  }));
};
