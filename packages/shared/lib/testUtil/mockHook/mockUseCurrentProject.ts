import * as useCurrentProject from '../../global/useCurrentProject';
import { mockProjectInfo } from './data';

export const mockUseCurrentProject = (
  data?: Partial<typeof mockProjectInfo>
) => {
  const spy = jest.spyOn(useCurrentProject, 'default');
  spy.mockImplementation(() => ({
    ...mockProjectInfo,
    ...data
  }));
  return spy;
};
