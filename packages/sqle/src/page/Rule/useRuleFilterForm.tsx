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

export enum RuleUrlParamKey {
  projectID = 'projectID',
  ruleTemplateName = 'ruleTemplateName'
}

const useRuleFilterForm = (
  getProjectTemplateRules: (
    projectName?: string,
    ruleTemplateName?: string
  ) => void,
  getGlobalTemplateRules: (ruleTemplateName?: string) => void
) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { bindProjects } = useCurrentUser();

  const [dbType, setDbType] = useState<string | undefined>(undefined);
  const { updateDriverNameList, driverNameList } = useDatabaseType();
  const { ruleTemplateList, updateRuleTemplateList } = useRuleTemplate();
  const { globalRuleTemplateList, updateGlobalRuleTemplateList } =
    useGlobalRuleTemplate();
  const [projectName, setProjectName] = useState<string>();
  const [ruleTemplateName, setRuleTemplateName] = useState<string>();

  const projectOptions: SelectProps['options'] = useMemo(() => {
    return bindProjects.map((v) => ({
      label: v.project_name,
      value: v.project_name
    }));
  }, [bindProjects]);
  const dbTypeOptions: SelectProps['options'] = useMemo(() => {
    return driverNameList.map((v) => ({
      label: v,
      value: v
    }));
  }, [driverNameList]);

  const ruleTemplateOptions: SelectProps['options'] = useMemo(() => {
    const list = projectName ? ruleTemplateList : globalRuleTemplateList;
    const groupLabel = projectName
      ? t('rule.projectRuleTemplate')
      : t('rule.globalRuleTemplate');
    return [
      {
        label: groupLabel,
        options: list.map((v) => ({
          label: v.rule_template_name,
          value: v.rule_template_name
        }))
      }
    ];
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
        getProjectTemplateRules(projectName, name);
      } else {
        getGlobalTemplateRules(name);
      }
    };

    const projectNameChangeHandle = (name: string) => {
      setProjectName(name);
      setRuleTemplateName(undefined);
      if (name) {
        updateRuleTemplateList(name);
      }
    };

    return new Map<keyof GetRuleListV1Params, FilterCustomProps>([
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
          value: ruleTemplateName,
          onChange: ruleTemplateNameChangeHandle,
          style: { width: 300 }
        }
      ],
      [
        'filter_db_type',
        {
          options: dbTypeOptions,
          value: dbType,
          onChange: setDbType,
          disabled: !!ruleTemplateName,
          style: { width: 300 }
        }
      ]
    ]);
  }, [
    dbType,
    dbTypeOptions,
    getGlobalTemplateRules,
    getProjectTemplateRules,
    projectName,
    projectOptions,
    ruleTemplateName,
    ruleTemplateOptions,
    updateRuleTemplateList
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
    dbType,
    setDbType,
    ruleTemplateName
  };
};

export default useRuleFilterForm;
