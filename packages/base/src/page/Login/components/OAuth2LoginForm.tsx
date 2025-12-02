import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicButton } from '@actiontech/dms-kit';
import { useTypedQuery } from '@actiontech/shared';
import { DMS_REDIRECT_KEY_PARAMS_NAME, ROUTE_PATHS } from '@actiontech/dms-kit';

const OAUTH2_LOGIN_URL = '/v1/dms/oauth2/link';

export interface OAuth2LoginFormProps {
  loginTip?: string;
}

const OAuth2LoginForm: React.FC<OAuth2LoginFormProps> = ({ loginTip }) => {
  const { t } = useTranslation();
  const extractQueries = useTypedQuery();

  const oauth2LoginUrl = useMemo(() => {
    const target = extractQueries(ROUTE_PATHS.BASE.LOGIN.index)?.target;
    if (target) {
      return `${OAUTH2_LOGIN_URL}?${DMS_REDIRECT_KEY_PARAMS_NAME}=${encodeURIComponent(
        target
      )}`;
    }
    return OAUTH2_LOGIN_URL;
  }, [extractQueries]);

  return (
    <div className="oauth2-login-form">
      <div className="oauth2-tips">{t('dmsLogin.oauth2Tips')}</div>
      <BasicButton
        className="oauth2-login-btn"
        type="primary"
        href={oauth2LoginUrl}
      >
        {loginTip || t('dmsLogin.useOAuth2Login')}
      </BasicButton>
    </div>
  );
};

export default OAuth2LoginForm;
