import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SyncTaskFormProps } from '.';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import useGlobalRuleTemplate from 'sqle/src/hooks/useGlobalRuleTemplate';
import { BasicInput, BasicSelect, BasicSwitch } from '@actiontech/shared';
import { checkCron } from '@actiontech/shared/lib/components/CronInput/useCron/cron.tool';
import useTaskSource from '../../../hooks/useTaskSource';
import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import {
  FormInputBotBorder,
  FormItemBigTitle,
  FormItemLabel,
  FormItemNoLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import CronInputCom from '@actiontech/shared/lib/components/CronInput/CronInputCom';
import { Popconfirm, Spin } from 'antd5';
import useRuleTemplate from 'sqle/src/hooks/useRuleTemplate';
import useAuditRequired from '../../../hooks/useAuditRequired';

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

  const dbTypeChange = (type: string) => {
    setDbType(type);
    form.setFieldsValue({
      ruleTemplateId: undefined,
      ruleTemplateName: undefined
    });
    updateGlobalRuleTemplateList(dbType);
    updateRuleTemplateList(projectName, dbType);
  };

  const sourceChange = (source: string) => {
    setSource(source);
    form.setFieldsValue({
      instanceType: undefined
    });
  };

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
  } = useAuditRequired(form);

  useEffect(() => {
    updateTaskSourceList();
    updateGlobalRuleTemplateList();
    updateRuleTemplateList(projectName);

    const resetForm = () => {
      if (isUpdate) {
        form.resetFields([
          'version',
          'url',
          'ruleTemplateId',
          'ruleTemplateName',
          'syncInterval'
        ]);
      } else {
        form.resetFields();
      }
      setDbType('');
      setSource('');
      updateGlobalRuleTemplateList();
      updateRuleTemplateList(projectName);
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
    updateGlobalRuleTemplateList,
    updateRuleTemplateList,
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
        needSqlAuditService: !!defaultValue.sqle_config?.rule_template_id,
        ruleTemplateId: defaultValue.sqle_config?.rule_template_id ?? '',
        ruleTemplateName: defaultValue.sqle_config?.rule_template_name ?? '',
        syncInterval: defaultValue.cron_express
      });
    } else {
      form.setFieldsValue({
        needSqlAuditService: true
      });
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
                    name: t('dmsDataSource.dataSourceForm.name')
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
                  name: t('dmsDataSource.dataSourceForm.name')
                })}
              ></FormInputBotBorder>
            </FormItemNoLabel>

            <FormItemSubTitle>
              {t('dmsSyncDataSource.syncTaskForm.baseConfig')}
            </FormItemSubTitle>

            <FormItemLabel
              className="has-required-style"
              name="source"
              label={t('dmsSyncDataSource.syncTaskForm.source')}
              rules={[{ required: true }]}
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
              className="has-required-style"
              name="version"
              label={t('dmsSyncDataSource.syncTaskForm.version')}
              rules={[{ required: true }]}
            >
              <BasicInput
                placeholder={t('common.form.placeholder.input', {
                  name: t('dmsSyncDataSource.syncTaskForm.version')
                })}
              />
            </FormItemLabel>

            <FormItemLabel
              className="has-required-style"
              name="url"
              label={t('dmsSyncDataSource.syncTaskForm.url')}
              rules={[{ required: true }]}
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
              rules={[{ required: true }]}
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
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>

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

        <FormAreaLineStyleWrapper>
          <FormAreaBlockStyleWrapper>
            <FormItemSubTitle>
              {t('dmsSyncDataSource.syncTaskForm.cronConfig')}
            </FormItemSubTitle>
            <FormItemLabel
              className="has-required-style has-label-tip"
              name="syncInterval"
              label={
                <div className="label-cont-custom">
                  <div>{t('dmsSyncDataSource.syncTaskForm.syncInterval')}</div>
                  <div className="tip-content-box">
                    {t('dmsSyncDataSource.syncTaskForm.cronTips')}
                  </div>
                </div>
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
