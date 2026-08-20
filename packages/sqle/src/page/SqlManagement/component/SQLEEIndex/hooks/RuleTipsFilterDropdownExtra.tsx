import { Input, Select, Space } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type RuleTipsFilterDropdownExtraProps = {
  menu: ReactElement;
  dbTypeOptions: DefaultOptionType[];
  selectedDbType?: string;
  onDbTypeChange: (dbType?: string) => void;
  ruleLevelFilterOptions: DefaultOptionType[];
  selectedRuleLevel?: string;
  onRuleLevelChange: (level?: string) => void;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
};

const RuleTipsFilterDropdownExtra = ({
  menu,
  dbTypeOptions,
  selectedDbType,
  onDbTypeChange,
  ruleLevelFilterOptions,
  selectedRuleLevel,
  onRuleLevelChange,
  keyword,
  onKeywordChange
}: RuleTipsFilterDropdownExtraProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Space
        direction="vertical"
        size={8}
        style={{ display: 'flex', padding: '8px 12px' }}
        onMouseDown={(event) => event.preventDefault()}
      >
        <Select
          allowClear
          placeholder={t('sqlManagement.table.filter.ruleSelectDbTypeFirst')}
          options={dbTypeOptions}
          value={selectedDbType}
          onChange={(value) => onDbTypeChange(value)}
          style={{ width: '100%' }}
          popupMatchSelectWidth={false}
        />
        <Select
          allowClear
          disabled={!selectedDbType}
          placeholder={t('sqlManagement.table.filter.ruleLevelFilter')}
          options={ruleLevelFilterOptions}
          value={selectedRuleLevel ?? ''}
          onChange={(value) => onRuleLevelChange(value as string | undefined)}
          style={{ width: '100%' }}
          popupMatchSelectWidth={false}
        />
        <Input
          allowClear
          disabled={!selectedDbType}
          placeholder={t('common.search')}
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          data-testid="sql-manage-rule-keyword-filter"
        />
      </Space>
      {menu}
    </>
  );
};

export default RuleTipsFilterDropdownExtra;
