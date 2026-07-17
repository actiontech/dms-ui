import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BasicToolTips } from '@actiontech/shared';
import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  FilterCustomProps,
  UpdateTableFilterInfoType
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import useTableFilterContainer, {
  mergeFilterButtonMeta
} from '@actiontech/shared/lib/components/ActiontechTable/hooks/useTableFilterContainer';
import {
  ISourceExtra,
  ISqlManage
} from '@actiontech/shared/lib/api/sqle/service/common';
import useBackendTable from '../../../../../hooks/useBackendTable';
import { buildSourceExtraColumns } from '../buildSourceExtraColumns';
import {
  ExtraFilterMeta,
  SqlManagementFilterMetaRecordType,
  SqlManagementTableFilterParamType
} from '../column';
import {
  buildExtraFiltersPayload,
  canApplySourceExtraFilters,
  getSourceExtraFilterNames,
  getSourceExtraHeadList,
  isSourceExtraEnabled,
  joinSourceExtraValuesToList,
  omitSourceExtraFilterKeys,
  resolveSortFieldForRequest
} from '../sourceExtra.utils';
import useGetTableFilterInfo from './useGetTableFilterInfo';

type UseSqlManageSourceExtraParams = {
  baseColumns: ActiontechTableColumn<
    ISqlManage,
    SqlManagementTableFilterParamType
  >;
  tableFilterInfo: SqlManagementTableFilterParamType;
  updateTableFilterInfo: UpdateTableFilterInfoType<SqlManagementTableFilterParamType>;
  filterSource: string | undefined;
};

