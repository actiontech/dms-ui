import { useRequest } from 'ahooks';
import { Card, Space, Typography, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cloudBeaver from '@actiontech/shared/lib/api/base/service/CloudBeaver';
import {
  PageHeader,
  EnterpriseFeatureDisplay,
  BasicButton,
  EmptyBox,
  useTypedQuery
} from '@actiontech/shared';
import {
  CloudBeaverContentStyleWrapper,
  CloudBeaverContentSpaceStyleWrapper,
  CloudBeaverContentIconStyleWrapper
} from './style';
import CBOperationLogsList from './List/index';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const CloudBeaver = () => {
  const { t } = useTranslation();
  const extractQueries = useTypedQuery();

  const [getOperationLogsLoading, setGetOperationLogsLoading] = useState(false);

  const { data, loading, runAsync } = useRequest(
    () => {
      return cloudBeaver.GetSQLQueryConfiguration().then((res) => {
        return res.data.data;
      });
    },
    {
      manual: true
    }
  );

  useEffect(() => {
    runAsync().then((res) => {
      if (res?.enable_sql_query && res.sql_query_root_uri) {
        const params = extractQueries(ROUTE_PATHS.BASE.CLOUD_BEAVER.index);

        if (params?.open_cloud_beaver === 'true') {
          window.location.href = res.sql_query_root_uri;
        }
      }
    });
  }, [extractQueries, runAsync]);

  const openCloudBeaver = () => {
    runAsync().then((res) => {
      if (res?.enable_sql_query && res.sql_query_root_uri) {
        window.open(res.sql_query_root_uri);
      }
    });
  };

  return (
    <>
      <PageHeader
        title={t('dmsCloudBeaver.pageTitle')}
        extra={
          <EmptyBox if={!!data?.enable_sql_query}>
            <BasicButton
              loading={loading}
              type="primary"
              onClick={openCloudBeaver}
            >
              {t('dmsCloudBeaver.jumpToCloudBeaver')}
            </BasicButton>
          </EmptyBox>
        }
      />
      <Spin spinning={getOperationLogsLoading || loading}>
        <EmptyBox if={!data?.enable_sql_query}>
          <CloudBeaverContentStyleWrapper>
            <CloudBeaverContentSpaceStyleWrapper direction="vertical">
              <Card>
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
          <CBOperationLogsList
            setGetOperationLogsLoading={setGetOperationLogsLoading}
          />
        </EnterpriseFeatureDisplay>
      </Spin>
    </>
  );
};

export default CloudBeaver;
