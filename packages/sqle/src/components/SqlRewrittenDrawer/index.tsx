import {
  SqlRewrittenDrawerProps,
  SqlRewrittenDrawerWithBaseProps
} from './index.type';
import { useTranslation } from 'react-i18next';
import SqlRewrittenDrawerEE from './index.ee';
import SqlRewrittenDrawerCE from './index.ce';
import { useMedia } from '@actiontech/shared';

const SqlRewrittenDrawer: React.FC<SqlRewrittenDrawerProps> = (props) => {
  const { t } = useTranslation();
  const { isMobile } = useMedia();
  const commonProps: SqlRewrittenDrawerWithBaseProps = {
    ...props,
    width: isMobile ? '23rem' : 920,
    title: t('sqlRewrite.rewriteDetails'),
    maskClosable: false
  };
  return (
    <>
      {/* #if [ee] */}
      <SqlRewrittenDrawerEE {...commonProps} />
      {/* #elif [ce] */}
      <SqlRewrittenDrawerCE {...commonProps} />
      {/* #endif */}
    </>
  );
};

export default SqlRewrittenDrawer;
