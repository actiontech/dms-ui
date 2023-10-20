import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Typography, Form, notification } from 'antd5';
import { OauthLoginFormFields } from './index.type';
import { updateToken } from '../../store/user';
import { useNavigate } from 'react-router-dom';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import LoginLayout from '../Login/components/LoginLayout';
import { BasicButton, BasicInput } from '@actiontech/shared';
import { IconCommonUser, IconCommonPassword } from '../../icon/common';
import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/shared/lib/data/common';

const BindUser = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { t } = useTranslation();

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
    if (loginLock.current) {
      return;
    }
    loginLock.current = true;
    if (!oauth2Token) {
      notification.error({
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
        }
      })
      .finally(() => {
        loginLock.current = false;
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const userExist = urlParams.get('user_exist') === 'true';
    const token = urlParams.get('dms_token');
    if (error) {
      notification.error({
        message: t('dmsLogin.oauth.errorTitle'),
        description: error,
        duration: 0
      });
    } else if (userExist) {
      if (!token) {
        notification.error({
          message: t('dmsLogin.oauth.errorTitle'),
          description: t('dmsLogin.oauth.lostToken'),
          duration: 0
        });
      } else {
        dispatch(updateToken({ token: concatToken(token) }));
        navigate('/');
      }
    }
  }, [dispatch, navigate, t]);

  return (
    <LoginLayout>
      <Form onFinish={login}>
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
            prefix={<IconCommonUser />}
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
            prefix={<IconCommonPassword />}
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
        >
          {t('dmsLogin.oauth.submitButton')}
        </BasicButton>
      </Form>
    </LoginLayout>
  );
};

export default BindUser;
