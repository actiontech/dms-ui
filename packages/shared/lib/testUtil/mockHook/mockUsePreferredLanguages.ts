import * as usePreferredLanguages from '../../global/usePreferredLanguages';
import { mockUsePreferredLanguagesData } from './data';

export const mockUsePreferredLanguages = (
  mockData?: Partial<typeof mockUsePreferredLanguagesData>
) => {
  const spy = jest.spyOn(usePreferredLanguages, 'default');
  spy.mockImplementation(() => ({
    ...mockUsePreferredLanguagesData,
    ...mockData
  }));
  return spy;
};
