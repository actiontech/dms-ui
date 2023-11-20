import { IconProjectFlag } from '@actiontech/shared/lib/Icon/common';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { SelectProps } from 'antd5';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RuleListProjectFilterStyleWrapper } from '../style';
import useRuleTemplate from '../../../hooks/useRuleTemplate';
import useGlobalRuleTemplate from '../../../hooks/useGlobalRuleTemplate';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export enum RuleUrlParamKey {
  projectID = 'projectID'
}

const useRuleFilterFormItem = (
  getTemplateRules: (
    projectName?: string | undefined,
    ruleTemplateName?: string | undefined,
    filterFuzzyCont?: string | undefined
  ) => void
) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [showNotRuleTemplatePage, setShowNorRuleTemplatePage] = useState(false);
  const [filterProjectName, setFilterProjectName] = useState<string>();
  const [filterRuleTemplate, setFilterRuleTemplate] = useState<string>();
  const [filterDbType, setFilterDbType] = useState<string>();

  //filter rule template name
  const {
    loading: getRuleTemplateLoading,
    updateRuleTemplateListAsync,
    ruleTemplateTipsOptions
  } = useRuleTemplate();
  const {
    loading: getGlobalRuleTemplateLoading,
    updateGlobalRuleTemplateList,
    globalRuleTemplateTipsOptions
  } = useGlobalRuleTemplate();

  const ruleTemplateOptions: SelectProps['options'] = useMemo(() => {
    const options = filterProjectName
      ? ruleTemplateTipsOptions(filterDbType)
      : globalRuleTemplateTipsOptions(filterDbType);
    const groupLabel = filterProjectName
      ? t('rule.projectRuleTemplate')
      : t('rule.globalRuleTemplate');
    return options.length > 0
      ? [
          {
            label: groupLabel,
            options: options
          }
        ]
      : [];
  }, [
    filterProjectName,
    ruleTemplateTipsOptions,
    filterDbType,
    globalRuleTemplateTipsOptions,
    t
  ]);

  const changeRuleTemplateNameHandle = (name?: string) => {
    setFilterRuleTemplate(name);
    if (!name) {
      setFilterProjectName(undefined);
      return;
    }
    getTemplateRules(filterProjectName, name, filterFuzzyCont);
  };

  //filter fuzzy cont
  const [filterFuzzyCont, setFilterFuzzyCont] = useState<string>();

  const pressEnterFuzzyContHandle = useCallback(
    (fuzzyCont?: string): void => {
      setFilterFuzzyCont(fuzzyCont);
      if (!filterRuleTemplate) {
        return;
      }
      getTemplateRules(filterProjectName, filterRuleTemplate, fuzzyCont);
    },
    [filterProjectName, filterRuleTemplate, getTemplateRules]
  );

  //filter project name
  const { bindProjects } = useCurrentUser();
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
  const changeProjectNameHandle = useCallback(
    (projectName?: string) => {
      setFilterProjectName(projectName);

      if (!projectName) {
        setFilterRuleTemplate(undefined);
        setShowNorRuleTemplatePage(false);
      } else {
        updateRuleTemplateListAsync(projectName).then((res) => {
          const ruleTemplateListByProjectName = res ?? [];
          if (ruleTemplateListByProjectName.length > 0) {
            setShowNorRuleTemplatePage(false);
            setFilterRuleTemplate(
              ruleTemplateListByProjectName[0]?.rule_template_name
            );
            setFilterDbType(ruleTemplateListByProjectName[0]?.db_type);
            getTemplateRules(
              projectName,
              ruleTemplateListByProjectName[0]?.rule_template_name,
              filterFuzzyCont
            );
          } else {
            setShowNorRuleTemplatePage(true);
            setFilterRuleTemplate(undefined);
          }
        });
      }
    },
    [filterFuzzyCont, getTemplateRules, updateRuleTemplateListAsync]
  );
  const projectID = useMemo(() => {
    return bindProjects.find((v) => v.project_name === filterProjectName)
      ?.project_id;
  }, [bindProjects, filterProjectName]);

  useEffect(() => {
    updateGlobalRuleTemplateList();

    const searchParams = new URLSearchParams(location.search);
    const projectNameInUrl = bindProjects.find(
      (v) => v.project_id === searchParams.get(RuleUrlParamKey.projectID)
    )?.project_name;
    changeProjectNameHandle(projectNameInUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    showNotRuleTemplatePage,
    filterRuleTemplate,
    changeRuleTemplateNameHandle,
    getRuleTemplateLoading,
    getGlobalRuleTemplateLoading,
    ruleTemplateOptions,
    filterFuzzyCont,
    pressEnterFuzzyContHandle,
    projectID,
    projectOptions,
    filterProjectName,
    changeProjectNameHandle,
    filterDbType,
    setFilterDbType
  };
};

export default useRuleFilterFormItem;
