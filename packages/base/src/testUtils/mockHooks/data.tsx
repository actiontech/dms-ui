import * as useSystemConfig from '../../hooks/useSystemConfig';

export const mockSystemConfigData = {
  logoSrc: 'custom_logo_mock_src_url',
  renderWebTitle: () => <useSystemConfig.DefaultWebTitle />,
  syncWebTitleAndLogo: jest.fn()
};

export const mockUseRecentlySelectedZoneData = {
  availabilityZone: undefined,
  updateRecentlySelectedZone: jest.fn(),
  setAvailabilityZone: jest.fn(),
  verifyRecentlySelectedZoneRecord: jest.fn(),
  clearRecentlySelectedZone: jest.fn()
};

export const mockUseSessionUserData = {
  sessionUser: undefined,
  getSessionUserLoading: false,
  getUserBySession: jest.fn(),
  getSessionUserInfoAsync: jest.fn(() => Promise.resolve(false)),
  shouldNavigateToWorkbench: false,
  getSessionUserSystemLoading: false
};

export const mockUseNavigateToWorkbenchData = {
  navigateToWorkbenchAsync: jest.fn(() => Promise.resolve(undefined)),
  getAvailabilityZoneTipsAsync: jest.fn(() => Promise.resolve([])),
  navigateToWorkbenchLoading: false,
  getAvailabilityZoneTipsLoading: false
};
