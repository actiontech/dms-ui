import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';

import Icon from '@ant-design/icons/lib/components/Icon';

import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import {
  FormItemBigTitle,
  FormItemNoLabel,
  FormInputBotBorder,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import {
  FormAreaLineStyleWrapper,
  FormAreaBlockStyleWrapper,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';

import { PlanFormProps } from './index.type';
import DataSource from './DataSource';
import { DataSourceProps } from './DataSource/index.type';
import TaskDetail from './TaskDetail';
import AuditTemplate from './AuditTemplate';
import Cron from './Cron';

import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import useGlobalRuleTemplate from '../../../hooks/useGlobalRuleTemplate';
import useRuleTemplate from '../../../hooks/useRuleTemplate';

import { IAuditPlanParamResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import useAsyncParams from '../../../components/BackendForm/useAsyncParams';
import { PlanFilled } from '@actiontech/icons';

export const FormSubmitStatusContext = React.createContext<boolean>(false);

const PlanForm: React.FC<PlanFormProps> = ({
  form,
  submitLoading,
  ...props
}) => {
  const { t } = useTranslation();

  const [dbType, setDbType] = useState('');
  const [dataSource, setDataSource] = useState('');

  const asyncParamsRef = useRef<IAuditPlanParamResV1[] | undefined>([]);

  const {
    loading: getGlobalRuleTemplateLoading,
    globalRuleTemplateList,
    updateGlobalRuleTemplateList
  } = useGlobalRuleTemplate();
  const {
    loading: getRuleTemplateListLoading,
    ruleTemplateList,
    updateRuleTemplateList
  } = useRuleTemplate();

  const { mergeFromValueIntoParams } = useAsyncParams();

  useEffect(() => {
    const onSubmitForm = async () => {
      const values = await form.validateFields();
      if (values.params && asyncParamsRef.current) {
        const params = values.params;
        delete values.params;
        values.asyncParams = mergeFromValueIntoParams(
          params,
          asyncParamsRef.current
        );
      }
      props.submit(values);
    };
    EventEmitter.subscribe(EmitterKey.Submit_Audit_Plan_Form, onSubmitForm);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Submit_Audit_Plan_Form, onSubmitForm);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValue]);

  useEffect(() => {
    if (props.defaultValue) {
      form.setFieldsValue({
        name: props.defaultValue.audit_plan_name,
        databaseName: props.defaultValue.audit_plan_instance_name,
        schema: props.defaultValue.audit_plan_instance_database,
        cron: props.defaultValue.audit_plan_cron,
        dbType: props.defaultValue.audit_plan_db_type,
        ruleTemplateName: props.defaultValue.rule_template_name
      });
      if (!!props.defaultValue.audit_plan_instance_name) {
        setDataSource(props.defaultValue.audit_plan_instance_name);
      }
      if (!!props.defaultValue.audit_plan_db_type) {
        setDbType(props.defaultValue.audit_plan_db_type);
      }
    }
    updateRuleTemplateList(props.projectName);
    updateGlobalRuleTemplateList();
  }, [
    form,
    props.defaultValue,
    props.projectName,
    updateGlobalRuleTemplateList,
    updateRuleTemplateList
  ]);

  const resetForm = () => {
    setDataSource('');
    setDbType('');
    EventEmitter.emit(EmitterKey.Reset_Audit_Plan_Form_Instance_List);
    if (!!props.defaultValue) {
      form.resetFields(['databaseName', 'cron', 'schema']);
    } else {
      form.resetFields();
    }
  };

  useEffect(() => {
    const reset = () => {
      resetForm();
    };
    EventEmitter.subscribe(EmitterKey.Rest_Audit_Plan_Form, reset);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Rest_Audit_Plan_Form, reset);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dbTypeChange: DataSourceProps['dbTypeChange'] = (type) => {
    setDbType(type);
    form.setFieldsValue({
      ruleTemplateName: undefined
    });
  };

  return (
    <FormSubmitStatusContext.Provider value={submitLoading}>
      <FormStyleWrapper
        colon={false}
        labelAlign="left"
        className="hasTopHeader"
        form={form}
      >
        <FormAreaLineStyleWrapper className="has-border">
          <FormAreaBlockStyleWrapper>
            <FormItemBigTitle>
              <Icon component={PlanFilled} className="title-icon" />
              <span>{props.title}</span>
            </FormItemBigTitle>
            <FormItemNoLabel
              name="name"
              rules={[
                {
                  required: true,
                  message: t('common.form.placeholder.input', {
                    name: t('auditPlan.create.form.name')
                  })
                },
                ...nameRule()
              ]}
            >
              <FormInputBotBorder
                placeholder={t('common.form.placeholder.input', {
                  name: t('auditPlan.create.form.name')
                })}
                disabled={!!props?.defaultValue || submitLoading}
              ></FormInputBotBorder>
            </FormItemNoLabel>
            <FormItemSubTitle>
              {t('auditPlan.create.subTitle.dataSource')}
            </FormItemSubTitle>
            <DataSource
              dataSource={dataSource}
              form={form}
              dataSourceChange={setDataSource}
              dbTypeChange={dbTypeChange}
              defaultValue={props.defaultValue}
              projectName={props.projectName}
            />
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>
        <FormAreaLineStyleWrapper className="has-border">
          <FormAreaBlockStyleWrapper>
            <FormItemSubTitle>
              {t('auditPlan.create.subTitle.editTaskDetail')}
            </FormItemSubTitle>
            <TaskDetail
              dbType={dbType}
              form={form}
              updateCurrentTypeParams={(value) => {
                asyncParamsRef.current = value;
              }}
              defaultValue={props.defaultValue}
            />
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>
        <FormAreaLineStyleWrapper className="has-border">
          <FormAreaBlockStyleWrapper>
            <FormItemSubTitle>
              {t('auditPlan.create.subTitle.chooseAuditTemplate')}
            </FormItemSubTitle>
            <AuditTemplate
              dbType={dbType}
              templateList={[...ruleTemplateList, ...globalRuleTemplateList]}
              getRuleTemplateListLoading={
                getRuleTemplateListLoading || getGlobalRuleTemplateLoading
              }
            />
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>
        <FormAreaLineStyleWrapper>
          <FormAreaBlockStyleWrapper>
            <FormItemSubTitle>
              {t('auditPlan.create.subTitle.customTaskAuditCycle')}
            </FormItemSubTitle>
            <Cron />
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>
      </FormStyleWrapper>
    </FormSubmitStatusContext.Provider>
  );
};

export default PlanForm;
