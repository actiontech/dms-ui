import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import {
  SqlInfoFormProps,
  OptimizationTypeEnum,
  UploadTypeEnum
} from '../../index.type';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { Form, Space, Radio, RadioGroupProps } from 'antd';
import {
  BasicButton,
  BasicToolTip,
  BasicInput,
  EmptyBox,
  MonacoEditor,
  useMonacoEditor,
  BasicSelect
} from '@actiontech/shared';
import DatabaseInfo from './DatabaseInfo';
import useInstance from '../../../../hooks/useInstance';

import SQLStatementForm from '../SQLStatementForm';
import { getInstanceTipListV2FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import {
  FormatLanguageSupport,
  formatterSQL
} from '@actiontech/shared/lib/utils/FormatterSQL';
import { InfoCircleOutlined } from '@actiontech/icons';
import {
  FormItemLabel,
  CustomLabelContent
} from '@actiontech/shared/lib/components/CustomForm';
import { formItemLayout } from '@actiontech/shared/lib/components/CustomForm/style';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';
import useDatabaseType from '../../../../hooks/useDatabaseType';

const SQLInfoFormItem: React.FC<SqlInfoFormProps> = ({ form, submit }) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const submitLoading = useSelector(
    (state: IReduxState) => state.sqlOptimization.submitLoading
  );

  const optimizationType = Form.useWatch('optimizationType', form);
  const uploadType = Form.useWatch('uploadType', form);

  const { editorDidMount } = useMonacoEditor(form, {
    formName: 'sql'
  });

  const {
    instanceOptions,
    updateInstanceList,
    loading: instanceLoading,
    getInstanceDbType
  } = useInstance();

  const {
    loading: getDriverMetaLoading,
    updateDriverNameList,
    generateDriverSelectOptions
  } = useDatabaseType();

  useEffect(() => {
    if (optimizationType === OptimizationTypeEnum.offline) {
      updateDriverNameList();
    } else if (optimizationType === OptimizationTypeEnum.online) {
      updateInstanceList({
        project_name: projectName,
        functional_module:
          getInstanceTipListV2FunctionalModuleEnum.create_optimization
      });
    }
  }, [projectName, updateInstanceList, updateDriverNameList, optimizationType]);

  const optimizationTypeChange: RadioGroupProps['onChange'] = () => {
    form.setFieldsValue({
      instanceName: undefined,
      instanceSchema: undefined,
      dbType: undefined
    });
  };

  const formatSql = async () => {
    const values = await form.getFieldsValue();
    if (values.optimizationType === OptimizationTypeEnum.online) {
      const sql = formatterSQL(values.sql, values.dbType);
      form.setFieldsValue({
        sql
      });
    } else {
      const sql = formatterSQL(values?.offlineSql ?? '', values.dbType);
      form.setFieldsValue({
        offlineSql: sql
      });
    }
  };

  return (
    <>
      <FormItemLabel
        className="has-required-style has-label-tip"
        name="optimizationType"
        label={
          <CustomLabelContent
            title={t('sqlOptimization.create.sqlInfo.form.optimizationType')}
            tips={t('sqlOptimization.create.sqlInfo.form.optimizationTypeDesc')}
          />
        }
        {...formItemLayout.spaceBetween}
        rules={[
          {
            required: true
          }
        ]}
        initialValue={OptimizationTypeEnum.online}
      >
        <Radio.Group onChange={optimizationTypeChange} disabled={submitLoading}>
          <Radio value={OptimizationTypeEnum.offline}>
            {t('sqlOptimization.create.sqlInfo.form.offlineOptimization')}
          </Radio>
          <Radio value={OptimizationTypeEnum.online}>
            {t('sqlOptimization.create.sqlInfo.form.onlineOptimization')}
          </Radio>
        </Radio.Group>
      </FormItemLabel>
      <FormItemLabel
        hidden={optimizationType === OptimizationTypeEnum.online}
        className="has-required-style"
        name="dbType"
        label={t('sqlAudit.create.sqlInfo.form.dbType')}
        rules={[
          {
            required: optimizationType === OptimizationTypeEnum.offline
          }
        ]}
        {...formItemLayout.spaceBetween}
      >
        <BasicSelect loading={getDriverMetaLoading} disabled={submitLoading}>
          {generateDriverSelectOptions()}
        </BasicSelect>
      </FormItemLabel>
      <EmptyBox
        if={optimizationType === OptimizationTypeEnum.online}
        defaultNode={
          <>
            <FormItemLabel
              className="has-required-style has-label-tip"
              name="offlineSql"
              label={
                <CustomLabelContent
                  title={t('sqlOptimization.create.sqlInfo.form.sql')}
                  tips={t('sqlOptimization.create.simpleSqlTips')}
                />
              }
              {...formItemLayout.fullLine}
              rules={[
                {
                  required: true,
                  message: t('common.form.placeholder.input', {
                    name: t('sqlOptimization.create.sqlInfo.form.sql')
                  })
                }
              ]}
            >
              <MonacoEditor
                width="100%"
                height="400px"
                language="sql"
                onMount={editorDidMount}
                options={{
                  automaticLayout: true,
                  readOnly: submitLoading
                }}
              />
            </FormItemLabel>
            <FormItemLabel
              name="executionPlan"
              label={t('sqlOptimization.create.sqlInfo.form.executionPlan')}
              {...formItemLayout.fullLine}
            >
              <BasicInput.TextArea
                placeholder={t(
                  'sqlOptimization.create.sqlInfo.form.executionPlanPlaceholder'
                )}
                disabled={submitLoading}
                autoSize={{
                  maxRows: 8,
                  minRows: 6
                }}
              />
            </FormItemLabel>

            <FormItemLabel
              name="tableStructure"
              label={t('sqlOptimization.create.sqlInfo.form.tableStructure')}
              {...formItemLayout.fullLine}
            >
              <BasicInput.TextArea
                placeholder={t(
                  'sqlOptimization.create.sqlInfo.form.tableStructurePlaceholder'
                )}
                disabled={submitLoading}
                autoSize={{
                  maxRows: 8,
                  minRows: 6
                }}
              />
            </FormItemLabel>
          </>
        }
      >
        <DatabaseInfo
          form={form}
          instanceLoading={instanceLoading}
          instanceOptions={instanceOptions}
          getInstanceDbType={getInstanceDbType}
        />

        <SQLStatementForm form={form} />
      </EmptyBox>

      <Space size={12}>
        <BasicButton
          className="create-optimization-button"
          onClick={submit}
          type="primary"
          loading={submitLoading}
        >
          {t('sqlOptimization.create.sqlInfo.optimize')}
        </BasicButton>
        <EmptyBox
          if={
            uploadType === UploadTypeEnum.sql ||
            optimizationType === OptimizationTypeEnum.offline
          }
        >
          <Space>
            <BasicButton onClick={formatSql} loading={submitLoading}>
              {t('sqlOptimization.create.sqlInfo.format')}
            </BasicButton>
            <BasicToolTip
              prefixIcon={<InfoCircleOutlined />}
              title={t('sqlOptimization.create.sqlInfo.formatTips', {
                supportType: Object.keys(FormatLanguageSupport).join('、')
              })}
            />
          </Space>
        </EmptyBox>
      </Space>
    </>
  );
};

export default SQLInfoFormItem;
