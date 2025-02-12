import { PageHeader, useTypedNavigate } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { KnowledgeStyleWrapper } from './style';
import CustomSearch from './Common/CustomSearch';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import useSearchState from './Common/CustomSearch/useSearchState';

const Knowledge: React.FC = () => {
  const { t } = useTranslation();

  const navigate = useTypedNavigate();

  const { keywords, tags, searchGraph, setKeywords, setTags, setSearchGraph } =
    useSearchState();

  const onSearch = () => {
    if (!searchGraph) {
      navigate(ROUTE_PATHS.SQLE.KNOWLEDGE.refined, {
        queries: { keywords, tags: tags?.join(',') }
      });
    }
  };

  return (
    <>
      <PageHeader title={t('knowledgeBase.pageTitle')} />

      <KnowledgeStyleWrapper>
        <CustomSearch
          onSearch={onSearch}
          searchGraph={searchGraph}
          keywords={keywords}
          tags={tags}
          setKeywords={setKeywords}
          setTags={setTags}
          setSearchGraph={setSearchGraph}
        />
      </KnowledgeStyleWrapper>
    </>
  );
};

export default Knowledge;
