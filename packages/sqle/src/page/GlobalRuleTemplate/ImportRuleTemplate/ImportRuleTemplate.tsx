import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { Upload, message, Space, Spin } from 'antd';
import classNames from 'classnames';
import {
  BasicButton,
  BasicResult,
  EmptyBox,
  PageHeader
} from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  FormItemBigTitle,
  FormItemLabel
} from '@actiontech/shared/lib/components/FormCom';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { getFileFromUploadChangeEvent } from '@actiontech/shared/lib/utils/Common';
import { IRuleReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import { RuleTemplateContStyleWrapper } from '../../RuleTemplate/CreateRuleTemplate/style';
import useRuleTemplateForm from '../../RuleTemplate/hooks/useRuleTemplateForm';
import RuleTemplateForm from '../../RuleTemplate/RuleTemplateForm';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  FormAreaBlockStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import useImportRuleTemplate from '../../RuleTemplate/hooks/useImportRuleTemplate';
import Icon from '@ant-design/icons';
import { IconRuleTitle } from '../../../icon/Rule';

const ImportRuleTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();

  const {
    form: ruleTemplateForm,
    activeRule,
    step,
    submitSuccessStatus,
    baseInfoFormSubmitLoading,
    baseInfoFormSubmit,
    dbType,
    setActiveRule,
    prevStep,
    nextStep,
    resetAll: resetBaseInfoForm,
    onGoToGlobalRuleTemplateList
  } = useRuleTemplateForm(true);

  const {
    ruleTemplateFormVisibility,
    selectFileForm,
    allRules,
    getAllRulesLoading,
    importFile,
    importActiveRuleData
  } = useImportRuleTemplate({ ruleTemplateForm, setActiveRule, messageApi });

  const [createLoading, { setTrue: startCreate, setFalse: finishCreate }] =
    useBoolean();
  const { projectName } = useCurrentProject();

  const submit = useCallback(() => {
    startCreate();
    const baseInfo = ruleTemplateForm.getFieldsValue();
    const activeRuleWithNewField: IRuleReqV1[] = activeRule.map((rule) => {
      return {
        name: rule.rule_name,
        level: rule.level,
        params: !!rule.params
          ? rule.params.map((v) => ({ key: v.key, value: v.value }))
          : []
      };
    });
    rule_template
      .createRuleTemplateV1({
        rule_template_name: baseInfo.templateName,
        desc: baseInfo.templateDesc,
        db_type: baseInfo.db_type,
        rule_list: activeRuleWithNewField
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          nextStep();
        }
      })
      .finally(() => {
        finishCreate();
      });
  }, [activeRule, finishCreate, nextStep, ruleTemplateForm, startCreate]);

  const resetAllForms = () => {
    resetBaseInfoForm();
    selectFileForm.resetFields();
  };

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      {messageContextHolder}
      <PageHeader
        fixed={step !== 1}
        title={
          <BasicButton
            onClick={onGoToGlobalRuleTemplateList}
            icon={<IconLeftArrow />}
          >
            {t('ruleManager.backToGlobalRuleTemplateList')}
          </BasicButton>
        }
        extra={
          <Space size={12}>
            {!ruleTemplateFormVisibility && (
              <BasicButton onClick={importFile} disabled={createLoading}>
                {t('ruleTemplate.importRuleTemplate.submitText')}
              </BasicButton>
            )}
            {ruleTemplateFormVisibility && step === 0 && (
              <BasicButton onClick={resetAllForms} disabled={createLoading}>
                {t('common.reset')}
              </BasicButton>
            )}
            {ruleTemplateFormVisibility && step === 1 && (
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
        <EmptyBox
          if={ruleTemplateFormVisibility}
          defaultNode={
            <FormAreaBlockStyleWrapper>
              <FormStyleWrapper
                form={selectFileForm}
                onFinish={importFile}
                colon={false}
                labelAlign="left"
                className="hasTopHeader"
                {...formItemLayout.spaceBetween}
              >
                <FormItemBigTitle>
                  <Icon component={IconRuleTitle} className="title-icon" />
                  <span>{t('ruleTemplate.importRuleTemplate.title')}</span>
                </FormItemBigTitle>
                <FormItemLabel
                  className="has-required-style"
                  label={t('ruleTemplate.importRuleTemplate.selectFile')}
                  name="ruleTemplateFile"
                  valuePropName="fileList"
                  getValueFromEvent={getFileFromUploadChangeEvent}
                  rules={[
                    {
                      required: true,
                      message: t(
                        'ruleTemplate.importRuleTemplate.fileRequireTips'
                      )
                    }
                  ]}
                >
                  <Upload
                    beforeUpload={() => false}
                    maxCount={1}
                    onRemove={() => {
                      selectFileForm.setFieldsValue({
                        ruleTemplateFile: []
                      });
                    }}
                    accept=".json"
                  >
                    <BasicButton>{t('common.upload')}</BasicButton>
                  </Upload>
                </FormItemLabel>
              </FormStyleWrapper>
            </FormAreaBlockStyleWrapper>
          }
        >
          <Spin spinning={getAllRulesLoading}>
            <RuleTemplateForm
              title={t('ruleTemplate.importRuleTemplate.title')}
              form={ruleTemplateForm}
              activeRule={activeRule}
              allRules={allRules ?? []}
              ruleListLoading={getAllRulesLoading}
              submitLoading={createLoading}
              baseInfoFormSubmitLoading={baseInfoFormSubmitLoading}
              step={step}
              dbType={dbType}
              updateActiveRule={setActiveRule}
              baseInfoSubmit={() =>
                baseInfoFormSubmit('', importActiveRuleData)
              }
              submit={submit}
              projectName={projectName}
              mode="import"
            />
          </Spin>
        </EmptyBox>
      </RuleTemplateContStyleWrapper>
      <div hidden={!submitSuccessStatus}>
        <BasicResult
          icon={<IconSuccessResult />}
          title={t('ruleTemplate.importRuleTemplate.successTitle')}
          extra={[
            <BasicButton
              type="primary"
              key="view-rule-template-list"
              onClick={onGoToGlobalRuleTemplateList}
            >
              {t('ruleManager.backToGlobalRuleTemplateList')}
            </BasicButton>
          ]}
        />
      </div>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default ImportRuleTemplate;
