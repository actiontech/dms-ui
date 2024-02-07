import * as useSystemConfig from '../../hooks/useSystemConfig';
import { mockSystemConfigData } from './data';

export const mockSystemConfig = (
  data?: Partial<typeof mockSystemConfigData>
) => {
  const spy = jest.spyOn(useSystemConfig, 'default');
  spy.mockImplementation(() => ({
    ...mockSystemConfigData,
    ...data
  }));
};
