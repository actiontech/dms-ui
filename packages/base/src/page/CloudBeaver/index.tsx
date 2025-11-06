import { useRequest } from 'ahooks';
import { Card, Space, Typography, Spin, Dropdown } from 'antd';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
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
import { DownOutlined } from '@ant-design/icons';

const CloudBeaver = () => {
  const { t } = useTranslation();
  const extractQueries = useTypedQuery();
  const [getOperationLogsLoading, setGetOperationLogsLoading] = useState(false);

  const {
    data,
    loading,
    refreshAsync: fetchQueryConfig
  } = useRequest(() => {
    return cloudBeaver.GetSQLQueryConfiguration().then((res) => {
      return res.data.data;
    });
  });

  const handleMenuClick = useCallback(
    async (url: string) => {
      await fetchQueryConfig();
      window.open(url, '_blank');
    },
    [fetchQueryConfig]
  );

  // Auto redirect to CloudBeaver when OPEN_CLOUD_BEAVER_URL_PARAM_NAME is in URL
  useEffect(() => {
    if (
      extractQueries(ROUTE_PATHS.BASE.CLOUD_BEAVER.index)?.open_cloud_beaver ===
        String(true) &&
      !loading &&
      data
    ) {
      let url = '';

      if (data?.enable_sql_query && data.sql_query_root_uri) {
        url = data.sql_query_root_uri;
      } else if (data?.enable_odc_query && data.odc_query_root_uri) {
        url = data.odc_query_root_uri;
      }

      if (url) {
        window.location.href = url;
      }
    }
  }, [extractQueries, loading, data]);

  const renderActionButton = useMemo(() => {
    if (loading) {
      return (
        <BasicButton loading type="primary">
          {t('dmsCloudBeaver.loading')}
        </BasicButton>
      );
    }

    // 构建菜单项
    const menuItems: Array<{ key: string; label: string; url: string }> = [];

    if (data?.enable_sql_query && data?.sql_query_root_uri) {
      menuItems.push({
        key: 'sql_query',
        label: t('dmsCloudBeaver.sqlQuery'),
        url: data.sql_query_root_uri
      });
    }

    if (data?.enable_odc_query && data?.odc_query_root_uri) {
      menuItems.push({
        key: 'odc_query',
        label: t('dmsCloudBeaver.odcQuery'),
        url: data.odc_query_root_uri
      });
    }

    if (menuItems.length === 0) {
      return (
        <BasicButton disabled>
          {t('dmsCloudBeaver.noInstanceAvailable')}
        </BasicButton>
      );
    }

    if (menuItems.length === 1) {
      return (
        <BasicButton
          type="primary"
          onClick={() => handleMenuClick(menuItems[0].url)}
        >
          {t('dmsCloudBeaver.jumpToCloudBeaver')}
        </BasicButton>
      );
    }

    return (
      <Dropdown
        menu={{
          items: menuItems.map((item) => ({
            key: item.key,
            label: item.label,
            onClick: () => handleMenuClick(item.url)
          }))
        }}
        trigger={['click']}
      >
        <BasicButton type="primary" icon={<DownOutlined />}>
          {t('dmsCloudBeaver.jumpToCloudBeaver')}
        </BasicButton>
      </Dropdown>
    );
  }, [data, loading, t, handleMenuClick]);

  // Determine if the main content should be displayed
  const isFeatureEnabled = useMemo(() => {
    const hasSQLQuery = data?.enable_sql_query && data?.sql_query_root_uri;
    const hasODCQuery = data?.enable_odc_query && data?.odc_query_root_uri;
    return hasSQLQuery || hasODCQuery;
  }, [data]);

  return (
    <>
      <PageHeader
        title={t('dmsCloudBeaver.pageTitle')}
        extra={<EmptyBox if={!loading}>{renderActionButton}</EmptyBox>}
      />
      <Spin spinning={getOperationLogsLoading || loading}>
        <EmptyBox if={!isFeatureEnabled && !loading}>
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
