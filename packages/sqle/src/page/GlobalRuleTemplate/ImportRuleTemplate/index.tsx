import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Space, Spin } from 'antd';
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
import { IconSuccessResult } from '@actiontech/shared/lib/Icon/common';
import { RuleTemplateContStyleWrapper } from '../../RuleTemplate/CreateRuleTemplate/style';
import RuleTemplateForm from '../../RuleTemplate/RuleTemplateForm';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  FormAreaBlockStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import Icon from '@ant-design/icons';
import {
  useImportRuleTemplateForm,
  useBackToListPage
} from '../../../hooks/useRuleTemplateForm';
import useRuleManagerSegmented from '../../RuleManager/useRuleManagerSegmented';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';
import { LeftArrowOutlined, ProfileSquareFilled } from '@actiontech/icons';

const ImportRuleTemplate: React.FC = () => {
  const { t } = useTranslation();

  const { onGoToGlobalRuleTemplateList } = useBackToListPage();

  const {
    ruleTemplateFormVisibility,
    selectFileForm,
    ruleTemplateForm,
    allRules,
    getAllRulesLoading,
    importFile,
    activeRule,
    setActiveRule,
    step,
    submitSuccessStatus,
    baseInfoFormSubmit,
    baseInfoFormSubmitLoading,
    prevStep,
    nextStep,
    resetAll,
    dbType,
    messageContextHolder,
    createLoading,
    startCreate,
    finishCreate,
    filteredRule,
    setFilteredRule
  } = useImportRuleTemplateForm();

  const { projectName } = useCurrentProject();

  const { updateActiveSegmentedKey } = useRuleManagerSegmented();

  const gotoListPage = () => {
    updateActiveSegmentedKey(RuleManagerSegmentedKey.GlobalRuleTemplate);
    onGoToGlobalRuleTemplateList();
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

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      {messageContextHolder}
      <PageHeader
        fixed={step !== 1}
        title={
          <BasicButton onClick={gotoListPage} icon={<LeftArrowOutlined />}>
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
              <BasicButton onClick={resetAll} disabled={createLoading}>
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
                  <Icon
                    component={ProfileSquareFilled}
                    className="title-icon"
                  />
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
              filteredRule={filteredRule}
              updateFilteredRule={setFilteredRule}
              allRules={allRules ?? []}
              ruleListLoading={getAllRulesLoading}
              submitLoading={createLoading}
              baseInfoFormSubmitLoading={baseInfoFormSubmitLoading}
              step={step}
              dbType={dbType}
              updateActiveRule={setActiveRule}
              baseInfoSubmit={baseInfoFormSubmit}
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
              onClick={gotoListPage}
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
