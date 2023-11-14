import { useCallback, useState } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';
import { ruleTemplateListDefaultKey } from '../../data/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { IRuleTemplateTipResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type typeRuleItem = IRuleTemplateTipResV1;

const useRuleTemplate = () => {
  const [ruleTemplateList, setRuleTemplate] = useState<IRuleTemplateTipResV1[]>(
    []
  );
  const [loading, { setTrue, setFalse }] = useBoolean();

  // todo: filter fuzzy text 没看懂干撒的
  const updateRuleTemplateList = useCallback(
    (projectName: string, dbType?: string) => {
      setTrue();
      rule_template
        .getProjectRuleTemplateTipsV1({
          project_name: projectName,
          filter_db_type: dbType
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setRuleTemplate(res.data?.data ?? []);
          } else {
            setRuleTemplate([]);
          }
        })
        .catch(() => {
          setRuleTemplate([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const generateRuleTemplateSelectOption = useCallback(
    (db_type: string = ruleTemplateListDefaultKey) => {
      let filterRuleTemplateList: IRuleTemplateTipResV1[] = [];
      if (db_type !== ruleTemplateListDefaultKey) {
        filterRuleTemplateList = ruleTemplateList.filter(
          (i) => i.db_type === db_type
        );
      } else {
        filterRuleTemplateList = ruleTemplateList;
      }
      return filterRuleTemplateList.map((template) => {
        return (
          <Select.Option
            key={template.rule_template_id}
            value={template.rule_template_name ?? ''}
          >
            {template.rule_template_name}
          </Select.Option>
        );
      });
    },
    [ruleTemplateList]
  );

  return {
    ruleTemplateList,
    loading,
    updateRuleTemplateList,
    generateRuleTemplateSelectOption
  };
};

export default useRuleTemplate;
