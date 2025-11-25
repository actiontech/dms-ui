import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { EmptyBox } from '@actiontech/shared';
import SqlOptimizationList from './List';
import { Alert } from 'antd';
import { SqlOptimizationTipsStyleWrapper } from './style';
import { useCurrentUser } from '@actiontech/shared/lib/global';

const SqlOptimization = () => {
  const { t } = useTranslation();
  const { isSqlOptimizationSupported } = useCurrentUser();

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
          if={isSqlOptimizationSupported}
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
