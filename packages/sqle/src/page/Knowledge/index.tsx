import { PageHeader, useTypedNavigate } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { KnowledgeStyleWrapper } from './style';
import KnowledgeSearchBar from './Common/KnowledgeSearchBar';
import { KnowledgeSearchBarProps } from './Common/KnowledgeSearchBar/index.type';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import KnowledgeGraph from './Graph';
import { KnowledgeService } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const Knowledge: React.FC = () => {
  const { t } = useTranslation();

  const navigate = useTypedNavigate();

  const onSearch: KnowledgeSearchBarProps['onSearch'] = ({ searchText }) => {
    navigate(ROUTE_PATHS.SQLE.KNOWLEDGE.refined, {
      queries: { keywords: searchText }
    });
  };

  const { data: graphData } = useRequest(() =>
    KnowledgeService.getKnowledgeGraph().then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        return {
          edges: res.data.data?.edges ?? [],
          nodes: res.data.data?.nodes ?? []
        };
      }
    })
  );

  return (
    <>
      <PageHeader title={t('knowledgeBase.pageTitle')} />

      <KnowledgeStyleWrapper>
        <KnowledgeSearchBar onSearch={onSearch} />

        <KnowledgeGraph graphData={graphData} />
      </KnowledgeStyleWrapper>
    </>
  );
};

export default Knowledge;
