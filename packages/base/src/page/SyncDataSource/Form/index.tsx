import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Form, Spin } from 'antd';
import {
  BasicInput,
  BasicSelect,
  CronInput,
  EmptyBox,
  TypedLink
} from '@actiontech/shared';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/CustomForm/style';
import {
  CustomLabelContent,
  FormInputBotBorder,
  FormItemBigTitle,
  FormItemLabel,
  FormItemNoLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/CustomForm';
import { checkCron } from '@actiontech/shared/lib/components/CronInput/useCron/cron.tool';
import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import useGlobalRuleTemplate from 'sqle/src/hooks/useGlobalRuleTemplate';
import AutoCreatedFormItemByApi from 'sqle/src/components/BackendForm/AutoCreatedFormItemByApi';
import useAsyncParams from 'sqle/src/components/BackendForm/useAsyncParams';
import { SyncTaskFormProps } from './index.type';
import SqlAuditFields from '../../DataSource/components/Form/SqlAuditFields';

const SyncTaskForm: React.FC<SyncTaskFormProps> = ({
  form,
  defaultValue,
  loading = false,
  title,
  taskSourceTips
}) => {
  const { t } = useTranslation();
  const isUpdate = useMemo<boolean>(() => !!defaultValue, [defaultValue]);
  const source = Form.useWatch('source', form);

  const { generateFormValueByParams } = useAsyncParams();

  const {
    loading: getTaskSourceListLoading,
    generateTaskSourceSelectOption,
    generateTaskSourceDbTypesSelectOption,
    generateTaskSourceAdditionalParams
  } = taskSourceTips;

  const formParams = generateTaskSourceAdditionalParams(source);

  const handleChangeInstanceType = (type: string) => {
    // #if [sqle]
    form.resetFields([
      'ruleTemplateId',
      'ruleTemplateName',
      'dataExportRuleTemplateId',
      'dataExportRuleTemplateName',
      'workbenchTemplateId',
      'workbenchTemplateName'
    ]);
    updateGlobalRuleTemplateList(type);
    // #endif
  };

  const handleChangeAuditEnabled = (check: boolean) => {
    if (!check) {
      form.setFieldsValue({
        allowQueryWhenLessThanAuditLevel: undefined
      });
    } else {
      if (defaultValue) {
        form.setFieldsValue({
          allowQueryWhenLessThanAuditLevel:
            defaultValue.sqle_config?.sql_query_config
              ?.allow_query_when_less_than_audit_level
        });
      }
    }
  };

  const handleChangeSource = () => {
    form.setFieldsValue({
      instanceType: undefined
    });
  };

  // #if [sqle]
  const {
    loading: getGlobalRuleTemplateListLoading,
    updateGlobalRuleTemplateList,
    globalRuleTemplateList
  } = useGlobalRuleTemplate();

  const templateOptions = useMemo(() => {
    return globalRuleTemplateList.map((v) => ({
      key: v.rule_template_id,
      label: v.rule_template_name,
      value: v.rule_template_name
    }));
  }, [globalRuleTemplateList]);
  // #endif

  useEffect(() => {
    // #if [sqle]
    const updateGlobalRuleTemplateByInstanceType = () => {
      if (!defaultValue?.db_type) {
        updateGlobalRuleTemplateList();
      } else {
        updateGlobalRuleTemplateList(defaultValue.db_type);
      }
    };
    updateGlobalRuleTemplateByInstanceType();
    // #endif

    const resetForm = () => {
      if (isUpdate) {
        form.resetFields([
          'url',
          // #if [sqle]
          'ruleTemplateId',
          'ruleTemplateName',
          'dataExportRuleTemplateId',
          'dataExportRuleTemplateName',
          'workbenchTemplateId',
          'workbenchTemplateName',
          'allowQueryWhenLessThanAuditLevel',
          // #endif
          'syncInterval'
        ]);
      } else {
        form.resetFields();
        // #if [sqle]
        form.setFieldsValue({
          needSqlAuditService: true
        });
        // #endif
      }
      // #if [sqle]
      updateGlobalRuleTemplateByInstanceType();
      // #endif
    };

    EventEmitter.subscribe(EmitterKey.DMS_SYNC_TASK_RESET_FORM, resetForm);

    return () => {
      EventEmitter.unsubscribe(EmitterKey.DMS_SYNC_TASK_RESET_FORM, resetForm);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue?.db_type, form, isUpdate]);

  useEffect(() => {
    if (!!defaultValue) {
      form.setFieldsValue({
        name: defaultValue.name,
        source: defaultValue.source,
        url: defaultValue.url,
        instanceType: defaultValue.db_type,
        // #if [sqle]
        needSqlAuditService: !!defaultValue.sqle_config?.audit_enabled,
        ruleTemplateId: defaultValue.sqle_config?.rule_template_id ?? '',
        ruleTemplateName: defaultValue.sqle_config?.rule_template_name ?? '',
        dataExportRuleTemplateId:
          defaultValue.sqle_config?.data_export_rule_template_id ?? '',
        dataExportRuleTemplateName:
          defaultValue.sqle_config?.data_export_rule_template_name ?? '',
        needAuditForSqlQuery:
          !!defaultValue.sqle_config?.sql_query_config?.audit_enabled,
        workbenchTemplateId:
          defaultValue.sqle_config?.sql_query_config?.rule_template_id ?? '',
        workbenchTemplateName:
          defaultValue.sqle_config?.sql_query_config?.rule_template_name ?? '',
        allowQueryWhenLessThanAuditLevel:
          defaultValue.sqle_config?.sql_query_config
            ?.allow_query_when_less_than_audit_level,
        // #endif
        syncInterval: defaultValue.cron_express,
        params: generateFormValueByParams(defaultValue.additional_params ?? [])
      });
    } else {
      // #if [sqle]
      form.setFieldsValue({
        needSqlAuditService: true
      });
      // #endif
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, form]);

  return (
    <Spin spinning={loading} delay={300}>
      <FormStyleWrapper
        colon={false}
        labelAlign="left"
        className="hasTopHeader"
        form={form}
        {...formItemLayout.spaceBetween}
      >
        <FormAreaLineStyleWrapper className="has-border">
          <FormAreaBlockStyleWrapper>
            <FormItemBigTitle>{title}</FormItemBigTitle>
            <FormItemNoLabel
              name="name"
              validateFirst
              rules={[
                {
                  required: true,
                  message: t('common.form.rule.require', {
                    name: t('dmsSyncDataSource.syncTaskForm.name')
                  })
                },
                ...nameRule()
              ]}
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}
            >
              <FormInputBotBorder
                disabled={isUpdate}
                placeholder={t('common.form.placeholder.input', {
                  name: t('dmsSyncDataSource.syncTaskForm.name')
                })}
              ></FormInputBotBorder>
            </FormItemNoLabel>

            <FormItemSubTitle>
              {t('dmsSyncDataSource.syncTaskForm.baseConfig')}
            </FormItemSubTitle>

            <FormItemLabel
              className="has-required-style has-label-tip"
              name="source"
              label={t('dmsSyncDataSource.syncTaskForm.source')}
              rules={[
                {
                  required: true,
                  message: t('common.form.placeholder.select', {
                    name: t('dmsSyncDataSource.syncTaskForm.source')
                  })
                }
              ]}
            >
              <BasicSelect
                disabled={isUpdate}
                allowClear
                loading={getTaskSourceListLoading}
                placeholder={t('common.form.placeholder.select', {
                  name: t('dmsSyncDataSource.syncTaskForm.source')
                })}
                onChange={handleChangeSource}
              >
                {generateTaskSourceSelectOption()}
              </BasicSelect>
            </FormItemLabel>

            <EmptyBox if={!!formParams}>
              <AutoCreatedFormItemByApi params={formParams ?? []} />
            </EmptyBox>

            <FormItemLabel
              className="has-required-style has-label-tip"
              name="url"
              label={
                <CustomLabelContent
                  title={t('dmsSyncDataSource.syncTaskForm.url')}
                  tips={t('dmsSyncDataSource.syncTaskForm.urlTips')}
                />
              }
              rules={[
                {
                  required: true,
                  message: t('common.form.placeholder.input', {
                    name: t('dmsSyncDataSource.syncTaskForm.url')
                  })
                }
              ]}
            >
              <BasicInput
                placeholder={t('common.form.placeholder.input', {
                  name: t('dmsSyncDataSource.syncTaskForm.url')
                })}
              />
            </FormItemLabel>

            <FormItemLabel
              className="has-required-style"
              name="instanceType"
              label={t('dmsSyncDataSource.syncTaskForm.instanceType')}
              rules={[
                {
                  required: true,
                  message: t('common.form.placeholder.select', {
                    name: t('dmsSyncDataSource.syncTaskForm.instanceType')
                  })
                }
              ]}
            >
              <BasicSelect<string>
                disabled={isUpdate}
                allowClear
                loading={getTaskSourceListLoading}
                onChange={handleChangeInstanceType}
                placeholder={t('common.form.placeholder.select', {
                  name: t('dmsSyncDataSource.syncTaskForm.instanceType')
                })}
              >
                {generateTaskSourceDbTypesSelectOption(source)}
              </BasicSelect>
            </FormItemLabel>

            <Alert
              message={
                <div style={{ fontSize: '12px' }}>
                  {t('dmsSyncDataSource.syncTaskForm.helpTips')}
                  <TypedLink
                    to="https://actiontech.github.io/sqle-docs/docs/user-manual/project/instance_syn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('dmsSyncDataSource.pageTitle')}
                  </TypedLink>
                </div>
              }
              type="info"
            />
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>

        {/* #if [sqle] */}
        <FormAreaLineStyleWrapper className="has-border">
          <SqlAuditFields
            getTemplateOptionsLoading={getGlobalRuleTemplateListLoading}
            ruleTemplateOptions={templateOptions}
            onNeedAuditForSqlQueryChange={handleChangeAuditEnabled}
          />
        </FormAreaLineStyleWrapper>
        {/* #endif */}

        <FormAreaLineStyleWrapper>
          <FormAreaBlockStyleWrapper>
            <FormItemSubTitle>
              {t('dmsSyncDataSource.syncTaskForm.cronConfig')}
            </FormItemSubTitle>
            <FormItemLabel
              className="has-required-style has-label-tip"
              name="syncInterval"
              label={
                <CustomLabelContent
                  title={t('dmsSyncDataSource.syncTaskForm.syncInterval')}
                  tips={t('dmsSyncDataSource.syncTaskForm.cronTips')}
                />
              }
              initialValue="0 0 * * *"
              rules={[
                {
                  required: true
                },
                {
                  validator(_, value) {
                    const error = checkCron(value);
                    if (error === '') {
                      return Promise.resolve();
                    }
                    return Promise.reject(t(error));
                  }
                }
              ]}
              {...formItemLayout.fullLine}
            >
              <CronInput />
            </FormItemLabel>
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>
      </FormStyleWrapper>
    </Spin>
  );
};

export default SyncTaskForm;
