import { useTranslation } from 'react-i18next';
import { SearchOutlined } from '@actiontech/icons';
import knowledge_base from '@actiontech/shared/lib/api/sqle/service/knowledge_base';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { AutoComplete, Space } from 'antd';
import { BasicInput, BasicSelect, EmptyBox } from '@actiontech/shared';
import { useState } from 'react';

type CustomSearchProps = {
  onChange?: (keywords?: string, tag?: string) => void;
  showTag?: boolean;
  allowPrefixSelect?: boolean;
  onPrefixChange?: (prefix?: string) => void;
};

const CustomSearch: React.FC<CustomSearchProps> = ({
  onChange,
  showTag,
  allowPrefixSelect,
  onPrefixChange
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>();
  const [keywords, setKeywords] = useState<string>();

  const [tag, setTag] = useState<string>();

  const { data } = useRequest(
    () =>
      knowledge_base.getKnowledgeBaseTagList().then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data?.map((i) => ({
            label: i.name,
            value: i.name
          }));
        }
      }),
    {
      manual: !showTag
    }
  );

  return (
    <Space.Compact className="full-width-element">
      <EmptyBox if={allowPrefixSelect}>
        <BasicSelect onChange={onPrefixChange} />
      </EmptyBox>
      <AutoComplete
        options={
          data ?? [
            {
              label: 'test1',
              value: 'test1'
            },
            {
              label: 'test222',
              value: 'test222'
            }
          ]
        }
        className="full-width-element"
        onSelect={(v) => {
          setValue(v);
          setKeywords(undefined);
          setTag(v);
          onChange?.(undefined, v);
        }}
        open={showTag}
        value={value}
        onSearch={(v) => {
          setValue(v);
          setKeywords(v);
          setTag(undefined);
        }}
      >
        <BasicInput
          size="large"
          placeholder={t('knowledge.searchPlaceholder')}
          onPressEnter={() => {
            onChange?.(keywords, tag);
          }}
          suffix={
            <SearchOutlined
              className="pointer"
              onClick={() => onChange?.(keywords, tag)}
            />
          }
        />
      </AutoComplete>
    </Space.Compact>
  );
};

export default CustomSearch;
