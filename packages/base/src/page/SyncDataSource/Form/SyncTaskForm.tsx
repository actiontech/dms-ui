import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';
import { Alert, FormInstance, Popconfirm, Spin } from 'antd';
import { BasicInput, BasicSelect, BasicSwitch } from '@actiontech/shared';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import {
  CustomLabelContent,
  FormInputBotBorder,
  FormItemBigTitle,
  FormItemLabel,
  FormItemNoLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import CronInputCom from '@actiontech/shared/lib/components/CronInput';

import { SyncTaskFormFields, SyncTaskFormProps } from '.';
import useTaskSource from '../../../hooks/useTaskSource';
import { checkCron } from '@actiontech/shared/lib/components/CronInput/useCron/cron.tool';
import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';

// #if [sqle]
import useGlobalRuleTemplate from 'sqle/src/hooks/useGlobalRuleTemplate';
import useRuleTemplate from 'sqle/src/hooks/useRuleTemplate';
import useSqlReviewTemplateToggle from '../../../hooks/useSqlReviewTemplateToggle';
// #endif

const SyncTaskForm: React.FC<SyncTaskFormProps> = ({
  form,
  defaultValue,
  loading = false,
  title,
  projectName
}) => {
  const { t } = useTranslation();

  const isUpdate = useMemo<boolean>(() => !!defaultValue, [defaultValue]);
  const [dbType, setDbType] = useState('');
  const [source, setSource] = useState('');
  const {
    loading: getTaskSourceListLoading,
    updateTaskSourceList,
    generateTaskSourceSelectOption,
    generateTaskSourceDbTypesSelectOption
  } = useTaskSource();

  const dbTypeChange = (type: string) => {
    setDbType(type);
    // #if [sqle]
    form.setFieldsValue({
      ruleTemplateId: undefined,
      ruleTemplateName: undefined
    });
    updateGlobalRuleTemplateList(dbType);
    updateRuleTemplateList(projectName, dbType);
    // #endif
  };

  const sourceChange = (source: string) => {
    setSource(source);
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

  const {
    loading: getRuleTemplateListLoading,
    updateRuleTemplateList,
    ruleTemplateList
  } = useRuleTemplate();

  const changeRuleTemplate = (templateName: string) => {
    form.setFieldsValue({
      ruleTemplateId: [...ruleTemplateList, ...globalRuleTemplateList].find(
        (v) => v.rule_template_name === templateName
      )?.rule_template_id
    });
  };

  const {
    auditRequired,
    auditRequiredPopupVisible,
    onAuditRequiredPopupOpenChange,
    clearRuleTemplate,
    changeAuditRequired
  } = useSqlReviewTemplateToggle<FormInstance<SyncTaskFormFields>>(form);
  // #endif

  useEffect(() => {
    updateTaskSourceList();
    // #if [sqle]
    updateGlobalRuleTemplateList();
    updateRuleTemplateList(projectName);
    // #endif

    const resetForm = () => {
      if (isUpdate) {
        form.resetFields([
          'version',
          'url',
          // #if [sqle]
          'ruleTemplateId',
          'ruleTemplateName',
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
      setDbType('');
      setSource('');
      // #if [sqle]
      updateGlobalRuleTemplateList();
      updateRuleTemplateList(projectName);
      // #endif
    };

    EventEmitter.subscribe(EmitterKey.DMS_SYNC_TASK_RESET_FORM, resetForm);

    return () => {
      EventEmitter.unsubscribe(EmitterKey.DMS_SYNC_TASK_RESET_FORM, resetForm);
    };
  }, [
    dbType,
    form,
    isUpdate,
    projectName,
    // #if [sqle]
    updateGlobalRuleTemplateList,
    updateRuleTemplateList,
    // #endif
    updateTaskSourceList
  ]);

  useEffect(() => {
    if (!!defaultValue) {
      form.setFieldsValue({
        name: defaultValue.name,
        source: defaultValue.source,
        version: defaultValue.version,
        url: defaultValue.url,
        instanceType: defaultValue.db_type,
        // #if [sqle]
        needSqlAuditService: !!defaultValue.sqle_config?.rule_template_id,
        ruleTemplateId: defaultValue.sqle_config?.rule_template_id ?? '',
        ruleTemplateName: defaultValue.sqle_config?.rule_template_name ?? '',
        // #endif
        syncInterval: defaultValue.cron_express
      });
    } else {
      // #if [sqle]
      form.setFieldsValue({
        needSqlAuditService: true
      });
      // #endif
    }
  }, [defaultValue, form]);

  return (
    <Spin spinning={loading}>
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
              label={
                <CustomLabelContent
                  title={t('dmsSyncDataSource.syncTaskForm.source')}
                  tips={t('dmsSyncDataSource.syncTaskForm.sourceTips')}
                />
              }
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
                onChange={sourceChange}
              >
                {generateTaskSourceSelectOption()}
              </BasicSelect>
            </FormItemLabel>

            <FormItemLabel
              className="has-required-style  has-label-tip"
              name="version"
              label={
                <CustomLabelContent
                  title={t('dmsSyncDataSource.syncTaskForm.version')}
                  tips={t('dmsSyncDataSource.syncTaskForm.versionTips')}
                />
              }
              rules={[
                {
                  required: true,
                  message: t('common.form.placeholder.input', {
                    name: t('dmsSyncDataSource.syncTaskForm.version')
                  })
                }
              ]}
            >
              <BasicInput
                placeholder={t('common.form.placeholder.input', {
                  name: t('dmsSyncDataSource.syncTaskForm.version')
                })}
              />
            </FormItemLabel>

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
                onChange={dbTypeChange}
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
                  <Link
                    to="https://actiontech.github.io/sqle-docs/docs/user-manual/project/instance_syn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('dmsSyncDataSource.pageTitle')}
                  </Link>
                </div>
              }
              type="info"
            />
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>

        {/* #if [sqle] */}
        <FormAreaLineStyleWrapper className="has-border">
          <FormAreaBlockStyleWrapper>
            <FormItemSubTitle>
              {t('dmsSyncDataSource.syncTaskForm.sqlConfig')}
            </FormItemSubTitle>
            <FormItemLabel
              label={t('dmsDataSource.dataSourceForm.needAuditSqlService')}
              name="needSqlAuditService"
              valuePropName="checked"
            >
              <Popconfirm
                title={t(
                  'dmsDataSource.dataSourceForm.closeAuditSqlServiceTips'
                )}
                overlayClassName="popconfirm-small"
                open={auditRequiredPopupVisible}
                onOpenChange={onAuditRequiredPopupOpenChange}
                onConfirm={clearRuleTemplate}
              >
                <BasicSwitch
                  checked={auditRequired}
                  onChange={changeAuditRequired}
                />
              </Popconfirm>
            </FormItemLabel>
            <FormItemLabel name="ruleTemplateId" hidden={true}>
              <BasicInput />
            </FormItemLabel>
            <FormItemLabel
              name="ruleTemplateName"
              label={t('dmsSyncDataSource.syncTaskForm.ruleTemplateName')}
              className="has-required-style"
              hidden={!auditRequired}
              rules={[{ required: auditRequired }]}
            >
              <BasicSelect
                allowClear
                loading={
                  getGlobalRuleTemplateListLoading || getRuleTemplateListLoading
                }
                placeholder={t('common.form.placeholder.select', {
                  name: t('dmsSyncDataSource.syncTaskForm.ruleTemplateName')
                })}
                onChange={changeRuleTemplate}
                options={[...ruleTemplateList, ...globalRuleTemplateList].map(
                  (v) => ({
                    key: v.rule_template_id,
                    label: v.rule_template_name,
                    value: v.rule_template_name
                  })
                )}
              />
            </FormItemLabel>
          </FormAreaBlockStyleWrapper>
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
              <CronInputCom />
            </FormItemLabel>
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>
      </FormStyleWrapper>
    </Spin>
  );
};

export default SyncTaskForm;
