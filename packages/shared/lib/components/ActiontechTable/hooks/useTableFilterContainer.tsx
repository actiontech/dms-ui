import { useCallback, useMemo, useState } from 'react';
import {
  ActiontechTableFilterButtonMeta,
  ActiontechTableFilterContainerMeta,
  ActiontechTableFilterMeta,
  UpdateTableFilterInfoType,
  ActiontechTableColumn,
  TypeFilterElement
} from '../index.type';
import { getColumnsLabel } from '../utils';

export const mergeFilterButtonMeta = <
  T extends Record<string, any>,
  F extends Record<string, any>,
  OtherKeys extends string = ''
>(
  columns: ActiontechTableColumn<T, F, OtherKeys>,
  extraFilterMeta?: ActiontechTableFilterMeta<T, F>
): ActiontechTableFilterButtonMeta<T> => {
  const map: ActiontechTableFilterButtonMeta<T> = new Map();

  columns.reduce((result, cur) => {
    if (cur.filterCustomType) {
      result.set(cur.dataIndex, {
        checked: false,
        filterLabel: cur.filterLabel ?? getColumnsLabel(cur.title),
        filterCustomType: cur.filterCustomType
      });
    }
    return result;
  }, map);

  if (extraFilterMeta) {
    Array.from(extraFilterMeta).reduce<ActiontechTableFilterButtonMeta<T>>(
      (result, [dataIndex, value]) => {
        const { checked, filterLabel, filterCustomType } = value;

        result.set(dataIndex, {
          checked: !!checked,
          filterLabel: filterLabel ?? '',
          filterCustomType: filterCustomType as TypeFilterElement
        });
        return result;
      },
      map
    );
  }

  // #if [DEV]
  if (
    Array.from(map).some(
      ([_, value]) =>
        value.filterLabel === '' && value.filterCustomType !== 'search-input'
    )
  ) {
    throw new Error('Filter label cannot be empty');
  }
  // #endif

  return map;
};

const useTableFilterContainer = <
  T extends Record<string, any>,
  F extends Record<string, any>,
  OtherKeys extends string = ''
>(
  columns: ActiontechTableColumn<T, F, OtherKeys>,
  updateTableFilterInfo: UpdateTableFilterInfoType<F>,
  extraFilterMeta?: ActiontechTableFilterMeta<T, F>
) => {
  const [filterButtonMeta, setFilterButtonMeta] = useState<
    ActiontechTableFilterButtonMeta<T>
  >(mergeFilterButtonMeta(columns, extraFilterMeta));

  const filterContainerMeta = useMemo<
    ActiontechTableFilterContainerMeta<T, F>
  >(() => {
    const checkedFilterMeta = Array.from(filterButtonMeta).filter(
      ([_, value]) => !!value.checked
    );

    const meta: ActiontechTableFilterContainerMeta<T, F> = [];
    Array.from(filterButtonMeta).forEach(([dataIndex, value]) => {
      if (
        checkedFilterMeta.some(
          ([checkedDataIndex]) => checkedDataIndex === dataIndex
        )
      ) {
        const extraMeta = extraFilterMeta?.get(dataIndex);
        const column = columns.find((v) => v.dataIndex === dataIndex);
        meta.push({
          dataIndex,
          filterCustomType:
            column?.filterCustomType ?? extraMeta?.filterCustomType,
          filterKey: column?.filterKey ?? extraMeta?.filterKey,
          filterLabel: value.filterLabel
        });
      }
    });

    // #if [DEV]
    if (meta.some((v) => !v.filterKey)) {
      throw new Error('Filter key cannot be empty');
    }
    // #endif
    return meta;
  }, [columns, extraFilterMeta, filterButtonMeta]);

  const updateAllSelectedFilterItem = useCallback(
    (checked: boolean) => {
      updateTableFilterInfo((_: F) => ({} as F));
      setFilterButtonMeta((meta) => {
        meta.forEach((value, key) => {
          meta.set(key, { ...value, checked });
        });

        return new Map(meta);
      });
    },
    [updateTableFilterInfo]
  );

  return {
    filterButtonMeta,
    filterContainerMeta,
    updateAllSelectedFilterItem,
    updateFilterButtonMeta: setFilterButtonMeta
  };
};

export default useTableFilterContainer;
