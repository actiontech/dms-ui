import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OrderDescStyleWrapper } from './style';
import { tooltipsCommonProps } from '@actiontech/shared/lib/components/BasicToolTips';

const OrderDesc: React.FC<{
  desc: string;
  projectID: string;
  orderID: string;
}> = ({ desc, projectID, orderID }) => {
  const { t } = useTranslation();
  return (
    <OrderDescStyleWrapper
      copyable
      ellipsis={{
        expandable: false,
        tooltip: {
          placement: 'topLeft',
          ...tooltipsCommonProps(
            desc.length > 500 ? (
              <span>
                {`${desc.slice(0, 500)}...`}{' '}
                <Link to={`/sqle/project/${projectID}/order/${orderID}`}>
                  {t('order.create.guide')}
                </Link>
              </span>
            ) : (
              <span>
                {desc}
                {'   '}
                <Link to={`/sqle/project/${projectID}/order/${orderID}`}>
                  {t('order.create.guide')}
                </Link>
              </span>
            ),
            640
          )
        }
      }}
    >
      {desc}
    </OrderDescStyleWrapper>
  );
};

export default OrderDesc;
