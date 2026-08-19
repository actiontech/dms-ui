import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { IFilterMeta } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  ActiontechTableFilterButtonMeta,
  ActiontechTableFilterMeta,
  FilterCustomProps,
  TableFilterContainerProps
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { mergeFilterButtonMeta } from '@actiontech/shared/lib/components/ActiontechTable/hooks/useTableFilterContainer';
import useBackendTable from '../../../../hooks/useBackendTable';
import {
  filterTipsToSelectOptions,
  isLazyTipFilter
} from './lazyFilterTips.utils';

type DynamicTableFilterMeta = {
  extraTableFilterMeta: ActiontechTableFilterMeta;
  tableFilterCustomProps: TableFilterContainerProps['filterCustomProps'];
};

type UseLazyFilterTipsParams = {
  projectName: string;
  instanceAuditPlanId: string;
  auditPlanId: string;
};

const useLazyFilterTips = ({
  projectName,
  instanceAuditPlanId,
  auditPlanId
}: UseLazyFilterTipsParams) => {
  const { tableFilterMetaFactory } = useBackendTable();
  const [dynamicTableFilterMeta, setDynamicTableFilterMeta] =
    useState<DynamicTableFilterMeta>();
  const [tipOptionsByFilter, setTipOptionsByFilter] = useState<
    Record<string, ReturnType<typeof filterTipsToSelectOptions>>
  >({});
  const [tipLoadingByFilter, setTipLoadingByFilter] = useState<
    Record<string, boolean>
  >({});
  const loadedTipsRef = useRef(new Set<string>());
  const inflightRef = useRef(new Set<string>());

  const resetLazyTips = useCallback(() => {
    loadedTipsRef.current.clear();
    inflightRef.current.clear();
    setTipOptionsByFilter({});
    setTipLoadingByFilter({});
  }, []);

  const fetchFilterTips = useCallback(
    async (filterName: string) => {
      if (
        !isLazyTipFilter(filterName) ||
        loadedTipsRef.current.has(filterName) ||
        inflightRef.current.has(filterName)
      ) {
        return;
      }
      inflightRef.current.add(filterName);
      setTipLoadingByFilter((prev) => ({ ...prev, [filterName]: true }));
      try {
        const res =
          await instance_audit_plan.getInstanceAuditPlanSQLFilterTipsV1({
            project_name: projectName,
            instance_audit_plan_id: instanceAuditPlanId,
            audit_plan_id: auditPlanId,
            filter_name: filterName
          });
        if (res.data.code === ResponseCode.SUCCESS) {
          const meta = res.data.data?.filter_meta_list?.find(
            (item) => item.filter_name === filterName
          );
          setTipOptionsByFilter((prev) => ({
            ...prev,
            [filterName]: filterTipsToSelectOptions(meta?.filter_tip_list)
          }));
          loadedTipsRef.current.add(filterName);
        }
      } finally {
        inflightRef.current.delete(filterName);
        setTipLoadingByFilter((prev) => ({ ...prev, [filterName]: false }));
      }
    },
    [auditPlanId, instanceAuditPlanId, projectName]
  );

  const buildFilterMetaFromList = useCallback(
    (
      filterMetaList: IFilterMeta[],
      updateFilterButtonMeta: Dispatch<
        SetStateAction<ActiontechTableFilterButtonMeta>
      >
    ) => {
      resetLazyTips();
      const { tableFilterCustomProps, extraTableFilterMeta } =
        tableFilterMetaFactory(filterMetaList, true);
      const enhancedExtraMeta = new Map(extraTableFilterMeta);

      filterMetaList.forEach((meta) => {
        if (!isLazyTipFilter(meta.filter_name) || !meta.filter_name) {
          return;
        }
        const existing = enhancedExtraMeta.get(meta.filter_name);
        if (existing) {
          enhancedExtraMeta.set(meta.filter_name, {
            ...existing,
            filterCustomType: 'select'
          });
        }
      });

      setDynamicTableFilterMeta({
        tableFilterCustomProps,
        extraTableFilterMeta: enhancedExtraMeta
      });
      updateFilterButtonMeta(mergeFilterButtonMeta([], enhancedExtraMeta));
    },
    [resetLazyTips, tableFilterMetaFactory]
  );

  const mergedFilterCustomProps = useMemo(() => {
    if (!dynamicTableFilterMeta?.tableFilterCustomProps) {
      return dynamicTableFilterMeta?.tableFilterCustomProps;
    }
    const map = new Map(dynamicTableFilterMeta.tableFilterCustomProps);
    dynamicTableFilterMeta.extraTableFilterMeta.forEach((_, filterName) => {
      if (!isLazyTipFilter(String(filterName))) {
        return;
      }
      const key = String(filterName);
      map.set(key, {
        ...(map.get(key) ?? {}),
        options: tipOptionsByFilter[key] ?? [],
        loading: !!tipLoadingByFilter[key],
        onDropdownVisibleChange: (open: boolean) => {
          if (open) {
            fetchFilterTips(key);
          }
        }
      } as FilterCustomProps<'select'>);
    });
    return map;
  }, [
    dynamicTableFilterMeta,
    fetchFilterTips,
    tipLoadingByFilter,
    tipOptionsByFilter
  ]);

  const resolvedDynamicTableFilterMeta = useMemo(() => {
    if (!dynamicTableFilterMeta) {
      return undefined;
    }
    return {
      ...dynamicTableFilterMeta,
      tableFilterCustomProps: mergedFilterCustomProps
    };
  }, [dynamicTableFilterMeta, mergedFilterCustomProps]);

  return {
    dynamicTableFilterMeta: resolvedDynamicTableFilterMeta,
    buildFilterMetaFromList
  };
};

export default useLazyFilterTips;
