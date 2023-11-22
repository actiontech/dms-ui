import { useCallback, useState } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';
import { ruleTemplateListDefaultKey } from '../../data/common';
import { IRuleTemplateTipResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';

const useGlobalRuleTemplate = () => {
  const [globalRuleTemplateList, setRuleTemplate] = useState<
    IRuleTemplateTipResV1[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateGlobalRuleTemplateList = useCallback(
    (dbType?: string) => {
      setTrue();
      rule_template
        .getRuleTemplateTipsV1({ filter_db_type: dbType })
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

  const generateGlobalRuleTemplateSelectOption = useCallback(
    (db_type: string = ruleTemplateListDefaultKey) => {
      let filterRuleTemplateList: IRuleTemplateTipResV1[] = [];
      if (db_type !== ruleTemplateListDefaultKey) {
        filterRuleTemplateList = globalRuleTemplateList.filter(
          (i) => i.db_type === db_type
        );
      } else {
        filterRuleTemplateList = globalRuleTemplateList;
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
    [globalRuleTemplateList]
  );

  const globalRuleTemplateTipsOptions = useCallback(
    (dbType?: string) => {
      let filterRuleTemplateList: IRuleTemplateTipResV1[] = [];
      if (dbType !== ruleTemplateListDefaultKey) {
        filterRuleTemplateList = globalRuleTemplateList.filter(
          (i) => i.db_type === dbType
        );
      } else {
        filterRuleTemplateList = globalRuleTemplateList;
      }
      return filterRuleTemplateList.map((template) => {
        return {
          label: template.rule_template_name,
          value: template.rule_template_name
        };
      });
    },
    [globalRuleTemplateList]
  );

  return {
    globalRuleTemplateList,
    loading,
    updateGlobalRuleTemplateList,
    generateGlobalRuleTemplateSelectOption,
    globalRuleTemplateTipsOptions
  };
};

export default useGlobalRuleTemplate;
