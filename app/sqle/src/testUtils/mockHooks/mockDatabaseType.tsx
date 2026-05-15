import * as useDatabaseType from '../../hooks/useDatabaseType';
import { mockUseDatabaseType } from './data';

export const mockDatabaseType = (
  data?: Partial<typeof mockUseDatabaseType>
) => {
  const spy = jest.spyOn(useDatabaseType, 'default');
  spy.mockImplementation(() => ({
    ...mockUseDatabaseType,
    ...data
  }));
  return spy;
};
