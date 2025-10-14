import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { useBoolean } from 'ahooks';
import classNames from 'classnames';
import { ResponseCode } from '@actiontech/dms-kit';
import CustomRuleForm from '../CustomRuleForm/CustomRuleForm';
import { BasicButton, BasicResult, PageHeader } from '@actiontech/dms-kit';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { CreateCustomRuleReqV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/dms-kit';
import { RuleTemplateContStyleWrapper } from '../../RuleTemplate/CreateRuleTemplate/style';
import useCustomRuleTemplateForm from '../hooks/useCustomRuleTemplateForm';
import { LeftArrowOutlined } from '@actiontech/icons';
const CreateCustomRule: React.FC = () => {
  const { t } = useTranslation();
  const [createLoading, { setTrue: startCreate, setFalse: finishCreate }] =
    useBoolean();
  const {
    form,
    editScriptForm,
    submitSuccessStatus,
    step,
    prevStep,
    nextStep,
    baseInfoFormSubmit,
    resetAll,
    onGoCustomRuleList
  } = useCustomRuleTemplateForm();
  const submit = useCallback(async () => {
    const baseInfo = await form.validateFields();
    const values = await editScriptForm.validateFields();
    startCreate();
    rule_template
      .createCustomRuleV1({
        db_type: baseInfo.dbType,
        desc: baseInfo.desc,
        level: baseInfo.level as CreateCustomRuleReqV1LevelEnum | undefined,
        annotation: baseInfo.annotation,
        rule_script: values.script,
        tags: [
          ...baseInfo.operand,
          baseInfo.auditPurpose,
          baseInfo.auditAccuracy,
          baseInfo.sql,
          baseInfo.performanceCost ?? ''
        ].filter((item) => !!item)
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          nextStep();
        }
      })
      .finally(() => {
        finishCreate();
      });
  }, [editScriptForm, finishCreate, form, nextStep, startCreate]);
  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed={step !== 1}
        title={
          <BasicButton
            onClick={onGoCustomRuleList}
            icon={<LeftArrowOutlined />}
          >
            {t('customRule.backToList')}
          </BasicButton>
        }
        extra={
          <Space size={12}>
            {step === 0 && (
              <BasicButton onClick={resetAll} disabled={createLoading}>
                {t('common.reset')}
              </BasicButton>
            )}
            {step === 1 && (
              <>
                <BasicButton onClick={prevStep} disabled={createLoading}>
                  {t('common.prevStep')}
                </BasicButton>
                <BasicButton
                  type="primary"
                  loading={createLoading}
                  onClick={submit}
                >
                  {t('common.submit')}
                </BasicButton>
              </>
            )}
          </Space>
        }
      />
      <RuleTemplateContStyleWrapper
        className={classNames({
          'fix-header-padding': step !== 1
        })}
        hidden={submitSuccessStatus}
      >
        <CustomRuleForm
          title={t('customRule.addCustomRule.title')}
          form={form}
          editScriptForm={editScriptForm}
          step={step}
          prevStep={prevStep}
          submit={submit}
          baseInfoSubmit={baseInfoFormSubmit}
          submitLoading={createLoading}
        />
      </RuleTemplateContStyleWrapper>
      <div hidden={!submitSuccessStatus}>
        <BasicResult
          status="success"
          title={t('customRule.addCustomRule.successTitle')}
          subTitle={t('customRule.addCustomRule.successTips')}
          extra={[
            <BasicButton
              type="primary"
              key="view-rule-template-list"
              onClick={onGoCustomRuleList}
            >
              {t('customRule.addCustomRule.backToList')}
            </BasicButton>
          ]}
        />
      </div>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};
export default CreateCustomRule;
