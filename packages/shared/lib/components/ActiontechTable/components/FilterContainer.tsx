import { ConfigProvider } from 'antd';
import { FilterCustomProps, TableFilterContainerProps } from '../index.type';
import useCustomFilter from '../hooks/useCustomFilter';
import { FilterContainerStyleWrapper } from './style';
import classNames from 'classnames';

const FilterContainer = <
  T extends Record<string, any>,
  F extends Record<string, any>
>({
  filterContainerMeta = [],
  updateTableFilterInfo,
  filterCustomProps,
  style,
  className
}: TableFilterContainerProps<T, F>) => {
  const {
    generateSelectFilter,
    generateDataRangeFilter,
    generateInputFilter,
    generateSearchInputFilter
  } = useCustomFilter();

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 13
        }
      }}
    >
      <FilterContainerStyleWrapper
        size={12}
        align="center"
        className={classNames(
          className,
          'actiontech-table-filter-container-namespace full-width-element'
        )}
        wrap
        hidden={filterContainerMeta.length === 0}
        style={style}
      >
        {filterContainerMeta.map((value) => {
          if (value.filterCustomType === 'select') {
            return generateSelectFilter(
              value,
              updateTableFilterInfo,
              (filterCustomProps as Map<
                keyof T,
                FilterCustomProps<'select'>
              >) ?? new Map()
            );
          }

          if (value.filterCustomType === 'date-range') {
            return generateDataRangeFilter(
              value,
              updateTableFilterInfo,
              (filterCustomProps as Map<
                keyof T,
                FilterCustomProps<'date-range'>
              >) ?? new Map()
            );
          }

          if (value.filterCustomType === 'input') {
            return generateInputFilter(
              value,
              updateTableFilterInfo,
              (filterCustomProps as Map<keyof T, FilterCustomProps<'input'>>) ??
                new Map()
            );
          }

          if (value.filterCustomType === 'search-input') {
            return generateSearchInputFilter(
              value,
              updateTableFilterInfo,
              (filterCustomProps as Map<
                keyof T,
                FilterCustomProps<'search-input'>
              >) ?? new Map()
            );
          }

          return null;
        })}
      </FilterContainerStyleWrapper>
    </ConfigProvider>
  );
};

export default FilterContainer;
