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
  const { filterRuleName } = params ?? {};

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
  const [ruleDropdownOpen, setRuleDropdownOpen] = useState(false);

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

  const ruleSelectOptions = useMemo(() => {
    const options = generateFlatRuleOptionsByDbType(
      selectedDbType,
      selectedRuleLevel
    );
    const keyword = ruleKeyword.trim().toLowerCase();
    if (!keyword) {
      return options;
    }
    return options.filter((option) => {
      const haystack = `${option.text ?? ''} ${
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
    filterCustomProps
  };
};

export default useGetTableFilterInfo;
