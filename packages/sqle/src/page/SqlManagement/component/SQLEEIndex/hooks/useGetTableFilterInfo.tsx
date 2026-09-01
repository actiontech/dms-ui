import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterCustomProps } from '@actiontech/shared/lib/components/ActiontechTable';
import {
  TypeFilterElement,
  UpdateTableFilterInfoType
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import {
  useCurrentProject,
  useProjectBusinessTips
} from '@actiontech/shared/lib/global';
import useInstance from '../../../../../hooks/useInstance';
import useInstanceSchema from '../../../../../hooks/useInstanceSchema';
import useRuleTips, {
  extractDbTypeFromRuleSelectValue
} from '../../../../../hooks/useRuleTips';
import {
  ExtraFilterMetaType,
  SqlManagementTableFilterParamType
} from '../column';
import useSourceTips from './useSourceTips';
import useStaticStatus from './useStaticStatus';
import RuleTipsFilterDropdownExtra from './RuleTipsFilterDropdownExtra';
import { PARSE_FAILED_RULE_SELECT_VALUE } from '../index.data';
import { AuditLevelRuleOptionLabel } from '../../../../../components/AuditResultMessage/AuditLevelIcon';

type UseGetTableFilterInfoParams = {
  filterRuleName?: string;
  tableFilterInfo?: SqlManagementTableFilterParamType;
  updateTableFilterInfo?: UpdateTableFilterInfoType<SqlManagementTableFilterParamType>;
};

const useGetTableFilterInfo = (params?: UseGetTableFilterInfoParams) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const { filterRuleName, tableFilterInfo, updateTableFilterInfo } =
    params ?? {};

  const { generateAuditLevelSelectOptions } = useStaticStatus();

  const { generateSourceSelectOptions, loading: getSourceTipsLoading } =
    useSourceTips();

  const {
    instanceIDOptions,
    instanceList,
    updateInstanceList,
    loading: getInstanceLoading
  } = useInstance();

  const {
    updateProjectBusinessTips,
    projectBusinessOption,
    loading: getProjectBusinessLoading
  } = useProjectBusinessTips();

  const {
    generateFlatRuleOptionsByDbType,
    dbTypeOptions,
    updateRuleTips,
    loading: getRuleTipsLoading
  } = useRuleTips();

  const [selectedDbType, setSelectedDbType] = useState<string | undefined>();
  const [selectedRuleLevel, setSelectedRuleLevel] = useState<
    string | undefined
  >();
  const [ruleKeyword, setRuleKeyword] = useState('');
  const [ruleDropdownOpen, setRuleDropdownOpen] = useState(false);

  const filterInstanceId = tableFilterInfo?.filter_instance_id as
    | string
    | undefined;

  const selectedInstance = useMemo(
    () =>
      instanceList.find(
        (item) => String(item.instance_id) === String(filterInstanceId ?? '')
      ),
    [filterInstanceId, instanceList]
  );

  // 开关只看是否选中数据源；禁止按库型 / MySQL 白名单分支（TDSQL 等须同样下拉）
  const isSchemaSelectMode = !!selectedInstance;

  const schemaFilterCustomType: TypeFilterElement = isSchemaSelectMode
    ? 'select'
    : 'input';

  const {
    schemaList,
    loading: getSchemaLoading,
    updateSchemaList
  } = useInstanceSchema(projectName, selectedInstance?.instance_name, {
    autoFetch: false
  });

  const prevFilterInstanceIdRef = useRef(filterInstanceId);

  const clearSchemaFilterValue = useCallback(() => {
    if (!updateTableFilterInfo) {
      return;
    }
    // useTableRequestParams 会先无参调用 updater 做浅比较，再交给 setState；
    // 故无参时必须安全返回，真正清空依赖 React setState 传入的 prev。
    const updater = (
      prev?: SqlManagementTableFilterParamType
    ): SqlManagementTableFilterParamType => {
      if (!prev) {
        return {} as SqlManagementTableFilterParamType;
      }
      if (prev.filter_schema_name === undefined) {
        return prev;
      }
      return {
        ...prev,
        filter_schema_name: undefined
      };
    };
    updateTableFilterInfo(
      updater as unknown as SqlManagementTableFilterParamType
    );
  }, [updateTableFilterInfo]);

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
    updateRuleTips(projectName);
    updateProjectBusinessTips();
  }, [
    projectName,
    updateInstanceList,
    updateProjectBusinessTips,
    updateRuleTips
  ]);

  useEffect(() => {
    if (!filterRuleName) {
      return;
    }
    const dbTypeFromValue = extractDbTypeFromRuleSelectValue(filterRuleName);
    if (dbTypeFromValue) {
      setSelectedDbType(dbTypeFromValue);
    }
  }, [filterRuleName]);

  useEffect(() => {
    const prev = prevFilterInstanceIdRef.current;
    if (prev === filterInstanceId) {
      return;
    }
    prevFilterInstanceIdRef.current = filterInstanceId;
    clearSchemaFilterValue();
  }, [clearSchemaFilterValue, filterInstanceId]);

  const onDbTypeChange = useCallback((dbType?: string) => {
    // 仅筛选下拉选项，不改 tableFilterInfo，避免关闭外层「审核规则」面板
    setSelectedDbType(dbType);
    setRuleDropdownOpen(true);
  }, []);

  const onRuleLevelChange = useCallback((level?: string) => {
    setSelectedRuleLevel(level || undefined);
    setRuleDropdownOpen(true);
  }, []);

  const onRuleKeywordChange = useCallback((keyword: string) => {
    setRuleKeyword(keyword);
    setRuleDropdownOpen(true);
  }, []);

  const onRuleDropdownVisibleChange = useCallback((open: boolean) => {
    setRuleDropdownOpen(open);
  }, []);

  const onSchemaDropdownVisibleChange = useCallback(
    (open: boolean) => {
      if (open && isSchemaSelectMode) {
        updateSchemaList();
      }
    },
    [isSchemaSelectMode, updateSchemaList]
  );

  const onInstanceFilterChange = useCallback(() => {
    // Select 内部随后写入 filter_instance_id；下一 macrotask 再清 Schema，保证读到新 instance
    setTimeout(() => {
      clearSchemaFilterValue();
    }, 0);
  }, [clearSchemaFilterValue]);

  const ruleSelectOptions = useMemo(() => {
    const parseFailedText = t('sqlManagement.table.filter.parseFailed');
    const parseFailedOption = {
      label: <AuditLevelRuleOptionLabel level="warn" text={parseFailedText} />,
      text: `${parseFailedText} warn`,
      value: PARSE_FAILED_RULE_SELECT_VALUE
    };
    const options = generateFlatRuleOptionsByDbType(
      selectedDbType,
      selectedRuleLevel
    );
    const keyword = ruleKeyword.trim().toLowerCase();
    const filtered = !keyword
      ? options
      : options.filter((option) => {
          const haystack = `${option.text ?? ''} ${
            option.value ?? ''
          }`.toLowerCase();
          return haystack.includes(keyword);
        });
    // 固定项置顶，不依赖 rule_tips / 库型 / 关键词
    return [parseFailedOption, ...filtered];
  }, [
    generateFlatRuleOptionsByDbType,
    ruleKeyword,
    selectedDbType,
    selectedRuleLevel,
    t
  ]);

  const ruleLevelFilterOptions = useMemo(() => {
    return [
      {
        label: t('sqlManagement.table.filter.ruleLevelAll'),
        value: ''
      },
      ...generateAuditLevelSelectOptions
    ];
  }, [generateAuditLevelSelectOptions, t]);

  const ruleFilterDropdownRender = useCallback(
    (menu: ReactElement) => (
      <RuleTipsFilterDropdownExtra
        menu={menu}
        dbTypeOptions={dbTypeOptions}
        selectedDbType={selectedDbType}
        onDbTypeChange={onDbTypeChange}
        ruleLevelFilterOptions={ruleLevelFilterOptions}
        selectedRuleLevel={selectedRuleLevel}
        onRuleLevelChange={onRuleLevelChange}
        keyword={ruleKeyword}
        onKeywordChange={onRuleKeywordChange}
      />
    ),
    [
      dbTypeOptions,
      onDbTypeChange,
      onRuleKeywordChange,
      onRuleLevelChange,
      ruleKeyword,
      ruleLevelFilterOptions,
      selectedDbType,
      selectedRuleLevel
    ]
  );

  const schemaSelectOptions = useMemo(
    () =>
      schemaList.map((schema) => ({
        label: schema,
        value: schema
      })),
    [schemaList]
  );

  const filterCustomProps = useMemo(() => {
    const schemaProps: FilterCustomProps = isSchemaSelectMode
      ? {
          options: schemaSelectOptions,
          loading: getSchemaLoading,
          allowClear: true,
          onDropdownVisibleChange: onSchemaDropdownVisibleChange
        }
      : {};

    return new Map<keyof ExtraFilterMetaType, FilterCustomProps>([
      [
        'filter_business',
        { options: projectBusinessOption(), loading: getProjectBusinessLoading }
      ],
      [
        'filter_instance_id',
        {
          options: instanceIDOptions,
          loading: getInstanceLoading,
          onChange: onInstanceFilterChange
        }
      ],
      ['filter_schema_name', schemaProps],
      [
        'filter_source',
        { options: generateSourceSelectOptions, loading: getSourceTipsLoading }
      ],
      ['filter_audit_level', { options: generateAuditLevelSelectOptions }],
      ['time', { showTime: true }],
      [
        'filter_rule_name',
        {
          options: ruleSelectOptions,
          loading: getRuleTipsLoading,
          allowClear: true,
          popupMatchSelectWidth: 400,
          open: ruleDropdownOpen,
          onDropdownVisibleChange: onRuleDropdownVisibleChange,
          dropdownRender: ruleFilterDropdownRender
        }
      ]
    ]);
  }, [
    projectBusinessOption,
    getProjectBusinessLoading,
    instanceIDOptions,
    getInstanceLoading,
    onInstanceFilterChange,
    isSchemaSelectMode,
    schemaSelectOptions,
    getSchemaLoading,
    onSchemaDropdownVisibleChange,
    generateSourceSelectOptions,
    getSourceTipsLoading,
    generateAuditLevelSelectOptions,
    ruleSelectOptions,
    getRuleTipsLoading,
    ruleDropdownOpen,
    onRuleDropdownVisibleChange,
    ruleFilterDropdownRender
  ]);

  return {
    filterCustomProps,
    schemaFilterCustomType
  };
};

export default useGetTableFilterInfo;
