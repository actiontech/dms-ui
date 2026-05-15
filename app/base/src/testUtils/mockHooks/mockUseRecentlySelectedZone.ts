import * as useRecentlySelectedZone from '@actiontech/dms-kit/es/features/useRecentlySelectedZone';
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
