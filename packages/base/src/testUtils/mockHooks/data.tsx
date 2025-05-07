import * as useSystemConfig from '../../hooks/useSystemConfig';

export const mockSystemConfigData = {
  logoSrc: 'custom_logo_mock_src_url',
  renderWebTitle: () => <useSystemConfig.DefaultWebTitle />,
  syncWebTitleAndLogo: jest.fn()
};

export const mockUseRecentlySelectedZoneData = {
  availabilityZone: undefined,
  updateRecentlySelectedZone: jest.fn(),
  recentlySelectedZoneRecord: [],
  setAvailabilityZone: jest.fn(),
  setRecentlySelectedZoneRecord: jest.fn(),
  initializeAvailabilityZone: jest.fn(),
  verifyRecentlySelectedZoneRecord: jest.fn(),
  availabilityZoneOptions: []
};
