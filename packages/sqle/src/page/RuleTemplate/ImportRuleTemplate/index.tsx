import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useBoolean } from 'ahooks';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentProject } from '@actiontech/shared/lib/global';

import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import useRuleTemplateForm from '../hooks/useRuleTemplateForm';
import useImportRuleTemplate from '../hooks/useImportRuleTemplate';
import { getFileFromUploadChangeEvent } from '@actiontech/shared/lib/utils/Common';
import { IRuleReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';

import { Upload, message, Space, Spin } from 'antd5';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  BasicButton,
  BasicResult,
  EmptyBox,
  PageHeader
} from '@actiontech/shared';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import { RuleTemplateContStyleWrapper } from '../CreateRuleTemplate/style';
import {
  FormAreaBlockStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import {
  FormItemBigTitle,
  FormItemLabel
} from '@actiontech/shared/lib/components/FormCom';
import Icon from '@ant-design/icons';
import { IconRuleTitle } from '../../../icon/Rule';
import RuleTemplateForm from '../RuleTemplateForm';

const ImportRuleTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();

  const { projectName, projectID } = useCurrentProject();

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
    resetAll: resetBaseInfoForm
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

  const onGoRuleList = () => {
    navigate(`/sqle/project/${projectID}/rule/template`);
  };

  const submit = useCallback(() => {
    startCreate();
    const baseInfo = ruleTemplateForm.getFieldsValue();
    const activeRuleWithNewField: IRuleReqV1[] = activeRule.map((rule) => {
      return {
        name: rule.rule_name,
        level: rule.level,
        params: !!rule.params
          ? rule.params.map((v) => ({ key: v.key, value: v.value }))
          : [],
        is_custom_rule: !!rule.is_custom_rule
      };
    });
    rule_template
      .createProjectRuleTemplateV1({
        rule_template_name: baseInfo.templateName,
        desc: baseInfo.templateDesc,
        db_type: baseInfo.db_type,
        rule_list: activeRuleWithNewField,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          nextStep();
        }
      })
      .finally(() => {
        finishCreate();
      });
  }, [
    activeRule,
    finishCreate,
    nextStep,
    ruleTemplateForm,
    startCreate,
    projectName
  ]);

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
          <BasicButton onClick={onGoRuleList} icon={<IconLeftArrow />}>
            {t('ruleTemplate.backToList')}
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
              onClick={onGoRuleList}
            >
              {t('ruleTemplate.backToList')}
            </BasicButton>
          ]}
        />
      </div>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default ImportRuleTemplate;
