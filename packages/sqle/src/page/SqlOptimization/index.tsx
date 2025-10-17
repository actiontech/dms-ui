import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { EmptyBox } from '@actiontech/dms-kit';
import SqlOptimizationList from './List';
import { usePermission } from '@actiontech/shared/lib/features';
import { PERMISSIONS } from '@actiontech/shared/lib/features/usePermission/permissions';
import { Alert } from 'antd';
import { SqlOptimizationTipsStyleWrapper } from './style';

const SqlOptimization = () => {
  const { t } = useTranslation();

  const { checkPagePermission } = usePermission();

  return (
    <section>
      <EnterpriseFeatureDisplay
        featureName={t('sqlOptimization.pageTitle')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('sqlOptimization.ceTips')}
          </Typography.Paragraph>
        }
      >
        <EmptyBox
          if={checkPagePermission(PERMISSIONS.PAGES.SQLE.SQL_OPTIMIZATION)}
          defaultNode={
            <SqlOptimizationTipsStyleWrapper>
              <Alert
                message={t('sqlOptimization.noConfiagurationTips')}
                type="info"
                showIcon
              />
            </SqlOptimizationTipsStyleWrapper>
          }
        >
          <SqlOptimizationList />
        </EmptyBox>
      </EnterpriseFeatureDisplay>
    </section>
  );
};
export default SqlOptimization;
