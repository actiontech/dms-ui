import { useTranslation } from 'react-i18next';
import { DownOutlined, SearchOutlined } from '@actiontech/icons';
import knowledge_base from '@actiontech/shared/lib/api/sqle/service/knowledge_base';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { Space, Popover, Checkbox, Empty } from 'antd';
import { BasicInput, BasicTag, EmptyBox } from '@actiontech/shared';
import {
  KnowledgeSearchBarStyleWrapper,
  KnowledgeSearchTagsPopoverStyleWrapper
} from './style';
import useKnowledgeSearchBar from './hooks/useKnowledgeSearchBar';
import { useEffect, useMemo, useState } from 'react';

export interface KnowledgeSearchBarProps
  extends Partial<ReturnType<typeof useKnowledgeSearchBar>> {
  onSearch?: (params: { searchText: string; selectedTags: string[] }) => void;
  allowSelectTag?: boolean;
}

const KnowledgeSearchBar: React.FC<KnowledgeSearchBarProps> = ({
  onSearch,
  searchText = '',
  selectedTags = [],
  setSearchText,
  setSelectedTags,
  allowSelectTag = false
}) => {
  const { t } = useTranslation();

  const [tagSearchText, setTagSearchText] = useState('');

  const [innerSearchText, setInnerSearchText] = useState<string>(searchText);

  const [innerSelectedTags, setInnerSelectedTags] =
    useState<string[]>(selectedTags);

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
      searchText: innerSearchText,
      selectedTags: innerSelectedTags
    });
  };

  const handleTagRemove = (tagToRemove: string) => {
    const filteredTags = innerSelectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags?.(filteredTags);
    setInnerSelectedTags(filteredTags);
  };

  const filteredTagOptions = useMemo(() => {
    return (
      tagOptions?.filter((option) =>
        option.label?.toLowerCase().includes(tagSearchText.toLowerCase())
      ) ?? []
    );
  }, [tagSearchText, tagOptions]);

  useEffect(() => {
    setInnerSearchText(searchText);
  }, [searchText]);

  useEffect(() => {
    setInnerSelectedTags(selectedTags);
  }, [searchText, selectedTags]);

  return (
    <KnowledgeSearchBarStyleWrapper>
      <EmptyBox if={allowSelectTag}>
        <Space size={4} wrap className="search-header">
          <Popover
            trigger="click"
            placement="bottomLeft"
            arrow={false}
            overlayInnerStyle={{
              padding: 0
            }}
            content={
              <KnowledgeSearchTagsPopoverStyleWrapper direction="vertical">
                <BasicInput
                  size="small"
                  value={tagSearchText}
                  placeholder={t('common.search')}
                  onChange={(e) => setTagSearchText(e.target.value)}
                  allowClear
                />
                <EmptyBox
                  if={!!filteredTagOptions?.length}
                  defaultNode={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                >
                  <Checkbox.Group
                    value={innerSelectedTags}
                    onChange={(tags) => {
                      setSelectedTags?.(tags as string[]);
                      setInnerSelectedTags(tags as string[]);
                    }}
                  >
                    {filteredTagOptions.map((option) => (
                      <Checkbox key={option.value} value={option.value}>
                        <span title={option.label}>{option.label}</span>
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </EmptyBox>
              </KnowledgeSearchTagsPopoverStyleWrapper>
            }
          >
            <div className="popover-target">
              <span>
                {t('knowledgeBase.search.selectedTags')}(
                {innerSelectedTags.length})
              </span>
              <DownOutlined width={20} height={20} />
            </div>
          </Popover>
          {innerSelectedTags.map((tag) => (
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
      </EmptyBox>

      <div className="input-wrapper">
        <BasicInput.TextArea
          value={innerSearchText}
          placeholder={t('knowledgeBase.searchResults.searchPlaceholder')}
          onChange={(e) => {
            setSearchText?.(e.target.value);
            setInnerSearchText(e.target.value);
          }}
          onPressEnter={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          rows={1}
          bordered={false}
          autoSize
        />
        <div className="search-icon">
          <SearchOutlined width={20} height={20} onClick={handleSearch} />
        </div>
      </div>
    </KnowledgeSearchBarStyleWrapper>
  );
};

export default KnowledgeSearchBar;
