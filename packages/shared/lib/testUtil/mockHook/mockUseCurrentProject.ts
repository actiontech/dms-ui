import * as useCurrentProject from '../../global/useCurrentProject';
import { mockProjectInfo } from './data';

export const mockUseCurrentProject = () => {
  const spy = jest.spyOn(useCurrentProject, 'default');
  spy.mockImplementation(() => ({
    projectName: mockProjectInfo.projectName,
    projectID: mockProjectInfo.projectID,
    projectArchive: mockProjectInfo.projectArchive
  }));
  return spy;
};
