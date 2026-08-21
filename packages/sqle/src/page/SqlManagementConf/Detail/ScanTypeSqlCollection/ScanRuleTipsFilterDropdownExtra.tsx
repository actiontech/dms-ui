import { Input, Select, Space } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type ScanRuleTipsFilterDropdownExtraProps = {
  menu: ReactElement;
  ruleLevelFilterOptions: DefaultOptionType[];
  selectedRuleLevel?: string;
  onRuleLevelChange: (level?: string) => void;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
};

/**
 * 扫描详情「审核规则」下拉：任务已是单库型，只做等级 / 关键字前端筛（对齐 F5，无库型选择）。
 */
const ScanRuleTipsFilterDropdownExtra = ({
  menu,
  ruleLevelFilterOptions,
  selectedRuleLevel,
  onRuleLevelChange,
  keyword,
  onKeywordChange
}: ScanRuleTipsFilterDropdownExtraProps) => {
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
          placeholder={t('sqlManagement.table.filter.ruleLevelFilter')}
          options={ruleLevelFilterOptions}
          value={selectedRuleLevel ?? ''}
          onChange={(value) => onRuleLevelChange(value as string | undefined)}
          style={{ width: '100%' }}
          popupMatchSelectWidth={false}
          data-testid="sql-scan-rule-level-filter"
        />
        <Input
          allowClear
          placeholder={t('common.search')}
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          data-testid="sql-scan-rule-keyword-filter"
        />
      </Space>
      {menu}
    </>
  );
};

export default ScanRuleTipsFilterDropdownExtra;
