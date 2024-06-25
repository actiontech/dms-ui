import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Typography, Form } from 'antd';
import { OauthLoginFormFields } from './index.type';
import { updateToken } from '../../store/user';
import { useNavigate } from 'react-router-dom';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import LoginLayout from '../Login/components/LoginLayout';
import { BasicButton, BasicInput } from '@actiontech/shared';
import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/shared/lib/data/common';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import useBrowserVersionTips from '../../hooks/useBrowserVersionTips';
import { LockFilled, UserFilled } from '@actiontech/icons';
import useThemeStyleData from '../../hooks/useThemeStyleData';

// #if [ee]
import { LocalStorageWrapper } from '@actiontech/shared';
import {
  StorageKey,
  CompanyNoticeDisplayStatusEnum
} from '@actiontech/shared/lib/enum';
// #endif

const BindUser = () => {
  const navigate = useNavigate();

  const { baseTheme } = useThemeStyleData();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  useBrowserVersionTips();

  const loginLock = useRef(false);

  const concatToken = (token = '') => {
    if (!token) {
      return '';
    }
    return `Bearer ${token}`;
  };

  const login = (values: OauthLoginFormFields) => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauth2Token = urlParams.get('oauth2_token');
    loginLock.current = true;
    if (!oauth2Token) {
      eventEmitter.emit(EmitterKey.OPEN_GLOBAL_NOTIFICATION, 'error', {
        message: t('dmsLogin.oauth.errorTitle'),
        description: t('dmsLogin.oauth.lostOauth2Token'),
        duration: 0
      });
      loginLock.current = false;
      return;
    }
    dms
      .BindOauth2User({
        oauth2_token: oauth2Token,
        user_name: values.username,
        pwd: values.password
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dispatch(updateToken({ token: concatToken(res.data.data?.token) }));
          navigate('/');
          // #if [ee]
          LocalStorageWrapper.set(
            StorageKey.SHOW_COMPANY_NOTICE,
            CompanyNoticeDisplayStatusEnum.NotDisplayed
          );
          // #endif
        }
      })
      .finally(() => {
        loginLock.current = false;
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      eventEmitter.emit(EmitterKey.OPEN_GLOBAL_NOTIFICATION, 'error', {
        message: t('dmsLogin.oauth.errorTitle'),
        description: error,
        duration: 0
      });
      return;
    }
    const userExist = urlParams.get('user_exist') === 'true';
    if (!userExist) return;
    const token = urlParams.get('dms_token');
    if (!token) {
      eventEmitter.emit(EmitterKey.OPEN_GLOBAL_NOTIFICATION, 'error', {
        message: t('dmsLogin.oauth.errorTitle'),
        description: t('dmsLogin.oauth.lostToken'),
        duration: 0
      });
      return;
    }
    dispatch(updateToken({ token: concatToken(token) }));
    navigate('/');
  }, [dispatch, navigate, t]);

  return (
    <LoginLayout>
      <Form onFinish={login} disabled={loginLock.current}>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('dmsLogin.oauth.form.username', {
                  title: DMS_DEFAULT_WEB_TITLE
                })
              })
            }
          ]}
        >
          <BasicInput
            placeholder={t('dmsLogin.oauth.form.username', {
              title: DMS_DEFAULT_WEB_TITLE
            })}
            autoFocus
            className="login-form-field"
            prefix={
              <UserFilled
                width="18"
                height="19"
                color={baseTheme.icon.bindUser.user}
              />
            }
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('common.password')
              })
            }
          ]}
        >
          <BasicInput.Password
            placeholder={t('common.password')}
            className="login-form-field"
            prefix={
              <LockFilled
                width={18}
                height={18}
                color={baseTheme.icon.bindUser.password}
              />
            }
          />
        </Form.Item>
        <Typography.Text type="secondary">
          {t('dmsLogin.oauth.bindTips')}
        </Typography.Text>
        <BasicButton
          type="primary"
          block
          htmlType="submit"
          className="login-btn"
          loading={loginLock.current}
        >
          {t('dmsLogin.oauth.submitButton')}
        </BasicButton>
      </Form>
    </LoginLayout>
  );
};

export default BindUser;
