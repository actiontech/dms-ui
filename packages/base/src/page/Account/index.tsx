import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, BasicButton, ConfigItem } from '@actiontech/shared';
import useUserInfo from '@actiontech/shared/lib/features/useUserInfo';
import {
  AccountContentStyleWrapper,
  AccountContentTitleStyleWrapper
} from './style';
import UpdatePassword from './components/UpdatePassword';
import { useBoolean } from 'ahooks';
import { Spin, message } from 'antd';
import { LabelContent } from '@actiontech/shared/lib/components/ConfigItem';
import UserWechat from './components/UserWechat';
import UserPhone from './components/UserPhone';
import UserEmail from './components/UserEmail';
import AccessToken from './components/AccessToken';
import PersonalSMS from './PersonalSMS';

const Account: React.FC = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const [
    updatePasswordDrawerVisible,
    { setTrue: showUpdatePasswordDrawer, setFalse: hideUpdatePasswordDrawer }
  ] = useBoolean();

  const { userInfo, getUserInfo, updateUserInfo, getUserInfoLoading } =
    useUserInfo();

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <div>
      {contextHolder}
      <PageHeader title={t('dmsAccount.pageTitle')}></PageHeader>
      <AccountContentStyleWrapper>
        <AccountContentTitleStyleWrapper>
          {t('dmsAccount.accountTitle')}
          <BasicButton type="primary" onClick={showUpdatePasswordDrawer}>
            {t('dmsAccount.modifyPassword.button')}
          </BasicButton>
        </AccountContentTitleStyleWrapper>
        <Spin spinning={getUserInfoLoading}>
          <ConfigItem
            label={
              <LabelContent>
                {t('dmsUserCenter.user.userForm.username')}
              </LabelContent>
            }
            descNode={!!userInfo?.name ? userInfo?.name : '-'}
            fieldVisible={false}
            needEditButton={false}
          />
          <UserEmail
            updateUserInfo={updateUserInfo}
            userBaseInfo={userInfo}
            messageApi={messageApi}
          />
          <UserWechat
            updateUserInfo={updateUserInfo}
            userBaseInfo={userInfo}
            messageApi={messageApi}
          />
          <UserPhone
            updateUserInfo={updateUserInfo}
            userBaseInfo={userInfo}
            messageApi={messageApi}
          />
          <UpdatePassword
            open={updatePasswordDrawerVisible}
            onClose={hideUpdatePasswordDrawer}
          />

          <AccessToken
            token={userInfo?.access_token_info?.access_token}
            hasExpired={userInfo?.access_token_info?.is_expired}
            expiration={userInfo?.access_token_info?.token_expired_timestamp}
            updateUserInfo={updateUserInfo}
          />
          {/* #if [ee] */}
          <PersonalSMS
            userBaseInfo={userInfo}
            getUserInfo={getUserInfo}
            loading={getUserInfoLoading}
          />
          {/* #endif */}
        </Spin>
      </AccountContentStyleWrapper>
    </div>
  );
};

export default Account;
