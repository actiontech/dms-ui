import Icon from '@ant-design/icons';
import { CustomRuleFormProps } from '.';
import BaseInfoForm from './BaseInfoForm';
import EditRuleScript from './EditRuleScript';
import { FormAreaBlockStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import { IconRuleTitle } from '../../../icon/Rule';

const CustomRuleForm: React.FC<CustomRuleFormProps> = (props) => {
  const {
    title,
    step,
    form,
    editScriptForm,
    defaultData,
    extraRuleTypeList,
    extraRuleName,
    resetExtraInfo,
    onExtraRuleNameChange,
    prevStep,
    baseInfoSubmit,
    submit,
    submitLoading
  } = props;

  return (
    <>
      <FormAreaBlockStyleWrapper>
        <div hidden={step !== 0} data-testid="base-form">
          <FormItemBigTitle>
            <Icon component={IconRuleTitle} className="title-icon" />
            <span>{title}</span>
          </FormItemBigTitle>
          <BaseInfoForm
            form={form}
            submit={baseInfoSubmit}
            defaultData={defaultData}
            extraRuleTypeList={extraRuleTypeList}
            extraRuleName={extraRuleName}
            resetExtraInfo={resetExtraInfo}
            onExtraRuleNameChange={onExtraRuleNameChange}
          />
        </div>

        <div hidden={step !== 1} data-testid="rule-script">
          <EditRuleScript
            form={editScriptForm}
            prevStep={prevStep}
            submit={submit}
            submitLoading={submitLoading}
            defaultData={defaultData}
          />
        </div>
      </FormAreaBlockStyleWrapper>
    </>
  );
};
export default CustomRuleForm;
