import * as useChangeTheme from '../../features/useChangeTheme';
import { mockUseChangeThemeReturn } from './data';

export const mockUseChangeTheme = (
  data?: Partial<typeof useChangeTheme.default>
) => {
  const spy = jest.spyOn(useChangeTheme, 'default');
  spy.mockImplementation(() => ({ ...mockUseChangeThemeReturn, ...data }));
  return spy;
};
