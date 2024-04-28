import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { PageHeader } from '@actiontech/shared';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// #if [ee]
import useSystemModuleStatus from '@actiontech/shared/lib/global/useSystemModuleStatus';
// #endif

const SqlOptimization = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  // #if [ee]
  const { sqlOptimizationIsSupported } = useSystemModuleStatus(true);

  useEffect(() => {
    // 防止无权限时手动输入地址进入页面
    if (!sqlOptimizationIsSupported) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endif

  return (
    <section>
      {/* #if [ce] */}
      <PageHeader title={t('sqlOptimization.pageTitle')} />
      {/* #endif */}
      <EnterpriseFeatureDisplay
        featureName={t('sqlOptimization.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('sqlOptimization.ceTips')}
          </Typography.Paragraph>
        }
      >
        <Outlet />
      </EnterpriseFeatureDisplay>
    </section>
  );
};

export default SqlOptimization;
