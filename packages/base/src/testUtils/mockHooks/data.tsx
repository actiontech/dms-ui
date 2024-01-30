import * as useSystemConfig from '../../hooks/useSystemConfig';

export const mockSystemConfigData = {
  logoSrc: 'custom_logo_mock_src_url',
  renderWebTitle: () => <useSystemConfig.DefaultWebTitle />,
  syncWebTitleAndLogo: jest.fn()
};
