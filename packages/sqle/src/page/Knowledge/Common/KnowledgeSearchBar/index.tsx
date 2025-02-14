import { useTranslation } from 'react-i18next';
import { SearchOutlined } from '@actiontech/icons';
import { useControllableValue } from 'ahooks';
import { BasicInput, EmptyBox } from '@actiontech/shared';
import { KnowledgeSearchBarStyleWrapper } from './style';
import { KnowledgeSearchBarProps } from './index.type';
import TagSelectorBar from './TagSelectorBar';
import { message } from 'antd';

const KnowledgeSearchBar: React.FC<KnowledgeSearchBarProps> = (props) => {
  const {
    onSearch,
    allowSelectTag = false,
    allowSearchEmptyText = false,
    ...restProps
  } = props;
  const { t } = useTranslation();

  const [searchText, setSearchText] = useControllableValue(restProps, {
    valuePropName: 'searchText',
    trigger: 'setSearchText',
    defaultValue: ''
  });

  const [selectedTags, setSelectedTags] = useControllableValue<
    KnowledgeSearchBarProps['selectedTags']
  >(restProps, {
    valuePropName: 'selectedTags',
    trigger: 'setSelectedTags',
    defaultValue: []
  });

  const [messageApi, contextHolder] = message.useMessage();

  const handleSearch = () => {
    if (!allowSearchEmptyText && !searchText.trim()) {
      messageApi.info(t('knowledgeBase.search.emptySearchTextTips'));
      return;
    }
    onSearch?.({ searchText, selectedTags });
  };

  return (
    <KnowledgeSearchBarStyleWrapper>
      {contextHolder}
      <EmptyBox if={allowSelectTag}>
        <TagSelectorBar onChange={setSelectedTags} value={selectedTags} />
      </EmptyBox>

      <div className="input-wrapper">
        <BasicInput.TextArea
          value={searchText}
          placeholder={t('knowledgeBase.searchResults.searchPlaceholder')}
          onChange={(e) => {
            setSearchText?.(e.target.value);
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
