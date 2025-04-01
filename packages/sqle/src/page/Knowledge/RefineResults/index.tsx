import { LeftArrowOutlined } from '@actiontech/icons';
import {
  ActionButton,
  PageHeader,
  parse2ReactRouterPath,
  TablePagination,
  useTypedQuery,
  paramsSerializer
} from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { useTranslation } from 'react-i18next';
import {
  ResultWrapperStyleWrapper,
  SearchWrapperStyleWrapper,
  SearchContentWrapperStyleWrapper
} from './style';
import { useRequest } from 'ahooks';
import { SqleApi } from '@actiontech/shared/lib/api';
import { IGetKnowledgeBaseListParams } from '@actiontech/shared/lib/api/sqle/service/knowledge_base/index.d';
import HighlightText from './HighlightText';
import { useEffect, useState } from 'react';
import { List } from 'antd';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import useKnowledgeSearchBar from '../Common/KnowledgeSearchBar/hooks/useKnowledgeSearchBar';
import KnowledgeSearchBar from '../Common/KnowledgeSearchBar';

const defaultPageSize = 20;
const defaultPageIndex = 1;

const KnowledgeSearchResults: React.FC = () => {
  const { t } = useTranslation();
  const { searchText, selectedTags, setSearchText, setSelectedTags } =
    useKnowledgeSearchBar();

  const extractQueries = useTypedQuery();

  const [pagination, setPagination] = useState<TablePagination>({
    page_index: defaultPageIndex,
    page_size: defaultPageSize
  });
  const {
    data: searchResults,
    run: startSearch,
    loading: isSearching
  } = useRequest(
    (params: {
      searchText?: string;
      selectedTags?: string[];
      pageIndex: number;
      pageSize: number;
    }) =>
      SqleApi.KnowledgeBaseService.getKnowledgeBaseList(
        {
          keywords: params.searchText,
          page_index: params.pageIndex,
          page_size: params.pageSize,
          tags: params.selectedTags
        },
        {
          paramsSerializer: paramsSerializer<IGetKnowledgeBaseListParams>
        }
      ).then((response) => {
        return response.data;
      }),
    {
      manual: true
    }
  );

  const navigateToRuleKnowledge = (ruleName: string, dbType: string) => {
    window.open(
      parse2ReactRouterPath(ROUTE_PATHS.SQLE.RULE_KNOWLEDGE.index, {
        params: {
          ruleName: ruleName,
          dbType: dbType
        }
      })
    );
  };

  useEffect(() => {
    const params = extractQueries(ROUTE_PATHS.SQLE.KNOWLEDGE.refined);
    if (params?.keywords || params?.tags) {
      setSearchText(params?.keywords ?? '');
      setSelectedTags(params?.tags?.split(',') ?? []);
      startSearch({
        searchText: params?.keywords ?? '',
        selectedTags: params?.tags?.split(',') ?? [],
        pageIndex: defaultPageIndex,
        pageSize: defaultPageSize
      });
    }
  }, [extractQueries, startSearch, setSearchText, setSelectedTags]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed
        title={
          <ActionButton
            text={t('knowledgeBase.searchResults.backToKnowledgeBase')}
            icon={<LeftArrowOutlined />}
            actionType="navigate-link"
            link={{ to: ROUTE_PATHS.SQLE.KNOWLEDGE.index }}
          />
        }
      />
      <SearchContentWrapperStyleWrapper>
        <SearchWrapperStyleWrapper>
          <KnowledgeSearchBar
            onSearch={() => {
              startSearch({
                searchText: searchText,
                selectedTags: selectedTags,
                pageIndex: 1,
                pageSize: pagination.page_size
              });
              setPagination({
                page_index: 1,
                page_size: pagination.page_size
              });
            }}
            searchText={searchText}
            selectedTags={selectedTags}
            setSearchText={setSearchText}
            setSelectedTags={setSelectedTags}
            allowSelectTag
            allowSearchEmptyText
          />
        </SearchWrapperStyleWrapper>

        <ResultWrapperStyleWrapper>
          <List
            pagination={{
              showSizeChanger: true,
              defaultPageSize: 20,
              total: searchResults?.total_nums,
              pageSize: pagination.page_size,
              current: pagination.page_index,
              showTotal: (total) => (
                <span>
                  {t('common.actiontechTable.pagination.total', {
                    total
                  })}
                </span>
              ),
              onChange: (page, pageSize) => {
                startSearch({
                  searchText,
                  selectedTags,
                  pageIndex: page,
                  pageSize
                });
                setPagination({
                  page_index: page,
                  page_size: pageSize
                });
              }
            }}
            dataSource={searchResults?.data}
            split={true}
            size="large"
            itemLayout="vertical"
            loading={isSearching}
            renderItem={(knowledgeItem) => {
              return (
                <List.Item
                  key={knowledgeItem.id}
                  className="result-card"
                  onClick={() => {
                    navigateToRuleKnowledge(
                      knowledgeItem.rule_name ?? '',
                      knowledgeItem.tags?.find((tag) => tag.name === 'DBType')
                        ?.sub_tags?.[0].name ?? ''
                    );
                  }}
                >
                  <div className="card-content">
                    <div className="header">
                      <h3 className="title">
                        <HighlightText
                          text={knowledgeItem.title ?? ''}
                          keyword={searchText}
                        />
                      </h3>
                    </div>
                    {knowledgeItem.description && (
                      <div className="description">
                        <HighlightText
                          text={knowledgeItem.description}
                          keyword={searchText}
                        />
                      </div>
                    )}
                    {knowledgeItem.content && (
                      <div className="content">
                        <HighlightText
                          text={knowledgeItem.content}
                          keyword={searchText}
                        />
                      </div>
                    )}
                  </div>
                </List.Item>
              );
            }}
          />
        </ResultWrapperStyleWrapper>
      </SearchContentWrapperStyleWrapper>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default KnowledgeSearchResults;
