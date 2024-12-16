import { BasicDrawer, EnterpriseFeatureDisplay } from '@actiontech/shared';
import { useToggle } from 'ahooks';
import { SqlRewrittenDrawerProps } from './index.type';
import { useTranslation } from 'react-i18next';
import SqlRewrittenDrawerEE from './index.ee';
import { Typography } from 'antd';

const SqlRewrittenDrawer: React.FC<SqlRewrittenDrawerProps> = (props) => {
  const { t } = useTranslation();
  const [
    enableStructureOptimize,
    {
      toggle: toggleEnableStructureOptimize,
      set: setEnabledTableStructOptimize
    }
  ] = useToggle(false);

  const handleClose = () => {
    props.onClose();
    setEnabledTableStructOptimize(false);
  };

  return (
    <BasicDrawer
      maskClosable
      onClose={handleClose}
      width={920}
      open={props.open}
      title={t('sqlRewrite.rewriteDetails')}
    >
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
        <SqlRewrittenDrawerEE
          {...props}
          enableStructureOptimize={enableStructureOptimize}
          toggleEnableStructureOptimize={toggleEnableStructureOptimize}
        />
      </EnterpriseFeatureDisplay>
    </BasicDrawer>
  );
};

export default SqlRewrittenDrawer;
