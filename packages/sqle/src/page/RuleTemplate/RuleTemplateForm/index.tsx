import { RuleTemplateFormProps } from './index.type';

import { FormAreaBlockStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import Icon from '@ant-design/icons/lib/components/Icon';
import BaseInfoForm from './BaseInfoForm';
import RuleSelect from './RuleSelect';
import { ProfileSquareFilled } from '@actiontech/icons';

const RuleTemplateForm = (props: RuleTemplateFormProps) => {
  return (
    <>
      <section hidden={props.step !== 0} data-testid="base-form">
        <FormAreaBlockStyleWrapper>
          <FormItemBigTitle>
            <Icon component={ProfileSquareFilled} className="title-icon" />
            <span>{props.title}</span>
          </FormItemBigTitle>
          <BaseInfoForm
            form={props.form}
            submit={props.baseInfoSubmit}
            submitLoading={props.baseInfoFormSubmitLoading}
            defaultData={props.defaultData}
            projectName={props.projectName}
            mode={props.mode}
          />
        </FormAreaBlockStyleWrapper>
      </section>
      <section hidden={props.step !== 1} data-testid="rule-list">
        <RuleSelect
          dbType={props.dbType}
          allRules={props.allRules}
          listLoading={props.ruleListLoading}
          activeRule={props.activeRule}
          updateActiveRule={props.updateActiveRule}
          formSubmitLoading={props.submitLoading}
          filteredRule={props.filteredRule}
          updateFilteredRule={props.updateFilteredRule}
        />
      </section>
    </>
  );
};

export default RuleTemplateForm;
