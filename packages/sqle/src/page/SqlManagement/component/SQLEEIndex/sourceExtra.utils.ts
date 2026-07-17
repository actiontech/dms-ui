import {
  IFilter,
  ISourceExtra,
  ISourceExtraHead,
  ISqlManage
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  isSqlManageClassicSortField,
  SQL_MANAGE_STATIC_FILTER_KEYS
} from './sourceExtra.data';

export const isSourceExtraEnabled = (
  sourceExtra: ISourceExtra | undefined | null
): boolean => sourceExtra?.enabled === true;

export const getSourceExtraFilterNames = (
  sourceExtra: ISourceExtra | undefined | null
): string[] =>
  (sourceExtra?.filter_meta_list ?? [])
    .map((meta) => meta.filter_name)
    .filter((name): name is string => !!name);

export const canApplySourceExtraFilters = (
  sourceExtra: ISourceExtra | undefined | null,
  filterSource: string | undefined
): boolean =>
  isSourceExtraEnabled(sourceExtra) &&
  !!filterSource &&
  sourceExtra?.source === filterSource;

export const buildExtraFiltersPayload = (
  tableFilterInfo: Record<string, unknown>,
  sourceExtraFilterNames: string[]
): IFilter[] => {
  const nameSet = new Set(sourceExtraFilterNames);
  const filters: IFilter[] = [];

  nameSet.forEach((filterName) => {
    const value = tableFilterInfo[filterName];
    if (value === undefined || value === null || value === '') {
      return;
    }
    if (Array.isArray(value)) {
      const [from, to] = value;
      if (!from && !to) {
        return;
      }
      filters.push({
        filter_name: filterName,
        filter_between_value: {
          from: from ? String(from) : '',
          to: to ? String(to) : ''
        }
      });
      return;
    }
    filters.push({
      filter_name: filterName,
      filter_compare_value: String(value)
    });
  });

  return filters;
};

export const omitSourceExtraFilterKeys = <T extends Record<string, unknown>>(
  tableFilterInfo: T,
  sourceExtraFilterNames: string[]
): T => {
  if (!sourceExtraFilterNames.length) {
    return tableFilterInfo;
  }
  const nameSet = new Set(sourceExtraFilterNames);
  const next = { ...tableFilterInfo };
  nameSet.forEach((name) => {
    delete next[name];
  });
  return next;
};

export const pickStaticSqlManageFilters = (
  tableFilterInfo: Record<string, unknown>
): Record<string, unknown> => {
  const staticKeySet = new Set<string>(SQL_MANAGE_STATIC_FILTER_KEYS);
  return Object.keys(tableFilterInfo).reduce<Record<string, unknown>>(
    (acc, key) => {
      if (staticKeySet.has(key)) {
        acc[key] = tableFilterInfo[key];
      }
      return acc;
    },
    {}
  );
};

export const resolveSortFieldForRequest = (
  sortField: string | undefined,
  sourceExtra: ISourceExtra | undefined | null,
  filterSource: string | undefined
): string | undefined => {
  if (!sortField) {
    return undefined;
  }
  if (isSqlManageClassicSortField(sortField)) {
    return sortField;
  }
  if (!canApplySourceExtraFilters(sourceExtra, filterSource)) {
    return undefined;
  }
  const sortableNames = new Set(
    (sourceExtra?.head ?? [])
      .filter((head) => head.sortable && head.name)
      .map((head) => head.name as string)
  );
  return sortableNames.has(sortField) ? sortField : undefined;
};

export const joinSourceExtraValuesToList = (
  list: ISqlManage[] | undefined,
  sourceExtra: ISourceExtra | undefined | null
): ISqlManage[] => {
  if (!list?.length || !isSourceExtraEnabled(sourceExtra)) {
    return list ?? [];
  }
  const valueMap = new Map<number, Record<string, string>>();
  (sourceExtra?.rows ?? []).forEach((row) => {
    if (typeof row.id === 'number') {
      valueMap.set(row.id, row.values ?? {});
    }
  });
  const headNameSet = new Set(
    (sourceExtra?.head ?? [])
      .map((head) => head.name)
      .filter((name): name is string => !!name)
  );

  return list.map((item) => {
    if (typeof item.id !== 'number') {
      return item;
    }
    const values = valueMap.get(item.id);
    if (!values) {
      return item;
    }
    const whitelistedValues = Object.fromEntries(
      Object.entries(values).filter(([key]) => headNameSet.has(key))
    );
    if (!Object.keys(whitelistedValues).length) {
      return item;
    }
    return {
      ...item,
      ...whitelistedValues
    };
  });
};

export const getSourceExtraHeadList = (
  sourceExtra: ISourceExtra | undefined | null
): ISourceExtraHead[] => {
  if (!isSourceExtraEnabled(sourceExtra)) {
    return [];
  }
  return (sourceExtra?.head ?? []).filter((head) => !!head.name);
};
