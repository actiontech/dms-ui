import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import { List } from 'antd';
import BusinessRewrittenDetails from './BusinessRewrittenDetails';
import { useTranslation } from 'react-i18next';
import EmptyContent from '../Common/EmptyContent';

type Props = {
  dataSource: IRewriteSuggestion[];
};

const BusinessRewrittenSuggestion: React.FC<Props> = ({ dataSource }) => {
  const { t } = useTranslation();
  return (
    <List
      dataSource={dataSource}
      renderItem={(item) => {
        return <BusinessRewrittenDetails {...item} />;
      }}
      locale={{
        emptyText: (
          <EmptyContent
            text={t('sqlRewrite.noBusinessLogicOptimizationNeeded')}
          />
        )
      }}
    />
  );
};

export default BusinessRewrittenSuggestion;
