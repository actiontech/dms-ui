export const mockRecentlyOpenedProjectsData = {
  recentlyProjects: [
    {
      project_id: '1',
      project_name: 'test_project'
    }
  ],
  updateRecentlyProject: jest.fn(),
  currentProjectID: '0',
  getRecentlyProjectId: jest.fn(),
  getRecentlyProjectIdByUserInfo: jest.fn()
};

export const mockVersionInfoData = {
  updateVersionInfo: jest.fn(),
  dmsVersion: 'dms-ce 081d27e60f',
  sqleVersion: 'sqle-ce 081d27e699',
  provisionVersion: 'PROVISION: main b8c2eabbae'
};
