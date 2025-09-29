import { useTranslation } from 'react-i18next';
import { DownOutlined } from '@actiontech/icons';
import knowledge_base from '@actiontech/shared/lib/api/sqle/service/knowledge_base';
import { useRequest, useControllableValue } from 'ahooks';
import { ResponseCode } from '@actiontech/dms-kit';
import { Popover, Checkbox, Empty } from 'antd';
import { BasicInput, BasicTag, EmptyBox } from '@actiontech/dms-kit';
import {
  KnowledgeSearchTagsPopoverStyleWrapper,
  KnowledgeTagSelectorBarStyleWrapper
} from '../style';
import { useMemo, useState } from 'react';
import { TagSelectorBarProps } from '../index.type';
import classNames from 'classnames';
const TagSelectorBar: React.FC<TagSelectorBarProps> = (props) => {
  const { t } = useTranslation();
  const [selectedTags, setSelectedTags] = useControllableValue<
    TagSelectorBarProps['value']
  >(props, {
    defaultValue: []
  });
  const [tagSearchText, setTagSearchText] = useState('');
  const { data: tagOptions } = useRequest(() =>
    knowledge_base.getKnowledgeBaseTagList().then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        return (
          res.data.data?.map((tag) => ({
            label: tag.name,
            value: tag.name,
            hidden: false
          })) ?? []
        );
      }
      return [];
    })
  );
  const handleTagRemove = (tagToRemove: string) => {
    const filteredTags = selectedTags?.filter((tag) => tag !== tagToRemove);
    setSelectedTags?.(filteredTags);
  };
  const filteredTagOptions = useMemo(() => {
    return (
      tagOptions?.map((option) => ({
        ...option,
        hidden: !option.label
          ?.toLowerCase()
          .includes(tagSearchText.toLowerCase())
      })) ?? []
    );
  }, [tagSearchText, tagOptions]);
  return (
    <KnowledgeTagSelectorBarStyleWrapper size={4} wrap>
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
                value={selectedTags}
                onChange={(tags) => {
                  setSelectedTags?.(tags as string[]);
                }}
              >
                {filteredTagOptions.map((option) => (
                  <Checkbox
                    key={option.value}
                    value={option.value}
                    className={classNames({
                      'hidden-checkbox': option.hidden
                    })}
                  >
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
            {t('knowledgeBase.search.selectedTags')}({selectedTags?.length})
          </span>
          <DownOutlined width={20} height={20} />
        </div>
      </Popover>
      {selectedTags?.map((tag) => (
        <BasicTag
          key={tag}
          closable
          size="small"
          onClose={() => handleTagRemove(tag)}
        >
          {tag}
        </BasicTag>
      ))}
    </KnowledgeTagSelectorBarStyleWrapper>
  );
};
export default TagSelectorBar;
