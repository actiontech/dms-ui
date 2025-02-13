import { LeftArrowOutlined } from '@actiontech/icons';
import {
  ActionButton,
  PageHeader,
  parse2ReactRouterPath,
  TablePagination,
  useTypedQuery
} from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { useTranslation } from 'react-i18next';
import {
  ResultWrapperStyleWrapper,
  SearchWrapperStyleWrapper,
  SearchContentWrapperStyleWrapper
} from './style';
import { useRequest } from 'ahooks';
import { KnowledgeBaseService } from '@actiontech/shared/lib/api';
import { IGetKnowledgeBaseListParams } from '@actiontech/shared/lib/api/sqle/service/knowledge_base/index.d';
import HighlightText from './HighlightText';
import { useEffect, useState } from 'react';
import { List } from 'antd';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import CustomSearch from '../Common/CustomSearch';
import queryString from 'query-string';
import useSearchState from '../Common/CustomSearch/useSearchState';

const defaultPageSize = 20;
const defaultPageIndex = 1;

const KnowledgeSearchResults: React.FC = () => {
  const { t } = useTranslation();
  const {
    keywords: searchKeyword,
    tags,
    setKeywords,
    setTags
  } = useSearchState();

  const extractQueries = useTypedQuery();
  // const searchInputRef = useRef<InputRef>(null);

  const [pagination, setPagination] = useState<TablePagination>({
    page_index: defaultPageIndex,
    page_size: defaultPageSize
  });
  const {
    data: searchResults,
    run: startSearch,
    loading: isSearching
  } = useRequest(
    ({
      searchText,
      selectedTags,
      pageIndex,
      pageSize
    }: {
      searchText?: string;
      selectedTags?: string[];
      pageIndex: number;
      pageSize: number;
    }) =>
      KnowledgeBaseService.getKnowledgeBaseList(
        {
          keywords: searchText,
          page_index: pageIndex,
          page_size: pageSize,
          tags: selectedTags
        },
        {
          paramsSerializer: (params: IGetKnowledgeBaseListParams) => {
            return queryString.stringify(params, {
              arrayFormat: 'none'
            });
          }
        }
      ).then((response) => {
        return response.data;
      }),
    // .finally(() => {
    //   setTimeout(() => {
    //     searchInputRef.current?.focus();
    //   }, 200);
    // }),
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
      setKeywords(params?.keywords ?? '');
      setTags(params?.tags?.split(',') ?? []);
      startSearch({
        searchText: params?.keywords ?? '',
        selectedTags: params?.tags?.split(',') ?? [],
        pageIndex: defaultPageIndex,
        pageSize: defaultPageSize
      });
    }
  }, [extractQueries, startSearch, setKeywords, setTags]);

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
          <CustomSearch
            onSearch={() => {
              startSearch({
                searchText: searchKeyword,
                selectedTags: tags,
                pageIndex: 1,
                pageSize: pagination.page_size
              });
              setPagination({ page_index: 1, page_size: pagination.page_size });
            }}
            allowSearchGraph={false}
            keywords={searchKeyword}
            tags={tags}
            setKeywords={setKeywords}
            setTags={setTags}
          />
          {/* <BasicInput.TextArea
          autoSize={{ minRows: 2, maxRows: 2 }}
          className="search-input-wrapper"
          ref={searchInputRef}
          disabled={isSearching}
          placeholder={t('knowledgeBase.searchResults.searchPlaceholder')}
          onChange={(event) => {
            const inputValue = event.target.value;
            setSearchKeyword(inputValue);
          }}
          onPressEnter={(event) => {
            const inputValue = event.target.value;
            setPagination({ page_index: 1, page_size: pagination.page_size });
            startSearch({
              searchText: inputValue,
              tags: [],
              pageIndex: 1,
              pageSize: pagination.page_size
            });
          }}
        /> */}
        </SearchWrapperStyleWrapper>

        {searchResults?.data && (
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
                    searchText: searchKeyword,
                    selectedTags: tags,
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
                      navigateToRuleKnowledge(knowledgeItem.title!, 'MySQL');
                    }}
                  >
                    <div className="card-content">
                      <div className="header">
                        <h3 className="title">
                          <HighlightText
                            text={knowledgeItem.title ?? ''}
                            keyword={searchKeyword}
                          />
                        </h3>
                      </div>
                      {knowledgeItem.description && (
                        <div className="description">
                          <HighlightText
                            text={knowledgeItem.description}
                            keyword={searchKeyword}
                          />
                        </div>
                      )}
                      {knowledgeItem.content && (
                        <div className="content">
                          <HighlightText
                            text={knowledgeItem.content}
                            keyword={searchKeyword}
                          />
                        </div>
                      )}
                    </div>
                  </List.Item>
                );
              }}
            />
          </ResultWrapperStyleWrapper>
        )}
      </SearchContentWrapperStyleWrapper>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default KnowledgeSearchResults;
