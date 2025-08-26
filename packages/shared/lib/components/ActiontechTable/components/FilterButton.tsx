import { TableFilterButtonProps } from '../index.type';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DownOutlined, UpOutlined } from '@actiontech/icons';
import { ColumnsSettingStyleWrapper } from './style';
import { BasicButton } from '@actiontech/dms-kit';

const FilterButton = <T extends Record<string, any>>({
  filterButtonMeta = new Map(),
  updateAllSelectedFilterItem,
  disabled
}: TableFilterButtonProps<T>) => {
  const { t } = useTranslation();

  const hasSelectedFilter = useMemo(
    () => Array.from(filterButtonMeta).some(([, value]) => !!value.checked),
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
      <ColumnsSettingStyleWrapper size={2} align="center">
        {hasSelectedFilter
          ? t('common.actiontechTable.filterButton.clearFilter')
          : t('common.actiontechTable.filterButton.filter')}

        {hasSelectedFilter ? (
          <UpOutlined color="currentColor" width={14} height={14} />
        ) : (
          <DownOutlined color="currentColor" width={14} height={14} />
        )}
      </ColumnsSettingStyleWrapper>
    </BasicButton>
  );
};

export default FilterButton;
