import { BasicDrawer, EnterpriseFeatureDisplay } from '@actiontech/shared';
import { SqlRewrittenDrawerWithBaseProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';

const SqlRewrittenDrawerCE: React.FC<SqlRewrittenDrawerWithBaseProps> = (
  props
) => {
  const { t } = useTranslation();

  return (
    <BasicDrawer {...props}>
      <EnterpriseFeatureDisplay
        isConfigPage
        showTitle={false}
        featureName={t('sqlRewrite.featureName')}
        eeFeatureDescription={
          <Typography.Paragraph className="paragraph">
            {t('sqlRewrite.ceDescription')}
          </Typography.Paragraph>
        }
      >
        <></>
      </EnterpriseFeatureDisplay>
    </BasicDrawer>
  );
};

export default SqlRewrittenDrawerCE;
