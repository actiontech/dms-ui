/**
 *  Generated by actionsky-cli api-mocks, do not modify this file unless necessary.
 *  When modifying the file, please also update the corresponding unit test files.
 */

import { ISSHPublicKeyInfo } from '@actiontech/shared/lib/api/sqle/service/common.d';

export const deriversMockData = [
  {
    driver_name: 'mysql',
    default_port: 3000,
    logo_url: 'test/logo?instance_type=mysql'
  }
];

export const testGitConnectionMockData = {
  is_connected_success: true,
  error_message: null,
  branches: ['main', 'test']
};

export const getSSHPublicKeyMockData = {
  public_key:
    'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDzBOtcopZ1IdU51augExmKzRRYsJdNDnxVf5mlCRch2hMq4y02F4q4T71WFoLg22FptnxmY+LkOPgYyIvl6MdfBS6RQarc3aC2rO5bCbzuMf2f6+2hbYH3ACXJWAn4xX8b0ZK25t1u8jrXmAJPVXIMLEcLL4Wo7IqCQ1PwrkIeXuMfznHzVoAEv5o+jbUkj++I46AEmqrmDsgWCt83JK7ctBzhEXJWhF5rSyqGxXBptVPVMEO4ShJi2rKdk+ZbBGIAGu0db72hlvdqzUeU2Ng+J0dcIDsS/4pmEtQ+6uJFgslqF2Vt708tcOPTG4qdfFaK453PyceZ/F/f/BN+bPDJCh+oPQ3zdsKHmh0rXefICPMWe73QRLAyW/JeWcsnFlgoBmlwB4++Isc6xYx0dHFM/ws10vTJDif3CAi0VE1vKdSZvVxTFq5bZKhTX3zfA24yZzAl9BCOrQzWh20NWJ3Lgwk2JWL3NVsChKNk4aTCHNz1OyW/nojrd5tCyyqF06OqG1/xc5RmRkCH9gXqFA0Ngf3IdxJdpL9q3G60CBAi7Gfs6+gLIlMc6sgnlZdnyCj3Gmh7yRrmMZUDAmZnyvrYw3+4qQcVBi5gw64wuya2K6Hz6lrgxT9AlcUTNdHn1W6TimZtO3JUDclMUbA6euN/NOFsY4VpYPVNoMND3Lwesw=='
} as ISSHPublicKeyInfo;
