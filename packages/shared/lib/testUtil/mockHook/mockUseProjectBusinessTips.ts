import * as useProjectBusinessTips from '../../global/useProjectBusinessTips';
import { mockUseProjectBusinessTipsData } from './data';

export const mockUseProjectBusinessTips = (
  mockData?: Partial<typeof mockUseProjectBusinessTipsData>
) => {
  const spy = jest.spyOn(useProjectBusinessTips, 'default');
  spy.mockImplementation(() => ({
    ...mockUseProjectBusinessTipsData,
    ...mockData
  }));
  return spy;
};
