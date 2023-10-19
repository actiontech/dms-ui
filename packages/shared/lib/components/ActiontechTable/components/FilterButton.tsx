import { TableFilterButtonProps } from '../index.type';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IconArrowDown, IconArrowUp } from '../../../Icon/common';
import BasicButton from '../../BasicButton';
import { Space } from 'antd5';

const FilterButton = <T extends Record<string, any>>({
  filterButtonMeta = new Map(),
  updateAllSelectedFilterItem,
  disabled
}: TableFilterButtonProps<T>) => {
  const { t } = useTranslation();

  const hasSelectedFilter = useMemo(
    () => Array.from(filterButtonMeta).some(([_, value]) => !!value.checked),
    [filterButtonMeta]
  );

  return (
    <BasicButton
      disabled={disabled}
      size="small"
      className="actiontech-filter-button-namespace"
      onClick={() => updateAllSelectedFilterItem(!hasSelectedFilter)}
      style={{
        padding: '0 6px 0 10px'
      }}
    >
      <Space size={2}>
        {hasSelectedFilter
          ? t('common.actiontechTable.filterButton.clearFilter')
          : t('common.actiontechTable.filterButton.filter')}

        {hasSelectedFilter ? <IconArrowUp /> : <IconArrowDown />}
      </Space>
    </BasicButton>
  );
};

export default FilterButton;
