import { BasicButton, BasicResult } from '@actiontech/shared';
import { IconSuccessResult } from '@actiontech/shared/lib/Icon/common';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CreatedResult: React.FC<{
  createdOrderId: string;
  desc: string;
  hidden: boolean;
  projectID: string;
}> = ({ createdOrderId, hidden, projectID, desc }) => {
  const { t } = useTranslation();
  return (
    <div hidden={hidden}>
      <BasicResult
        icon={<IconSuccessResult />}
        title={t('order.create.success')}
        subTitle={desc}
        extra={[
          <Link
            key="jumpToOrderDetail"
            to={`/sqle/project/${projectID}/order/${createdOrderId}`}
          >
            <BasicButton type="primary">{t('order.create.guide')}</BasicButton>
          </Link>
        ]}
      />
    </div>
  );
};

export default CreatedResult;
