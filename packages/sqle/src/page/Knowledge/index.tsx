import { PageHeader, useTypedNavigate } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { KnowledgeStyleWrapper } from './style';
import CustomSearch from './Common/CustomSearch';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const Knowledge: React.FC = () => {
  const { t } = useTranslation();

  const navigate = useTypedNavigate();

  const onSearch = (keywords?: string, tag?: string) => {
    navigate(ROUTE_PATHS.SQLE.KNOWLEDGE.refined, {
      queries: { keywords, tag }
    });
  };

  return (
    <>
      <PageHeader title={t('knowledge.pageTitle')} />

      <KnowledgeStyleWrapper>
        <CustomSearch onChange={onSearch} allowPrefixSelect />
      </KnowledgeStyleWrapper>
    </>
  );
};

export default Knowledge;
