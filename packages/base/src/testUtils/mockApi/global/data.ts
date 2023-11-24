import {
  IGetUser,
  IGetOauth2TipsResData,
  IBasicInfo
} from '@actiontech/shared/lib/api/base/service/common';
import { GetUserAuthenticationTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export const UserInfo = {
  token: 'Dhsiwkow133jn',
  name: 'test',
  userUid: '300123'
};

export const GetUserPayload: IGetUser = {
  authentication_type: GetUserAuthenticationTypeEnum.dms,
  email: 'test@gamil.com',
  is_admin: true,
  name: 'test',
  uid: '300123',
  user_bind_projects: [
    {
      is_manager: true,
      project_id: '700300',
      project_name: 'default'
    }
  ]
};

export const oauth2Tips: IGetOauth2TipsResData = {
  enable_oauth2: true,
  login_tip: 'Login With Oauth2'
};

export const BasicInfo: IBasicInfo = {
  components: [],
  logo_url: '/v1/dms/personalization/logo',
  title: 'Actiontech'
};
