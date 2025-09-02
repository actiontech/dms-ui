import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  PageHeader,
  BasicButton,
  ConfigItem,
  BasicSwitch
} from '@actiontech/shared';
import useUserInfo from '@actiontech/shared/lib/features/useUserInfo';
import {
  AccountContentStyleWrapper,
  AccountContentTitleStyleWrapper,
  PrivacyControlsStyleWrapper
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
import PrivacyAuthorizationModal from './components/PrivacyAuthorizationModal';
import PrivacyRevocationModal from './components/PrivacyRevocationModal';
import usePrivacyAuthorization from './hooks/usePrivacyAuthorization';
import { LockFilled } from '@actiontech/icons';
import { usePasswordSecurity } from '../../hooks/usePasswordSecurity';

const Account: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [messageApi, contextHolder] = message.useMessage();

  const [
    updatePasswordDrawerVisible,
    { setTrue: showUpdatePasswordDrawer, setFalse: hideUpdatePasswordDrawer }
  ] = useBoolean();

  const {
    userInfo,
    getUserInfo,
    getUserInfoAsync,
    updateUserInfo,
    getUserInfoLoading
  } = useUserInfo();

  const {
    isAuthorized,
    isAuthorizationModalOpen,
    isRevocationModalOpen,
    onAuthorize,
    onRevoke,
    hideAuthorizationModal,
    hideRevocationModal,
    showRevocationModal,
    showAuthorizationModal,
    updateAuthorizationStatus
  } = usePrivacyAuthorization();

  const { isFirstLogin, passwordExpired, completeFirstLoginPasswordChange } =
    usePasswordSecurity();

  // 检查URL参数，如果有action=change-password则自动打开密码修改抽屉
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'change-password') {
      showUpdatePasswordDrawer();
    }
  }, [location.search, showUpdatePasswordDrawer]);

  useEffect(() => {
    getUserInfoAsync().then((res) => {
      if (res.data.data?.email || res.data.data?.wxid || res.data.data?.phone) {
        updateAuthorizationStatus(true);
      }
    });
  }, [getUserInfoAsync, updateAuthorizationStatus]);

  const handleAuthorize = () => {
    onAuthorize();
    messageApi.success(t('dmsAccount.privacy.authorizationSuccess'));
  };

  const handleRevoke = () => {
    onRevoke();
    messageApi.success(t('dmsAccount.privacy.revocationSuccess'));
    // 撤回授权后需要重新获取用户信息，清除敏感数据
    updateUserInfo();
  };

  // 处理密码修改成功
  const handlePasswordChangeSuccess = async () => {
    try {
      // 如果是首次登录，更新首次登录状态
      if (isFirstLogin) {
        await completeFirstLoginPasswordChange();
      }

      messageApi.success(t('dmsAccount.modifyPassword.success'));
      hideUpdatePasswordDrawer();
    } catch {
      messageApi.error(t('dmsAccount.modifyPassword.error'));
    }
  };

  // 获取密码修改组件的标题和描述
  const getPasswordChangeProps = () => {
    if (isFirstLogin) {
      return {
        title: t('dmsAccount.modifyPassword.forceChangeTitle'),
        description: t('dmsAccount.modifyPassword.forceChangeDesc'),
        isForceChange: true
      };
    }

    if (passwordExpired) {
      return {
        title: t('dmsAccount.modifyPassword.passwordExpiryTitle'),
        description: t('dmsAccount.modifyPassword.passwordExpiryDesc'),
        isForceChange: true
      };
    }

    return {
      isForceChange: false
    };
  };

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
        <PrivacyControlsStyleWrapper>
          <div className="privacy-control-header">
            <div className="privacy-icon">
              <LockFilled />
            </div>
            <div className="privacy-title">
              {t('dmsAccount.privacy.controlTitle')}
            </div>
          </div>
          <div className="privacy-description">
            {t('dmsAccount.privacy.controlDescription')}
          </div>
          <div className="privacy-control-row">
            <div className="privacy-status-info">
              <div
                className={`privacy-status-dot ${
                  isAuthorized ? 'authorized' : 'unauthorized'
                }`}
              />
              <span
                className={`privacy-status-text ${
                  isAuthorized ? 'authorized' : 'unauthorized'
                }`}
              >
                {isAuthorized
                  ? t('dmsAccount.privacy.statusAuthorized')
                  : t('dmsAccount.privacy.statusUnauthorized')}
              </span>
            </div>
            <div className="privacy-control-action">
              <BasicSwitch
                checked={isAuthorized}
                onChange={(checked) => {
                  if (checked) {
                    showAuthorizationModal();
                  } else {
                    showRevocationModal();
                  }
                }}
              />
            </div>
          </div>
        </PrivacyControlsStyleWrapper>
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
            privacyAuthorization={{ isAuthorized }}
          />
          <UserWechat
            updateUserInfo={updateUserInfo}
            userBaseInfo={userInfo}
            messageApi={messageApi}
            privacyAuthorization={{ isAuthorized }}
          />
          <UserPhone
            updateUserInfo={updateUserInfo}
            userBaseInfo={userInfo}
            messageApi={messageApi}
            privacyAuthorization={{ isAuthorized }}
          />
          <UpdatePassword
            open={updatePasswordDrawerVisible}
            onClose={hideUpdatePasswordDrawer}
            onSuccess={handlePasswordChangeSuccess}
            {...getPasswordChangeProps()}
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

      <PrivacyAuthorizationModal
        open={isAuthorizationModalOpen}
        onConfirm={handleAuthorize}
        onCancel={hideAuthorizationModal}
      />

      <PrivacyRevocationModal
        open={isRevocationModalOpen}
        onConfirm={handleRevoke}
        onCancel={hideRevocationModal}
      />
    </div>
  );
};

export default Account;
