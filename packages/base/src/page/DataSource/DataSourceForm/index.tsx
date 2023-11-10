import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInstance, Popconfirm } from 'antd5';
import Select, { BaseOptionType } from 'antd5/es/select';
import { DataSourceFormField, IDataSourceFormProps } from './index.type';
import { useRequest } from 'ahooks';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { BasicInput, BasicSelect, BasicSwitch } from '@actiontech/shared';
import { SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
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
import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import DatabaseFormItem from './DatabaseFormItem';
import MaintenanceTimePicker from './MaintenanceTimePicker';
import { IconInstanceManager } from '../../../icon/sideMenu';
import { SQLE_INSTANCE_SOURCE_NAME } from 'sqle/src/data/common';
import useAsyncParams from 'sqle/src/components/BackendForm/useAsyncParams';
import { turnDataSourceAsyncFormToCommon } from '../tool';
import useDatabaseType from '../../../hooks/useDatabaseType';
import { FormItem } from 'sqle/src/components/BackendForm';
import useAuditRequired from '../../../hooks/useAuditRequired';

const DataSourceForm: React.FC<IDataSourceFormProps> = (props) => {
  const { t } = useTranslation();
  const isExternalInstance = useMemo<boolean>(() => {
    if (!props.defaultData) {
      return false;
    }
    return props.defaultData.source !== SQLE_INSTANCE_SOURCE_NAME;
  }, [props.defaultData]);

  const [auditEnabled, setAuditEnabled] = useState<boolean>(false);
  const [databaseType, setDatabaseType] = useState<string>('');
  const { projectID, projectName } = useCurrentProject();
  const {
    driverMeta,
    loading: getDriverMetaLoading,
    getDriverMeta,
    generateDriverSelectOptions
  } = useDatabaseType();

  const databaseTypeChange = useCallback(
    (value: string) => {
      setDatabaseType(value);
      props.form.setFields([
        {
          name: 'ruleTemplateName',
          value: undefined
        },
        {
          name: 'ruleTemplateId',
          value: undefined
        }
      ]);
    },
    [props.form]
  );

  const { data: ruleTemplateList = [], loading: ruleTemplateLoading } =
    useRequest(() =>
      rule_template
        .getProjectRuleTemplateTipsV1({
          project_name: projectName
        })
        .then((res) => res.data.data ?? [])
    );
  const {
    data: globalRuleTemplateList = [],
    loading: globalRuleTemplateLoading
  } = useRequest(() =>
    rule_template.getRuleTemplateTipsV1({}).then((res) => res.data.data ?? [])
  );
  const { generateFormValueByParams, dmsMergeFromValueIntoParams } =
    useAsyncParams();

  const params = useMemo<FormItem[]>(() => {
    if (!driverMeta || !databaseType) {
      return [];
    }

    const temp = driverMeta.find((item) => item.db_type === databaseType);
    if (!temp) {
      return [];
    }

    return turnDataSourceAsyncFormToCommon(temp.params ?? []);
  }, [databaseType, driverMeta]);

  const {
    auditRequired,
    auditRequiredPopupVisible,
    onAuditRequiredPopupOpenChange,
    clearRuleTemplate,
    changeAuditRequired
  } = useAuditRequired<FormInstance<DataSourceFormField>>(props.form);

  useEffect(() => {
    if (!!props.defaultData) {
      props.form.setFieldsValue({
        name: props.defaultData.name,
        describe: props.defaultData.desc,
        type: props.defaultData.db_type,
        ip: props.defaultData.host,
        port: Number.parseInt(props.defaultData.port ?? ''),
        user: props.defaultData.user,
        ruleTemplateId: props.defaultData.sqle_config?.rule_template_id,
        ruleTemplateName: props.defaultData.sqle_config?.rule_template_name,
        needSqlAuditService: !!props.defaultData.sqle_config?.rule_template_id,
        params: generateFormValueByParams(
          turnDataSourceAsyncFormToCommon(
            props.defaultData.additional_params ?? []
          )
        ),
        maintenanceTime: props.defaultData.maintenance_times?.map((item) => ({
          startTime: item.maintenance_start_time,
          endTime: item.maintenance_stop_time
        })),
        needAuditForSqlQuery:
          !!props.defaultData.sqle_config?.sql_query_config?.audit_enabled,
        allowQueryWhenLessThanAuditLevel:
          props.defaultData.sqle_config?.sql_query_config
            ?.allow_query_when_less_than_audit_level,
        needUpdatePassword: false,
        business: props.defaultData.business,
        password: props.defaultData.password
      });
      setDatabaseType(props.defaultData.db_type ?? '');
      setAuditEnabled(
        !!props.defaultData.sqle_config?.sql_query_config?.audit_enabled
      );
    } else {
      props.form.setFieldsValue({
        needSqlAuditService: true
      });
      if (params.length > 0) {
        props.form.setFieldsValue({
          params: generateFormValueByParams(params)
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, props.defaultData, props.form]);

  const reset = useCallback(() => {
    EventEmitter.emit(EmitterKey.Reset_Test_Data_Source_Connect);
    props.form.resetFields();
    setAuditEnabled(false);
    setDatabaseType('');
  }, [props.form]);

  const changeAuditEnabled = (check: boolean) => {
    setAuditEnabled(check);
    if (!check) {
      props.form.setFieldsValue({
        allowQueryWhenLessThanAuditLevel: undefined
      });
    } else {
      if (props.defaultData) {
        props.form.setFieldsValue({
          allowQueryWhenLessThanAuditLevel:
            props.defaultData.sqle_config?.sql_query_config
              ?.allow_query_when_less_than_audit_level
        });
      }
    }
  };

  const changeRuleTemplate = (value: string, option: BaseOptionType) => {
    props.form.setFieldsValue({
      ruleTemplateId: option.key
    });
  };

  const submit = useCallback(async () => {
    const values = await props.form.validateFields();
    delete values.needSqlAuditService;
    if (values.params) {
      values.asyncParams = dmsMergeFromValueIntoParams(values.params, params);
      delete values.params;
    }

    props.submit(values);
  }, [dmsMergeFromValueIntoParams, params, props]);

  useEffect(() => {
    const { unsubscribe: unsubscribeReset } = EventEmitter.subscribe(
      EmitterKey.DMS_Reset_DataSource_Form,
      reset
    );
    return unsubscribeReset;
  }, [reset]);

  useEffect(() => {
    const { unsubscribe: unsubscribeSubmit } = EventEmitter.subscribe(
      EmitterKey.DMS_Submit_DataSource_Form,
      submit
    );
    return unsubscribeSubmit;
  }, [submit]);

  useEffect(() => {
    getDriverMeta(projectID);
  }, [getDriverMeta, projectID]);

  return (
    <FormStyleWrapper
      form={props.form as FormInstance<DataSourceFormField>}
      colon={false}
      labelAlign="left"
      className={'hasTopHeader'}
      {...formItemLayout.spaceBetween}
    >
      <FormAreaLineStyleWrapper className="has-border">
        <FormAreaBlockStyleWrapper>
          <FormItemBigTitle>
            <IconInstanceManager
              className="title-icon"
              width={32}
              height={32}
            />
            <span>
              {props.isUpdate
                ? t('dmsDataSource.updateDatabase.title')
                : t('dmsDataSource.addDatabase')}
            </span>
          </FormItemBigTitle>
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
              disabled={props.isUpdate}
              placeholder={t('common.form.placeholder.input', {
                name: t('dmsDataSource.dataSourceForm.name')
              })}
            ></FormInputBotBorder>
          </FormItemNoLabel>

          <FormItemSubTitle>
            {t('dmsDataSource.dataSourceForm.baseConfig')}
          </FormItemSubTitle>
          <FormItemLabel
            label={t('dmsDataSource.dataSourceForm.describe')}
            name="describe"
            {...formItemLayout.spaceBetween}
          >
            <BasicInput.TextArea
              disabled={isExternalInstance}
              placeholder={t('common.form.placeholder.input', {
                name: t('dmsDataSource.dataSourceForm.describe')
              })}
            />
          </FormItemLabel>
          <DatabaseFormItem
            isUpdate={props.isUpdate}
            form={props.form}
            databaseTypeChange={databaseTypeChange}
            generateDriverSelectOptions={generateDriverSelectOptions}
            getDriverMetaLoading={getDriverMetaLoading}
            currentAsyncParams={params}
            isExternalInstance={isExternalInstance}
          />
          <FormItemLabel
            className="has-required-style"
            label={t('dmsDataSource.dataSourceForm.business')}
            name="business"
            rules={[{ required: true }]}
          >
            <BasicInput />
          </FormItemLabel>
          <FormItemLabel
            className="has-label-tip"
            label={
              <div className="label-cont-custom">
                <div>{t('dmsDataSource.dataSourceForm.maintenanceTime')}</div>
                <div className="tip-content-box">
                  {t('dmsDataSource.dataSourceForm.maintenanceTimeTips')}
                </div>
              </div>
            }
            name="maintenanceTime"
          >
            <MaintenanceTimePicker />
          </FormItemLabel>
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>

      <FormAreaLineStyleWrapper>
        <FormAreaBlockStyleWrapper>
          <FormItemSubTitle>
            {t('dmsDataSource.dataSourceForm.sqlConfig')}
          </FormItemSubTitle>

          <FormItemLabel
            label={t('dmsDataSource.dataSourceForm.needAuditSqlService')}
            name="needSqlAuditService"
            valuePropName="checked"
          >
            <Popconfirm
              title={t('dmsDataSource.dataSourceForm.closeAuditSqlServiceTips')}
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
            hidden={!auditRequired}
            label={t('dmsDataSource.dataSourceForm.ruleTemplate')}
            name="ruleTemplateName"
            className="has-required-style"
            rules={[{ required: auditRequired }]}
          >
            <BasicSelect
              showSearch
              allowClear
              loading={ruleTemplateLoading || globalRuleTemplateLoading}
              placeholder={t('common.form.placeholder.select', {
                name: t('dmsDataSource.dataSourceForm.ruleTemplate')
              })}
              onChange={changeRuleTemplate}
            >
              {[...ruleTemplateList, ...globalRuleTemplateList]
                .filter((v) =>
                  databaseType ? v.db_type === databaseType : true
                )
                .map((template) => {
                  return (
                    <Select.Option
                      key={template.rule_template_id}
                      value={template.rule_template_name ?? ''}
                    >
                      {template.rule_template_name}
                    </Select.Option>
                  );
                })}
            </BasicSelect>
          </FormItemLabel>
          <FormItemLabel
            label={t('dmsDataSource.dataSourceForm.needAuditForSqlQuery')}
            name="needAuditForSqlQuery"
            valuePropName="checked"
          >
            <BasicSwitch checked={auditEnabled} onChange={changeAuditEnabled} />
          </FormItemLabel>
          <FormItemLabel
            hidden={!auditEnabled}
            label={t(
              'dmsDataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
            )}
            name="allowQueryWhenLessThanAuditLevel"
          >
            <BasicSelect>
              {Object.values(
                SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum
              ).map((v) => {
                return (
                  <Select.Option key={v} value={v}>
                    {v}
                  </Select.Option>
                );
              })}
            </BasicSelect>
          </FormItemLabel>
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
    </FormStyleWrapper>
  );
};

export default DataSourceForm;
