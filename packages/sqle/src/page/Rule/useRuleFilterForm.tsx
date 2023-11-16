import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import useDatabaseType from '../../hooks/useDatabaseType';
import useGlobalRuleTemplate from '../../hooks/useGlobalRuleTemplate';
import useRuleTemplate from '../../hooks/useRuleTemplate';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { SelectProps } from 'antd5';
import {
  FilterCustomProps,
  TableFilterContainerProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { GetRuleListV1Params } from './index.data';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { IconProjectFlag } from '@actiontech/shared/lib/Icon/common';
import { RuleListProjectFilterStyleWrapper } from './style';

export enum RuleUrlParamKey {
  projectID = 'projectID',
  ruleTemplateName = 'ruleTemplateName'
}

const useRuleFilterForm = (
  getProjectTemplateRules: (
    projectName?: string,
    ruleTemplateName?: string,
    filter_fuzzy_text?: string
  ) => void,
  getGlobalTemplateRules: (
    ruleTemplateName?: string,
    filter_fuzzy_text?: string
  ) => void
) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { bindProjects } = useCurrentUser();

  const [dbType, setDbType] = useState<string | undefined>(undefined);
  const {
    loading: getDriverNameListLoading,
    dbTypeOptions,
    driverNameList,
    updateDriverNameList
  } = useDatabaseType();
  const {
    loading: getProjectRuleTemplateListLoading,
    ruleTemplateList,
    updateRuleTemplateList
  } = useRuleTemplate();
  const {
    loading: getGlobalRuleTemplateListLoading,
    globalRuleTemplateList,
    updateGlobalRuleTemplateList
  } = useGlobalRuleTemplate();
  const [projectName, setProjectName] = useState<string>();
  const [ruleTemplateName, setRuleTemplateName] = useState<string>();
  const [filterFuzzyCont, setFilterFuzzyCont] = useState<string>();

  const projectOptions: SelectProps['options'] = useMemo(() => {
    return bindProjects.map((v) => ({
      label: (
        <RuleListProjectFilterStyleWrapper>
          <TableColumnWithIconStyleWrapper>
            <IconProjectFlag />
            <span> {v.project_name} </span>
          </TableColumnWithIconStyleWrapper>
        </RuleListProjectFilterStyleWrapper>
      ),
      value: v.project_name
    }));
  }, [bindProjects]);

  const ruleTemplateOptions: SelectProps['options'] = useMemo(() => {
    const list = projectName ? ruleTemplateList : globalRuleTemplateList;
    const groupLabel = projectName
      ? t('rule.projectRuleTemplate')
      : t('rule.globalRuleTemplate');
    return list.length > 0
      ? [
          {
            label: groupLabel,
            options: list.map((v) => ({
              label: v.rule_template_name,
              value: v.rule_template_name
            }))
          }
        ]
      : [];
  }, [globalRuleTemplateList, projectName, ruleTemplateList, t]);

  const ruleFilterContainerCustomProps: TableFilterContainerProps<
    GetRuleListV1Params,
    GetRuleListV1Params
  >['filterCustomProps'] = useMemo(() => {
    const ruleTemplateNameChangeHandle = (name: string) => {
      setRuleTemplateName(name);
      if (!name) {
        return;
      }
      if (projectName) {
        getProjectTemplateRules(projectName, name, filterFuzzyCont);
      } else {
        getGlobalTemplateRules(name, filterFuzzyCont);
      }
    };

    const projectNameChangeHandle = (name: string) => {
      setProjectName(name);
      setRuleTemplateName(undefined);
      if (name) {
        updateRuleTemplateList(name);
      }
    };

    const fuzzyContChangeHandle = (fuzzyText: string) => {
      setFilterFuzzyCont(fuzzyText);
      if (projectName) {
        ruleTemplateName &&
          getProjectTemplateRules(projectName, ruleTemplateName, fuzzyText);
      } else {
        ruleTemplateName && getGlobalTemplateRules(ruleTemplateName, fuzzyText);
      }
    };

    return new Map<keyof GetRuleListV1Params, FilterCustomProps>([
      [
        'filter_fuzzy_text',
        {
          value: filterFuzzyCont,
          onCustomPressEnter: fuzzyContChangeHandle,
          style: { width: 300 },
          allowClear: true,
          placeholder: t('rule.form.fuzzy_text_placeholder')
        }
      ],
      [
        'project_name',
        {
          options: projectOptions,
          value: projectName,
          onChange: projectNameChangeHandle,
          style: { width: 300 }
        }
      ],
      [
        'filter_rule_names',
        {
          options: ruleTemplateOptions,
          loading: projectName
            ? getProjectRuleTemplateListLoading
            : getGlobalRuleTemplateListLoading,
          value: ruleTemplateName,
          onChange: ruleTemplateNameChangeHandle,
          style: { width: 300 }
        }
      ],
      [
        'filter_db_type',
        {
          options: dbTypeOptions,
          loading: getDriverNameListLoading,
          value: dbType,
          onChange: setDbType,
          allowClear: false,
          disabled: !!ruleTemplateName,
          style: { width: 300 }
        }
      ]
    ]);
  }, [
    dbType,
    dbTypeOptions,
    getDriverNameListLoading,
    getGlobalRuleTemplateListLoading,
    getGlobalTemplateRules,
    getProjectRuleTemplateListLoading,
    getProjectTemplateRules,
    projectName,
    projectOptions,
    ruleTemplateName,
    ruleTemplateOptions,
    updateRuleTemplateList,
    filterFuzzyCont,
    t
  ]);

  useEffect(() => {
    updateGlobalRuleTemplateList();
    updateDriverNameList();
  }, [updateDriverNameList, updateGlobalRuleTemplateList]);

  useEffect(() => {
    if (driverNameList.length > 0 && !dbType) {
      setDbType(driverNameList[0]);
    }
  }, [driverNameList, dbType]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const projectNameInUrl = bindProjects.find(
      (v) => v.project_id === searchParams.get(RuleUrlParamKey.projectID)
    )?.project_name;
    const ruleTemplateNameInUrl = searchParams.get(
      RuleUrlParamKey.ruleTemplateName
    );
    if (projectNameInUrl) {
      setProjectName(projectNameInUrl);
      updateRuleTemplateList(projectNameInUrl);
    }

    if (ruleTemplateNameInUrl) {
      setRuleTemplateName(ruleTemplateNameInUrl);
      projectNameInUrl
        ? getProjectTemplateRules(projectNameInUrl, ruleTemplateNameInUrl)
        : getGlobalTemplateRules(ruleTemplateNameInUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getGlobalTemplateRules,
    getProjectTemplateRules,
    location.search,
    updateRuleTemplateList
  ]);

  return {
    projectName,
    ruleFilterContainerCustomProps,
    getDriverNameListLoading,
    getProjectRuleTemplateListLoading,
    getGlobalRuleTemplateListLoading,
    dbType,
    setDbType,
    ruleTemplateName,
    filterFuzzyCont
  };
};

export default useRuleFilterForm;
