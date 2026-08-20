import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterCustomProps } from '@actiontech/shared/lib/components/ActiontechTable';
import { UpdateTableFilterInfoType } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import {
  useCurrentProject,
  useProjectBusinessTips
} from '@actiontech/shared/lib/global';
import useInstance from '../../../../../hooks/useInstance';
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

  const clearRuleFilterValue = useCallback(() => {
    if (!updateTableFilterInfo || !tableFilterInfo) {
      return;
    }
    updateTableFilterInfo({
      ...tableFilterInfo,
      filter_rule_name: undefined
    });
  }, [tableFilterInfo, updateTableFilterInfo]);

  const onDbTypeChange = useCallback(
    (dbType?: string) => {
      setSelectedDbType(dbType);
      setSelectedRuleLevel(undefined);
      setRuleKeyword('');
      // 仅在已选规则时清空，避免首次选库型触发筛参更新把下拉关掉
      if (filterRuleName) {
        clearRuleFilterValue();
      }
    },
    [clearRuleFilterValue, filterRuleName]
  );

  const onRuleLevelChange = useCallback((level?: string) => {
    setSelectedRuleLevel(level || undefined);
  }, []);

  const onRuleKeywordChange = useCallback((keyword: string) => {
    setRuleKeyword(keyword);
  }, []);

  const ruleSelectOptions = useMemo(() => {
    if (!selectedDbType) {
      return [];
    }
    const options = generateFlatRuleOptionsByDbType(
      selectedDbType,
      selectedRuleLevel
    );
    const keyword = ruleKeyword.trim().toLowerCase();
    if (!keyword) {
      return options;
    }
    return options.filter((option) => {
      const haystack = `${option.label ?? ''} ${option.text ?? ''} ${
        option.value ?? ''
      }`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [
    generateFlatRuleOptionsByDbType,
    ruleKeyword,
    selectedDbType,
    selectedRuleLevel
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

  const filterCustomProps = useMemo(() => {
    return new Map<keyof ExtraFilterMetaType, FilterCustomProps>([
      [
        'filter_business',
        { options: projectBusinessOption(), loading: getProjectBusinessLoading }
      ],
      [
        'filter_instance_id',
        { options: instanceIDOptions, loading: getInstanceLoading }
      ],
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
          popupMatchSelectWidth: 400,
          notFoundContent: selectedDbType
            ? undefined
            : t('sqlManagement.table.filter.ruleSelectDbTypeFirst'),
          dropdownRender: ruleFilterDropdownRender
        }
      ]
    ]);
  }, [
    projectBusinessOption,
    getProjectBusinessLoading,
    instanceIDOptions,
    getInstanceLoading,
    generateSourceSelectOptions,
    getSourceTipsLoading,
    generateAuditLevelSelectOptions,
    ruleSelectOptions,
    getRuleTipsLoading,
    selectedDbType,
    ruleFilterDropdownRender,
    t
  ]);

  return {
    filterCustomProps
  };
};

export default useGetTableFilterInfo;
