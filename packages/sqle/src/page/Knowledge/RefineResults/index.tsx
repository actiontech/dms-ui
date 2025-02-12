import { LeftArrowOutlined } from '@actiontech/icons';
import {
  ActionButton,
  BasicInput,
  PageHeader,
  parse2ReactRouterPath,
  TablePagination,
  useTypedQuery
} from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { useTranslation } from 'react-i18next';
import { ResultWrapperStyleWrapper, SearchWrapperStyleWrapper } from './style';
import { useRequest } from 'ahooks';
import { KnowledgeBaseService } from '@actiontech/shared/lib/api';
import HighlightText from './HighlightText';
import { useEffect, useRef, useState } from 'react';
import { InputRef, List } from 'antd';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const defaultPageSize = 20;
const defaultPageIndex = 1;

const KnowledgeSearchResults: React.FC = () => {
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState('');
  const extractQueries = useTypedQuery();
  const searchInputRef = useRef<InputRef>(null);

  const [pagination, setPagination] = useState<TablePagination>({
    page_index: defaultPageIndex,
    page_size: defaultPageSize
  });
  const {
    data: searchResults,
    run: startSearch,
    loading: isSearching
  } = useRequest(
    (searchText: string, pageIndex: number, pageSize: number) =>
      KnowledgeBaseService.getKnowledgeBaseList({
        keywords: searchText,
        page_index: pageIndex,
        page_size: pageSize
      })
        .then((response) => {
          return response.data;
        })
        .finally(() => {
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 200);
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
    if (params?.keywords) {
      startSearch(params.keywords, defaultPageIndex, defaultPageSize);
    }
  }, [extractQueries, startSearch]);

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
      <SearchWrapperStyleWrapper>
        <BasicInput.TextArea
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
            startSearch(inputValue, 1, pagination.page_size);
          }}
        />
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
                startSearch(searchKeyword, page, pageSize);
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
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default KnowledgeSearchResults;
