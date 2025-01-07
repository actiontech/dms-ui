import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Space, Spin, Form, Radio } from 'antd';
import classNames from 'classnames';
import {
  BasicButton,
  BasicResult,
  EmptyBox,
  PageHeader
} from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  CustomLabelContent,
  FormItemBigTitle,
  FormItemLabel
} from '@actiontech/shared/lib/components/CustomForm';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { getFileFromUploadChangeEvent } from '@actiontech/shared/lib/utils/Common';
import { IRuleReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { RuleTemplateContStyleWrapper } from '../../RuleTemplate/CreateRuleTemplate/style';
import RuleTemplateForm from '../../RuleTemplate/RuleTemplateForm';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  FormAreaBlockStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/CustomForm/style';
import Icon from '@ant-design/icons';
import {
  useImportRuleTemplateForm,
  useBackToListPage
} from '../../../hooks/useRuleTemplateForm';
import useRuleManagerSegmented from '../../RuleManager/useRuleManagerSegmented';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';
import { LeftArrowOutlined, ProfileSquareFilled } from '@actiontech/icons';
import { exportRuleTemplateV1ExportTypeEnum } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.enum';
import FileUpload from '../../RuleTemplate/ImportRuleTemplate/FileUpload';

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
    createLoading,
    startCreate,
    finishCreate,
    filteredRule,
    setFilteredRule,
    uploadCheckStatus,
    removeUploadFile,
    uploadFileCustomRequest,
    ruleFilterForm,
    filterCategoryTags
  } = useImportRuleTemplateForm();

  const fileType = Form.useWatch('fileType', selectFileForm);

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
              <BasicButton
                onClick={importFile}
                disabled={!uploadCheckStatus.success}
              >
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
                  rules={[{ required: true }]}
                  initialValue={exportRuleTemplateV1ExportTypeEnum.csv}
                  name="fileType"
                  className="has-required-style"
                  label={t('ruleTemplate.importRuleTemplate.fileType')}
                >
                  <Radio.Group
                    options={Object.values(
                      exportRuleTemplateV1ExportTypeEnum
                    ).map((v) => v)}
                  />
                </FormItemLabel>
                <FormItemLabel
                  className="has-required-style has-label-tip"
                  label={
                    <CustomLabelContent
                      title={t('ruleTemplate.importRuleTemplate.selectFile')}
                      tips={t('ruleTemplate.importRuleTemplate.selectFileTips')}
                    />
                  }
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
                  <FileUpload
                    uploadCheckStatus={uploadCheckStatus}
                    customRequest={uploadFileCustomRequest}
                    maxCount={1}
                    onRemove={removeUploadFile}
                    accept={`.${fileType}`}
                  />
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
              ruleFilterForm={ruleFilterForm}
              filterCategoryTags={filterCategoryTags}
            />
          </Spin>
        </EmptyBox>
      </RuleTemplateContStyleWrapper>
      <div hidden={!submitSuccessStatus}>
        <BasicResult
          status="success"
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
