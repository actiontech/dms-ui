import { PageHeader, useTypedNavigate } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { KnowledgeStyleWrapper } from './style';
import KnowledgeSearchBar, {
  KnowledgeSearchBarProps
} from './Common/KnowledgeSearchBar';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import KnowledgeGraph from './Graph';
import { Divider } from 'antd';
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

  const { loading, data: graphData } = useRequest(() =>
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
        <Divider orientation="center">知识库搜索</Divider>

        <KnowledgeSearchBar onSearch={onSearch} />

        <Divider orientation="center">知识图谱</Divider>

        <KnowledgeGraph graphData={graphData} />
      </KnowledgeStyleWrapper>
    </>
  );
};

export default Knowledge;
