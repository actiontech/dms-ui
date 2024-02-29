import * as useTableSettings from '../../../hooks/useTableSettings';
import { mockUseTableSettingsData } from './data';

export const mockUseTableSettings = (
  data?: Partial<typeof mockUseTableSettingsData>
) => {
  const spy = jest.spyOn(useTableSettings, 'default');
  spy.mockImplementation(() => ({
    ...(mockUseTableSettingsData as any),
    ...data
  }));
};
