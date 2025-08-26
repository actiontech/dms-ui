import Icon from '@ant-design/icons';
import { CustomRuleFormProps } from '.';
import BaseInfoForm from './BaseInfoForm';
import EditRuleScript from './EditRuleScript';
import { FormAreaBlockStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';
import { FormItemBigTitle } from '@actiontech/dms-kit';
import { ProfileSquareFilled } from '@actiontech/icons';

const CustomRuleForm: React.FC<CustomRuleFormProps> = (props) => {
  const {
    title,
    step,
    form,
    editScriptForm,
    defaultData,
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
            <Icon component={ProfileSquareFilled} className="title-icon" />
            <span>{title}</span>
          </FormItemBigTitle>
          <BaseInfoForm
            form={form}
            submit={baseInfoSubmit}
            defaultData={defaultData}
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
