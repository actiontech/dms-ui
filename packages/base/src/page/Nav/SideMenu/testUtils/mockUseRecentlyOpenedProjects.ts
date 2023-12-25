import * as useRecentlyOpenedProjects from '../useRecentlyOpenedProjects';
import { mockRecentlyOpenedProjectsData } from './data';

export const mockUseRecentlyOpenedProjects = (
  data?: Partial<typeof mockRecentlyOpenedProjectsData>
) => {
  const spy = jest.spyOn(useRecentlyOpenedProjects, 'default');
  spy.mockImplementation(() => ({
    ...mockRecentlyOpenedProjectsData,
    ...data
  }));
  return spy;
};
