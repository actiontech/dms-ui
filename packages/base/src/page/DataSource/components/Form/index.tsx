import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInstance, Popconfirm, Space, Form } from 'antd';
import { DataSourceFormField, IDataSourceFormProps } from './index.type';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import {
  useCurrentProject,
  useDbServiceDriver,
  useProjectBusinessTips
} from '@actiontech/shared/lib/global';
import {
  BasicInput,
  BasicInputNumber,
  BasicSelect,
  BasicSwitch,
  EmptyBox,
  TypedLink
} from '@actiontech/shared';
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
  FormItemSubTitle,
  CustomLabelContent
} from '@actiontech/shared/lib/components/FormCom';
import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import DatabaseFormItem from './FormItem';
import MaintenanceTimePicker from './MaintenanceTimePicker';
import { turnDataSourceAsyncFormToCommon } from '../../tool';
import { FormItem } from 'sqle/src/components/BackendForm';
import useAsyncParams from 'sqle/src/components/BackendForm/useAsyncParams';
import Select, { BaseOptionType } from 'antd/es/select';
import { useRequest } from 'ahooks';
import { SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import useSqlReviewTemplateToggle from '../../../../hooks/useSqlReviewTemplateToggle';
import classNames from 'classnames';
import { DatabaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';
import useProjectTips from '../../../../hooks/useProjectTips';
import { SQLE_INSTANCE_SOURCE_NAME } from '@actiontech/shared/lib/data/common';
import system from '@actiontech/shared/lib/api/sqle/service/system';
import {
  getSystemModuleStatusDbTypeEnum,
  getSystemModuleStatusModuleNameEnum
} from '@actiontech/shared/lib/api/sqle/service/system/index.enum';
import { ResponseCode } from '@actiontech/shared/lib/enum';

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
  const [currentDBTypeSupportBackup, setCurrentDBTypeSupportBackup] =
    useState<boolean>(false);

  const {
    driverMeta,
    loading: updateDriverListLoading,
    updateDriverList,
    generateDriverSelectOptions
  } = useDbServiceDriver();

  const { updateProjectBusinessTips, projectBusinessOption, isFixedBusiness } =
    useProjectBusinessTips();

  const { updateProjects, projectIDOptions } = useProjectTips();

  const { projectID } = useCurrentProject();

  const project = Form.useWatch('project', props.form);

  const enableBackup = Form.useWatch('enableBackup', props.form);

  const getBackupSupportStatus = useCallback((value: string) => {
    system
      .getSystemModuleStatus({
        db_type: value as getSystemModuleStatusDbTypeEnum,
        module_name: getSystemModuleStatusModuleNameEnum.backup
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setCurrentDBTypeSupportBackup(res.data.data?.is_supported ?? false);
        }
      });
  }, []);

  const databaseTypeChange = useCallback(
    (value: string) => {
      setDatabaseType(value);
      // #if [sqle]
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
      // #endif
      // #if [sqle && ee]
      getBackupSupportStatus(value);
      // #endif
    },
    [props.form, getBackupSupportStatus]
  );
  const { generateFormValueByParams, dmsMergeFromValueIntoParams } =
    useAsyncParams();

  // #if [sqle]
  const { data: ruleTemplateList = [], loading: ruleTemplateLoading } =
    useRequest(
      () => {
        return rule_template
          .getProjectRuleTemplateTipsV1({
            project_name:
              projectIDOptions.find((p) => p.value === project)?.label ?? ''
          })
          .then((res) => res.data.data ?? []);
      },
      {
        refreshDeps: [project],
        ready: !!project && !!projectIDOptions.length
      }
    );
  const {
    data: globalRuleTemplateList = [],
    loading: globalRuleTemplateLoading
  } = useRequest(() =>
    rule_template.getRuleTemplateTipsV1({}).then((res) => res.data.data ?? [])
  );
  const {
    auditRequired,
    auditRequiredPopupVisible,
    onAuditRequiredPopupOpenChange,
    clearRuleTemplate,
    changeAuditRequired
  } = useSqlReviewTemplateToggle<FormInstance<DataSourceFormField>>(props.form);
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
  // #endif

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

  useEffect(() => {
    if (!!props.defaultData) {
      props.form.setFieldsValue({
        name: props.defaultData.name,
        describe: props.defaultData.desc,
        type: props.defaultData.db_type,
        ip: props.defaultData.host,
        port: Number.parseInt(props.defaultData.port ?? ''),
        user: props.defaultData.user,
        params: generateFormValueByParams(
          turnDataSourceAsyncFormToCommon(
            props.defaultData.additional_params ?? []
          )
        ),
        maintenanceTime: props.defaultData.maintenance_times?.map((item) => ({
          startTime: item.maintenance_start_time,
          endTime: item.maintenance_stop_time
        })),
        // #if [sqle]
        needSqlAuditService: !!props.defaultData.sqle_config?.rule_template_id,
        ruleTemplateId: props.defaultData.sqle_config?.rule_template_id,
        ruleTemplateName: props.defaultData.sqle_config?.rule_template_name,
        needAuditForSqlQuery:
          !!props.defaultData.sqle_config?.sql_query_config?.audit_enabled,
        allowQueryWhenLessThanAuditLevel:
          props.defaultData.sqle_config?.sql_query_config
            ?.allow_query_when_less_than_audit_level,
        // #endif
        needUpdatePassword: false,
        business: props.defaultData.business,
        password: props.defaultData.password,
        // #if [dms]
        is_enable_masking: props.defaultData.is_enable_masking,
        // #endif
        // #if [sqle && ee]
        enableBackup: props.defaultData.enable_backup,
        backupMaxRows: props.defaultData.backup_max_rows
        // #endif
      });
      setDatabaseType(props.defaultData.db_type ?? '');
      setAuditEnabled(
        !!props.defaultData.sqle_config?.sql_query_config?.audit_enabled
      );
    } else {
      props.form.setFieldsValue({
        needSqlAuditService: true,
        // #if [dms]
        is_enable_masking: false
        // #endif
      });
      if (params.length > 0) {
        props.form.setFieldsValue({
          params: generateFormValueByParams(params)
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, props.defaultData, props.form]);

  // #if [sqle && ee]
  useEffect(() => {
    if (props.defaultData?.db_type) {
      getBackupSupportStatus(props.defaultData?.db_type);
    }
  }, [props.defaultData?.db_type, getBackupSupportStatus]);
  // #endif

  const reset = useCallback(() => {
    EventEmitter.emit(EmitterKey.Reset_Test_Data_Source_Connect);
    props.form.resetFields();
    setAuditEnabled(false);
    setDatabaseType('');
  }, [props.form]);

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
    updateDriverList();
    updateProjects();
  }, [updateDriverList, updateProjects]);

  // #if [ee]
  useEffect(() => {
    if (project) {
      updateProjectBusinessTips(project);
    }
  }, [updateProjectBusinessTips, project]);
  // #endif

  useEffect(() => {
    if (projectID) {
      props.form.setFieldValue('project', projectID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectID]);

  const hasBorder = () => {
    let border = false;
    // #if [dms]
    border = true;
    // #endif
    return border;
  };

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
            <Icon component={DatabaseFilled} className="title-icon" />
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
            label={t('dmsDataSource.dataSourceForm.project')}
            name="project"
            rules={[{ required: true }]}
            className="has-required-style"
          >
            <BasicSelect options={projectIDOptions} disabled={!!projectID} />
          </FormItemLabel>
          <FormItemLabel
            label={t('dmsDataSource.dataSourceForm.describe')}
            name="describe"
            {...formItemLayout.spaceBetween}
          >
            <BasicInput.TextArea
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
            updateDriverListLoading={updateDriverListLoading}
            currentAsyncParams={params}
            isExternalInstance={isExternalInstance}
          />
          <EmptyBox
            if={isFixedBusiness}
            defaultNode={
              <FormItemLabel
                className="has-required-style"
                label={t('dmsDataSource.dataSourceForm.business')}
                name="business"
                rules={[{ required: true }]}
              >
                <BasicInput disabled={!project} />
              </FormItemLabel>
            }
          >
            <FormItemLabel
              className="has-required-style"
              label={t('dmsDataSource.dataSourceForm.business')}
              name="business"
              rules={[{ required: true }]}
            >
              <BasicSelect
                options={projectBusinessOption()}
                disabled={!project}
              />
            </FormItemLabel>
          </EmptyBox>
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
      {/* #if [sqle] */}
      <FormAreaLineStyleWrapper
        className={classNames({ 'has-border': hasBorder() })}
      >
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
      {/* #endif */}

      {/* #if [sqle && ee] */}
      <EmptyBox if={currentDBTypeSupportBackup}>
        <FormAreaLineStyleWrapper>
          <FormAreaBlockStyleWrapper>
            <FormItemSubTitle>
              {t('dmsDataSource.dataSourceForm.sqlBackupConfiguration')}
            </FormItemSubTitle>
            <FormItemLabel
              className="has-label-tip"
              label={
                <CustomLabelContent
                  title={t(
                    'dmsDataSource.dataSourceForm.enableDataSourceBackup'
                  )}
                  tips={t(
                    'dmsDataSource.dataSourceForm.enableDataSourceBackupTips'
                  )}
                />
              }
              name="enableBackup"
              valuePropName="checked"
            >
              <BasicSwitch />
            </FormItemLabel>
            <EmptyBox if={enableBackup}>
              <FormItemLabel
                className="has-label-tip has-required-style"
                label={
                  <CustomLabelContent
                    title={t('dmsDataSource.dataSourceForm.lineNumberLimit')}
                    tips={t('dmsDataSource.dataSourceForm.lineNumberLimitTips')}
                  />
                }
                name="backupMaxRows"
                initialValue={1000}
                rules={[
                  {
                    required: true,
                    message: t('common.form.placeholder.input', {
                      name: t('dmsDataSource.dataSourceForm.lineNumberLimit')
                    })
                  }
                ]}
              >
                <BasicInputNumber
                  min={0}
                  placeholder={t('common.form.placeholder.input', {
                    name: t('dmsDataSource.dataSourceForm.lineNumberLimit')
                  })}
                />
              </FormItemLabel>
            </EmptyBox>
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>
      </EmptyBox>
      {/* #endif */}

      {/* #if [dms] */}
      <FormAreaLineStyleWrapper>
        <FormAreaBlockStyleWrapper>
          <FormItemSubTitle>
            {t('dmsDataSource.dataSourceForm.dataMaskConfig')}
          </FormItemSubTitle>
          <FormItemLabel
            className="has-label-tip"
            label={
              <div className="label-cont-custom">
                <div>
                  {t('dmsDataSource.dataSourceForm.dataMaskConfigLabel')}
                </div>
                <EmptyBox if={!!project}>
                  <div className="tip-content-box">
                    <Space>
                      {t('dmsDataSource.dataSourceForm.dataMaskConfigTips')}
                      <TypedLink
                        // todo provision 路由，后续处理
                        to={`/project/${project}/data-mask-rule-overview`}
                        target="_blank"
                      >
                        {t('dmsDataSource.dataSourceForm.checkDataMaskButton')}
                      </TypedLink>
                    </Space>
                  </div>
                </EmptyBox>
              </div>
            }
            name="is_enable_masking"
            valuePropName="checked"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 11, push: 1 }}
          >
            <BasicSwitch />
          </FormItemLabel>
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
      {/* #endif */}
    </FormStyleWrapper>
  );
};

export default DataSourceForm;
