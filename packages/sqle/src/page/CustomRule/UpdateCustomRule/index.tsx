import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Spin, Space } from 'antd';
import { useBoolean, useRequest } from 'ahooks';
import classNames from 'classnames';
import CustomRuleForm from '../CustomRuleForm/CustomRuleForm';
import { BasicButton, BasicResult, PageHeader } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { UpdateCustomRuleReqV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import useCustomRuleTemplateForm from '../hooks/useCustomRuleTemplateForm';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import { RuleTemplateContStyleWrapper } from '../../RuleTemplate/CreateRuleTemplate/style';

const UpdateCustomRule: React.FC = () => {
  const { t } = useTranslation();
  const { ruleID = '' } = useParams<{ ruleID: string }>();
  const {
    form,
    editScriptForm,
    submitSuccessStatus,
    step,
    extraRuleTypeList,
    extraRuleName,
    prevStep,
    nextStep,
    baseInfoFormSubmit,
    resetExtraInfo,
    onExtraRuleNameChange,
    resetAll,
    onGoCustomRuleList
  } = useCustomRuleTemplateForm(true);

  const [updateLoading, { setTrue: startUpdate, setFalse: finishUpdate }] =
    useBoolean();

  const { data, loading: getCustomRuleLoading } = useRequest(
    () =>
      rule_template
        .getCustomRuleV1({ rule_id: ruleID })
        .then((res) => res.data.data),
    {
      ready: !!ruleID
    }
  );

  const submit = useCallback(async () => {
    const baseInfo = await form.validateFields();
    const values = await editScriptForm.validateFields();
    startUpdate();

    rule_template
      .updateCustomRuleV1({
        rule_id: ruleID,
        desc: baseInfo.desc,
        level: baseInfo.level as UpdateCustomRuleReqV1LevelEnum | undefined,
        annotation: baseInfo.annotation,
        rule_script: values.script,
        type: baseInfo.ruleType
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          nextStep();
        }
      })
      .finally(() => {
        finishUpdate();
      });
  }, [editScriptForm, finishUpdate, form, nextStep, ruleID, startUpdate]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed={step !== 1}
        title={
          <BasicButton onClick={onGoCustomRuleList} icon={<IconLeftArrow />}>
            {t('customRule.backToList')}
          </BasicButton>
        }
        extra={
          <Space size={12}>
            {step === 0 && (
              <BasicButton onClick={resetAll} disabled={updateLoading}>
                {t('common.reset')}
              </BasicButton>
            )}
            {step === 1 && (
              <>
                <BasicButton onClick={prevStep} disabled={updateLoading}>
                  {t('common.prevStep')}
                </BasicButton>
                <BasicButton
                  type="primary"
                  loading={updateLoading}
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
        <Spin spinning={!ruleID || getCustomRuleLoading}>
          <CustomRuleForm
            title={t('customRule.editCustomRule.title')}
            form={form}
            editScriptForm={editScriptForm}
            step={step}
            prevStep={prevStep}
            defaultData={data}
            submit={submit}
            submitLoading={updateLoading}
            baseInfoSubmit={baseInfoFormSubmit}
            extraRuleTypeList={extraRuleTypeList}
            extraRuleName={extraRuleName}
            resetExtraInfo={resetExtraInfo}
            onExtraRuleNameChange={onExtraRuleNameChange}
          />
        </Spin>
      </RuleTemplateContStyleWrapper>

      <div hidden={!submitSuccessStatus}>
        <BasicResult
          icon={<IconSuccessResult />}
          title={t('customRule.editCustomRule.successTitle')}
          extra={[
            <BasicButton
              type="primary"
              key="view-rule-template-list"
              onClick={onGoCustomRuleList}
            >
              {t('customRule.editCustomRule.backToList')}
            </BasicButton>
          ]}
        ></BasicResult>
      </div>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default UpdateCustomRule;
