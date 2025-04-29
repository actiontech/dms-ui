import * as useRecentlySelectedZone from '../../hooks/useRecentlySelectedZone';
import { mockUseRecentlySelectedZoneData } from './data';

export const mockUseRecentlySelectedZone = (
  data?: Partial<typeof useRecentlySelectedZone.default>
) => {
  return jest
    .spyOn(useRecentlySelectedZone, 'default')
    .mockImplementation(() => ({
      ...mockUseRecentlySelectedZoneData,
      ...data
    }));
};
