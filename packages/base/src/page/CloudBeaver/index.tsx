import { useRequest } from 'ahooks';
import { Card, Space, Typography, Spin } from 'antd';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import cloudBeaver from '@actiontech/shared/lib/api/base/service/CloudBeaver';
import {
  PageHeader,
  EnterpriseFeatureDisplay,
  BasicButton,
  EmptyBox
} from '@actiontech/shared';
import {
  CloudBeaverContentStyleWrapper,
  CloudBeaverContentSpaceStyleWrapper,
  CloudBeaverContentIconStyleWrapper
} from './style';
import { OPEN_CLOUD_BEAVER_URL_PARAM_NAME } from '@actiontech/shared/lib/data/common';
import CBOperationLogsList from './List/index';

const CloudBeaver = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const cloudBeaverUrl = useRef('');

  const { data, loading } = useRequest(() => {
    return cloudBeaver.GetSQLQueryConfiguration().then((res) => {
      if (res?.data.data?.enable_sql_query) {
        cloudBeaverUrl.current = res?.data.data.sql_query_root_uri as string;

        const params = new URLSearchParams(location.search);

        if (params.get(OPEN_CLOUD_BEAVER_URL_PARAM_NAME) === 'true') {
          window.open(cloudBeaverUrl.current);
        }
      }
      return res.data.data;
    });
  });

  const openCloudBeaver = () => {
    window.open(cloudBeaverUrl.current);
  };

  return (
    <>
      <PageHeader
        title={t('dmsCloudBeaver.pageTitle')}
        extra={
          <EmptyBox if={!!data?.enable_sql_query}>
            <BasicButton type="primary" onClick={openCloudBeaver}>
              {t('dmsCloudBeaver.jumpToCloudBeaver')}
            </BasicButton>
          </EmptyBox>
        }
      />
      <EmptyBox if={!data?.enable_sql_query}>
        <CloudBeaverContentStyleWrapper>
          <CloudBeaverContentSpaceStyleWrapper direction="vertical">
            <Card>
              <Spin spinning={loading}>
                <Space>
                  <CloudBeaverContentIconStyleWrapper />
                  <div>
                    {t('dmsCloudBeaver.eeErrorTips')}。
                    {t('dmsCloudBeaver.eeErrorTips2')}
                    <a
                      target="_blank"
                      href="https://actiontech.github.io/sqle-docs-cn/3.modules/4.2_sql_editor/overview.html"
                      rel="noreferrer"
                    >
                      {t('common.clickHere')}
                    </a>
                  </div>
                </Space>
              </Spin>
            </Card>
          </CloudBeaverContentSpaceStyleWrapper>
        </CloudBeaverContentStyleWrapper>
      </EmptyBox>
      <EnterpriseFeatureDisplay
        featureName={t('dmsCloudBeaver.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('dmsCloudBeaver.ceTips')}
          </Typography.Paragraph>
        }
      >
        <CBOperationLogsList enableSqlQuery={data?.enable_sql_query} />
      </EnterpriseFeatureDisplay>
    </>
  );
};

export default CloudBeaver;
