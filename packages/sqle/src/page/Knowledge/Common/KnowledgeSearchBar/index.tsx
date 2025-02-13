import { useTranslation } from 'react-i18next';
import { ArrowRightCircleFilled, DownOutlined } from '@actiontech/icons';
import knowledge_base from '@actiontech/shared/lib/api/sqle/service/knowledge_base';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { Space, Popover, Checkbox } from 'antd';
import {
  BasicInput,
  BasicSwitch,
  BasicTag,
  EmptyBox
} from '@actiontech/shared';
import {
  KnowledgeSearchBarStyleWrapper,
  KnowledgeSearchTagsPopoverStyleWrapper
} from './style';
import useKnowledgeSearchBar from './hooks/useKnowledgeSearchBar';

interface KnowledgeSearchBarProps
  extends Partial<ReturnType<typeof useKnowledgeSearchBar>> {
  onSearch?: (params: {
    searchText: string;
    selectedTags: string[];
    enableGraphMode: boolean;
  }) => void;
  allowGraphMode?: boolean;
}

const KnowledgeSearchBar: React.FC<KnowledgeSearchBarProps> = ({
  onSearch,
  allowGraphMode = true,
  searchText = '',
  selectedTags = [],
  enableGraphMode = false,
  setSearchText,
  setSelectedTags,
  setEnableGraphMode
}) => {
  const { t } = useTranslation();

  const { data: tagOptions } = useRequest(() =>
    knowledge_base.getKnowledgeBaseTagList().then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        return (
          res.data.data?.map((tag) => ({
            label: tag.name,
            value: tag.name
          })) ?? []
        );
      }
      return [];
    })
  );

  const handleSearch = () => {
    onSearch?.({
      searchText,
      selectedTags,
      enableGraphMode
    });
  };

  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags?.(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleChangeEnableGraphMode = (checked: boolean) => {
    setSelectedTags?.([]);
    setSearchText?.('');
    setEnableGraphMode?.(checked);
  };

  return (
    <KnowledgeSearchBarStyleWrapper>
      <Space size={4} wrap className="search-header">
        {selectedTags.map((tag) => (
          <BasicTag
            key={tag}
            closable
            size="small"
            onClose={() => handleTagRemove(tag)}
          >
            {tag}
          </BasicTag>
        ))}
      </Space>

      <BasicInput.TextArea
        value={searchText}
        placeholder={t('knowledgeBase.searchResults.searchPlaceholder')}
        onChange={(e) => setSearchText?.(e.target.value)}
        onPressEnter={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        rows={1}
        bordered={false}
        autoSize
      />

      <Space className="search-footer">
        <Space>
          <EmptyBox if={allowGraphMode}>
            <Space className="switch-control">
              {t('knowledgeBase.search.retrieveKnowledgeGraph')}
              <BasicSwitch
                checked={enableGraphMode}
                onChange={handleChangeEnableGraphMode}
                size="small"
              />
            </Space>
          </EmptyBox>

          <EmptyBox if={!enableGraphMode}>
            <Popover
              trigger="click"
              placement="bottom"
              arrow={false}
              overlayInnerStyle={{
                width: '200px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}
              content={
                <KnowledgeSearchTagsPopoverStyleWrapper
                  value={selectedTags}
                  onChange={(tags) => setSelectedTags?.(tags as string[])}
                >
                  {tagOptions?.map((option) => (
                    <Checkbox key={option.value} value={option.value}>
                      {option.label}
                    </Checkbox>
                  ))}
                </KnowledgeSearchTagsPopoverStyleWrapper>
              }
            >
              <div className="popover-target">
                <span>
                  {t('knowledgeBase.search.selectedTags')}({selectedTags.length}
                  )
                </span>
                <DownOutlined width={20} height={20} />
              </div>
            </Popover>
          </EmptyBox>
        </Space>

        <ArrowRightCircleFilled
          className="pointer"
          width={26}
          height={26}
          onClick={handleSearch}
        />
      </Space>
    </KnowledgeSearchBarStyleWrapper>
  );
};

export default KnowledgeSearchBar;
