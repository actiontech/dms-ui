import { useMemo, useState } from 'react';
import {
  useTableFilterContainer,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue,
  TableFilterContainerProps,
  FilterCustomProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useTranslation } from 'react-i18next';

export type GetTemplateRuleParams = {
  fuzzy_keyword_rule?: string;
};

const useRuleDetailFilter = () => {
  const { t } = useTranslation();

  const [fuzzyKeyword, setFuzzyKeyword] = useState<string>();

  const { updateTableFilterInfo } = useTableRequestParams<
    GetTemplateRuleParams,
    GetTemplateRuleParams
  >();

  const RuleFilterContainerMeta: () => ActiontechTableFilterMeta<
    GetTemplateRuleParams,
    GetTemplateRuleParams
  > = () => {
    return new Map<
      keyof GetTemplateRuleParams,
      ActiontechTableFilterMetaValue<GetTemplateRuleParams>
    >([
      [
        'fuzzy_keyword_rule',
        {
          filterCustomType: 'search-input',
          filterKey: 'fuzzy_keyword_rule',
          checked: true
        }
      ]
    ]);
  };
  const { filterContainerMeta } = useTableFilterContainer(
    [],
    updateTableFilterInfo,
    RuleFilterContainerMeta()
  );

  const ruleFilterContainerCustomProps: TableFilterContainerProps<
    GetTemplateRuleParams,
    GetTemplateRuleParams
  >['filterCustomProps'] = useMemo(() => {
    return new Map<keyof GetTemplateRuleParams, FilterCustomProps>([
      [
        'fuzzy_keyword_rule',
        {
          value: fuzzyKeyword,
          onCustomPressEnter: setFuzzyKeyword,
          style: { width: 280 },
          allowClear: true,
          placeholder: t('rule.form.fuzzy_text_placeholder')
        }
      ]
    ]);
  }, [setFuzzyKeyword, t, fuzzyKeyword]);

  return {
    filterContainerMeta,
    updateTableFilterInfo,
    ruleFilterContainerCustomProps,
    fuzzyKeyword
  };
};

export default useRuleDetailFilter;
