import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Space, Spin } from 'antd';
import { BasicButton, useTypedNavigate, BasicResult } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { SuggestionList } from './style';
import { DmsApi } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();

  const { data: isCloudBeaverPage, loading } = useRequest(() => {
    return DmsApi.CloudBeaverService.GetSQLQueryConfiguration().then((res) => {
      return res.data.data?.sql_query_root_uri === location.pathname;
    });
  });

  const handleBackToHome = () => {
    navigate(ROUTE_PATHS.BASE.HOME);
  };

  return (
    <Spin spinning={loading}>
      <BasicResult
        status="404"
        title={
          isCloudBeaverPage
            ? t('dmsNotFound.cbErrorTitle')
            : t('dmsNotFound.errorTitle')
        }
        extra={
          <Space direction="vertical" size="large" align="center">
            <Space size="middle">
              <BasicButton type="primary" onClick={handleBackToHome}>
                {t('common.backToHome')}
              </BasicButton>
            </Space>

            <Space direction="vertical" size="small">
              <Typography.Text strong>
                {t('dmsNotFound.suggestions')}
              </Typography.Text>
              <SuggestionList>
                <li>{t('dmsNotFound.suggestion1')}</li>
                <li>{t('dmsNotFound.suggestion2')}</li>
                <li>{t('dmsNotFound.suggestion3')}</li>
              </SuggestionList>
            </Space>
          </Space>
        }
      />
    </Spin>
  );
};

export default NotFoundPage;
