import { useTranslation } from 'react-i18next';
import { useMemo, useEffect, useContext } from 'react';

import { BasicSelect } from '@actiontech/shared';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { DataSourceProps } from './index.type';

import { ResponseCode } from '../../../../data/common';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import { IGetInstanceTipListV1Params } from '@actiontech/shared/lib/api/sqle/service/instance/index.d';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import useInstance from '../../../../hooks/useInstance';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import useInstanceSchema from '../../../../hooks/useInstanceSchema';

import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { FormSubmitStatusContext } from '..';

const DataSource = (props: DataSourceProps) => {
  const { t } = useTranslation();

  const { form, defaultValue, dataSource, projectName } = props;
  const submitLoading = useContext(FormSubmitStatusContext);

  const { updateDriverNameList, generateDriverSelectOptions } =
    useDatabaseType();

  const getInstanceParams = useMemo<IGetInstanceTipListV1Params>(() => {
    const params: IGetInstanceTipListV1Params = {
      project_name: projectName,
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_audit_plan
    };
    if (!!defaultValue) {
      params.filter_db_type = defaultValue.audit_plan_db_type ?? undefined;
    }
    return params;
  }, [defaultValue, projectName]);

  const handleDbTypeChange = (dbType: string, resetDataSource = false) => {
    if (resetDataSource) {
      props.dataSourceChange?.('');
      form.setFieldsValue({
        databaseName: undefined
      });
    }
    props.dbTypeChange?.(dbType);
    updateInstanceList({ ...getInstanceParams, filter_db_type: dbType });
  };

  const { updateInstanceList, instanceOptionsNoGroup } = useInstance();

  const handleDataSourceChange = (dataSource: string) => {
    props.dataSourceChange?.(dataSource);
    form.setFieldsValue({
      schema: undefined
    });
    if (!!dataSource) {
      instance
        .getInstanceV2({
          instance_name: dataSource,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            form.setFieldsValue({
              dbType: res.data.data?.db_type ?? undefined
            });
            handleDbTypeChange(res.data.data?.db_type ?? '');
          }
        });
    }
  };

  const { generateInstanceSchemaSelectOption } = useInstanceSchema(
    projectName,
    dataSource
  );

  useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);

  useEffect(() => {
    const refreshInstanceList = () => {
      updateInstanceList(getInstanceParams);
    };

    refreshInstanceList();

    EventEmitter.subscribe(
      EmitterKey.Reset_Audit_Plan_Form_Instance_List,
      refreshInstanceList
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Audit_Plan_Form_Instance_List,
        refreshInstanceList
      );
    };
  }, [getInstanceParams, updateInstanceList]);

  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label={t('auditPlan.planForm.dataSource.dbType')}
        {...formItemLayout.spaceBetween}
        name="dbType"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicSelect
          disabled={submitLoading || !!defaultValue}
          placeholder={t('common.form.placeholder.select')}
          onChange={(dnType) => handleDbTypeChange(dnType, true)}
          allowClear
        >
          {generateDriverSelectOptions()}
        </BasicSelect>
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <div className="label-cont-custom">
            <div>{t('auditPlan.planForm.dataSource.databaseName.label')}</div>
            <div className="tip-content-box">
              {t('auditPlan.planForm.dataSource.databaseName.tip')}
            </div>
          </div>
        }
        {...formItemLayout.spaceBetween}
        name="databaseName"
      >
        <BasicSelect
          allowClear
          showSearch
          disabled={submitLoading}
          onChange={handleDataSourceChange}
          placeholder={t('common.form.placeholder.select')}
          options={instanceOptionsNoGroup}
        ></BasicSelect>
      </FormItemLabel>
      <FormItemLabel
        label={t('auditPlan.planForm.dataSource.schema')}
        {...formItemLayout.spaceBetween}
        name="schema"
      >
        <BasicSelect
          allowClear
          disabled={submitLoading}
          placeholder={t('common.form.placeholder.select')}
        >
          {generateInstanceSchemaSelectOption()}
        </BasicSelect>
      </FormItemLabel>
    </>
  );
};

export default DataSource;
