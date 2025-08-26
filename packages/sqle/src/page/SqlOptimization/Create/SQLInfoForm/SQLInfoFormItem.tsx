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
  useMonacoEditor
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
    instanceList,
    loading: instanceLoading
  } = useInstance();

  useEffect(() => {
    updateInstanceList({
      project_name: projectName,
      functional_module:
        getInstanceTipListV2FunctionalModuleEnum.create_optimization
    });
  }, [projectName, updateInstanceList]);

  const optimizationTypeChange: RadioGroupProps['onChange'] = () => {
    form.setFieldsValue({
      instanceName: undefined,
      instanceSchema: undefined
    });
  };

  const formatSql = async () => {
    const values = await form.getFieldsValue();
    const dbType = instanceList.find(
      (v) => v.instance_name === values.instanceName
    )?.instance_type;
    const sql = formatterSQL(values.sql, dbType);
    form.setFieldsValue({
      sql
    });
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

      <EmptyBox
        if={optimizationType === OptimizationTypeEnum.online}
        defaultNode={
          <>
            <FormItemLabel
              className="has-required-style"
              name="offlineSql"
              label={t('sqlOptimization.create.sqlInfo.form.sql')}
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
              {...formItemLayout.spaceBetween}
            >
              <BasicInput.TextArea
                placeholder={t(
                  'sqlOptimization.create.sqlInfo.form.executionPlanPlaceholder'
                )}
                rows={3}
                disabled={submitLoading}
              />
            </FormItemLabel>

            <FormItemLabel
              name="tableStructure"
              label={t('sqlOptimization.create.sqlInfo.form.tableStructure')}
              {...formItemLayout.spaceBetween}
            >
              <BasicInput.TextArea
                placeholder={t(
                  'sqlOptimization.create.sqlInfo.form.tableStructurePlaceholder'
                )}
                rows={3}
                disabled={submitLoading}
              />
            </FormItemLabel>
          </>
        }
      >
        <DatabaseInfo
          form={form}
          instanceLoading={instanceLoading}
          instanceOptions={instanceOptions}
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
        <Space hidden={uploadType !== UploadTypeEnum.sql}>
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
      </Space>
    </>
  );
};

export default SQLInfoFormItem;
