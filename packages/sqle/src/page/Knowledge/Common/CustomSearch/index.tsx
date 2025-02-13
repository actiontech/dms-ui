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
  KnowledgeSearchStyleWrapper,
  KnowledgeSearchPopoverContentStyleWrapper
} from '../../style';
import useSearchState from './useSearchState';

type CustomSearchProps = {
  onSearch?: (
    keywords?: string,
    tags?: string[],
    searchGraph?: boolean
  ) => void;
  allowSearchGraph?: boolean;
} & Partial<ReturnType<typeof useSearchState>>;

const CustomSearch: React.FC<CustomSearchProps> = ({
  onSearch,
  allowSearchGraph = true,
  setKeywords,
  setTags,
  setSearchGraph,
  keywords,
  tags,
  searchGraph
}) => {
  const { t } = useTranslation();

  const { data } = useRequest(() =>
    knowledge_base.getKnowledgeBaseTagList().then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        return res.data.data?.map((i) => ({
          label: i.name,
          value: i.name
        }));
      }
    })
  );

  const onPressEnter = () => {
    onSearch?.(keywords, tags, searchGraph);
  };

  return (
    <KnowledgeSearchStyleWrapper>
      <Space size={4} wrap className="search-header">
        {tags?.map((i) => (
          <BasicTag
            closable
            onClose={() => setTags?.(tags?.filter((j) => j !== i))}
            key={i}
            size="small"
          >
            {i}
          </BasicTag>
        ))}
      </Space>
      <BasicInput.TextArea
        placeholder={t('knowledgeBase.searchResults.searchPlaceholder')}
        onPressEnter={(e) => {
          e.preventDefault();
          onPressEnter();
        }}
        rows={1}
        bordered={false}
        onChange={(e) => setKeywords?.(e.target.value)}
        autoSize
        value={keywords}
      />
      <Space className="search-footer">
        <Space>
          <EmptyBox if={allowSearchGraph}>
            <Space className="switch-control">
              {t('knowledgeBase.search.retrieveKnowledgeGraph')}
              <BasicSwitch
                checked={searchGraph}
                onChange={(v) => setSearchGraph?.(v)}
                size="small"
              />
            </Space>
          </EmptyBox>

          <Popover
            content={
              <KnowledgeSearchPopoverContentStyleWrapper
                onChange={(e) => setTags?.(e as string[])}
                value={tags}
              >
                {data?.map((i) => (
                  <Checkbox key={i.value} value={i.value}>
                    {i.label}
                  </Checkbox>
                ))}
              </KnowledgeSearchPopoverContentStyleWrapper>
            }
            trigger="click"
            placement="bottom"
            arrow={false}
            overlayInnerStyle={{
              width: '200px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            <div className="popover-target">
              <span>
                {t('knowledgeBase.search.selectedTags')}({tags?.length ?? 0})
              </span>
              <DownOutlined width={20} height={20} />
            </div>
          </Popover>
        </Space>
        <ArrowRightCircleFilled
          className="pointer"
          width={26}
          height={26}
          onClick={onPressEnter}
        />
      </Space>
    </KnowledgeSearchStyleWrapper>
  );
};

export default CustomSearch;