const useSqlManageSourceExtra = ({
  baseColumns,
  tableFilterInfo,
  updateTableFilterInfo,
  filterSource
}: UseSqlManageSourceExtraParams) => {
  const { t } = useTranslation();
  const [sourceExtra, setSourceExtra] = useState<ISourceExtra | undefined>();
  const prevSourceExtraFilterNamesRef = useRef<string[]>([]);
  const { tableFilterMetaFactory } = useBackendTable();
  const { filterCustomProps: staticFilterCustomProps } =
    useGetTableFilterInfo();

  const sourceExtraActive = canApplySourceExtraFilters(
    sourceExtra,
    filterSource
  );

  const sourceExtraFilterNames = useMemo(
    () => (sourceExtraActive ? getSourceExtraFilterNames(sourceExtra) : []),
    [sourceExtra, sourceExtraActive]
  );

  const sourceExtraHeadList = useMemo(
    () => (sourceExtraActive ? getSourceExtraHeadList(sourceExtra) : []),
    [sourceExtra, sourceExtraActive]
  );

  const columns = useMemo(
    () =>
      [
        ...baseColumns,
        ...buildSourceExtraColumns(sourceExtraHeadList)
      ] as typeof baseColumns,
    [baseColumns, sourceExtraHeadList]
  );

  const staticExtraFilterMeta = useMemo(() => ExtraFilterMeta(), []);

  const dynamicSourceExtraFilterMeta = useMemo(() => {
    if (!sourceExtraActive || !sourceExtra?.filter_meta_list?.length) {
      return undefined;
    }
    return tableFilterMetaFactory(sourceExtra.filter_meta_list, true);
  }, [sourceExtra, sourceExtraActive, tableFilterMetaFactory]);

  const mergedExtraFilterMeta = useMemo((): ActiontechTableFilterMeta<
    SqlManagementFilterMetaRecordType,
    SqlManagementTableFilterParamType
  > => {
    const map = new Map(staticExtraFilterMeta) as ActiontechTableFilterMeta<
      SqlManagementFilterMetaRecordType,
      SqlManagementTableFilterParamType
    >;
    dynamicSourceExtraFilterMeta?.extraTableFilterMeta.forEach((value, key) => {
      const labelText =
        typeof value.filterLabel === 'string' ? value.filterLabel : '';
      map.set(key, {
        ...value,
        filterLabel: (
          <BasicToolTips
            title={t('sqlManagement.table.column.sourceExtraTips')}
          >
            <span className="sql-manage-source-extra-mark">{labelText}</span>
          </BasicToolTips>
        )
      });
    });
    return map;
  }, [staticExtraFilterMeta, dynamicSourceExtraFilterMeta, t]);

  const filterColumns = baseColumns as ActiontechTableColumn<
    SqlManagementFilterMetaRecordType,
    SqlManagementTableFilterParamType
  >;

  const {
    filterButtonMeta,
    filterContainerMeta,
    updateAllSelectedFilterItem,
    updateFilterButtonMeta
  } = useTableFilterContainer<
    SqlManagementFilterMetaRecordType,
    SqlManagementTableFilterParamType
  >(filterColumns, updateTableFilterInfo, mergedExtraFilterMeta);

  const filterCustomProps = useMemo(() => {
    const map = new Map<
      keyof SqlManagementFilterMetaRecordType,
      FilterCustomProps
    >(staticFilterCustomProps);
    dynamicSourceExtraFilterMeta?.tableFilterCustomProps?.forEach(
      (value, key) => {
        map.set(key, value as FilterCustomProps);
      }
    );
    return map;
  }, [staticFilterCustomProps, dynamicSourceExtraFilterMeta]);

  useEffect(() => {
    // source_extra 变化时合并筛选项 meta，但必须保留已展开筛选项的 checked，
    // 否则 mergeFilterButtonMeta 会把静态筛选项重置为 checked:false，导致原有筛选项从容器中消失。
    updateFilterButtonMeta((prev) => {
      const merged = mergeFilterButtonMeta(
        filterColumns,
        mergedExtraFilterMeta
      );
      const next = new Map(merged);
      next.forEach((value, key) => {
        const previous = prev.get(key);
        if (previous) {
          next.set(key, { ...value, checked: previous.checked });
        }
      });
      return next;
    });
  }, [filterColumns, mergedExtraFilterMeta, updateFilterButtonMeta]);

  useEffect(() => {
    const prevNames = prevSourceExtraFilterNamesRef.current;
    const nextNames = sourceExtraFilterNames;
    const removedNames = prevNames.filter((name) => !nextNames.includes(name));
    if (removedNames.length) {
      updateTableFilterInfo(
        omitSourceExtraFilterKeys(
          { ...(tableFilterInfo as Record<string, unknown>) },
          removedNames
        ) as SqlManagementTableFilterParamType
      );
    }
    prevSourceExtraFilterNamesRef.current = nextNames;
    // tableFilterInfo is read once when source-extra filter keys change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceExtraFilterNames, updateTableFilterInfo]);

  const handleSourceExtraFromResponse = useCallback(
    (nextSourceExtra: ISourceExtra | undefined) => {
      setSourceExtra(
        isSourceExtraEnabled(nextSourceExtra) ? nextSourceExtra : undefined
      );
    },
    []
  );

  const buildExtraFiltersForRequest = useCallback(
    (filters: SqlManagementTableFilterParamType) => {
      if (!sourceExtraActive) {
        return undefined;
      }
      const extraFilters = buildExtraFiltersPayload(
        filters as Record<string, unknown>,
        sourceExtraFilterNames
      );
      return extraFilters.length ? JSON.stringify(extraFilters) : undefined;
    },
    [sourceExtraActive, sourceExtraFilterNames]
  );

  const resolveListSortField = useCallback(
    (sortField: string | undefined) =>
      resolveSortFieldForRequest(sortField, sourceExtra, filterSource),
    [sourceExtra, filterSource]
  );

  const joinListData = useCallback(
    (list: ISqlManage[] | undefined) =>
      joinSourceExtraValuesToList(
        list,
        sourceExtraActive ? sourceExtra : undefined
      ),
    [sourceExtra, sourceExtraActive]
  );

  return {
    columns,
    filterButtonMeta,
    filterContainerMeta,
    filterCustomProps,
    updateAllSelectedFilterItem,
    handleSourceExtraFromResponse,
    buildExtraFiltersForRequest,
    resolveListSortField,
    joinListData
  };
};

export default useSqlManageSourceExtra;
