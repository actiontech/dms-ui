import { useTranslation } from 'react-i18next';
import { useEffect, useMemo } from 'react';
import {
  SqlInfoFormProps,
  OptimizationTypeEnum,
  UploadTypeEnum
} from '../../index.type';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { Form, Space, Radio, RadioGroupProps, Checkbox } from 'antd';
import {
  BasicButton,
  BasicToolTip,
  BasicInput,
  EmptyBox,
  BasicSelect,
  isSupportLanguage,
  FormItemNoLabel,
  BasicSwitch,
  SQL_EDITOR_PLACEHOLDER_VALUE
} from '@actiontech/dms-kit';
import { useMonacoEditor } from '@actiontech/shared';
import DatabaseInfo from './DatabaseInfo';
import useInstance from '../../../../hooks/useInstance';

import SQLStatementForm from '../SQLStatementForm';
import { getInstanceTipListV2FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { FormatLanguageSupport, formatterSQL } from '@actiontech/dms-kit';
import { InfoCircleOutlined } from '@actiontech/icons';
import { FormItemLabel, CustomLabelContent } from '@actiontech/dms-kit';
import { formItemLayout } from '@actiontech/dms-kit/es/components/CustomForm/style';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import { SqlFormatterButtonStyleWrapper } from '../../../SqlExecWorkflow/Common/style';
import classNames from 'classnames';
import CustomMonacoEditor from '../../../../components/CustomMonacoEditor';

const SQLInfoFormItem: React.FC<SqlInfoFormProps> = ({ form, submit }) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const submitLoading = useSelector(
    (state: IReduxState) => state.sqlOptimization.submitLoading
  );

  const optimizationType = Form.useWatch('optimizationType', form);
  const uploadType = Form.useWatch('uploadType', form);
  const dbType = Form.useWatch('dbType', form);
  const formatted = Form.useWatch('formatted', form);
  const originSql = Form.useWatch('originSql', form);

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
      dbType: undefined,
      formatted: undefined,
      originSql: undefined
    });
  };

  const isReadOnlyMode = useMemo(() => {
    return formatted && !isSupportLanguage(dbType);
  }, [formatted, dbType]);

  const formatSql = async () => {
    const values = await form.getFieldsValue();
    const sqlNotDefaultValue =
      !!values.sql && values.sql !== SQL_EDITOR_PLACEHOLDER_VALUE;
    const offlineSqlNotDefaultValue =
      !!values.offlineSql && values.offlineSql !== SQL_EDITOR_PLACEHOLDER_VALUE;
    const sqlContentNotNull = sqlNotDefaultValue || offlineSqlNotDefaultValue;

    if (sqlContentNotNull && dbType) {
      const sqlKey =
        values.optimizationType === OptimizationTypeEnum.online
          ? 'sql'
          : 'offlineSql';
      if (formatted && !isSupportLanguage(dbType)) {
        form.setFieldsValue({
          formatted: false,
          [sqlKey]: originSql
        });
        return;
      }
      const formattedSql = formatterSQL(values[sqlKey] ?? '', values.dbType);
      form.setFieldsValue({
        [sqlKey]: formattedSql,
        originSql: values[sqlKey],
        formatted: true
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
              <CustomMonacoEditor
                width="100%"
                height="400px"
                language="sql"
                onMount={editorDidMount}
                options={{
                  automaticLayout: true,
                  readOnly: submitLoading || isReadOnlyMode
                }}
                showAlert={isReadOnlyMode}
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

        <SQLStatementForm form={form} isReadOnlyMode={isReadOnlyMode} />
      </EmptyBox>
      <FormItemNoLabel name="formatted" hidden valuePropName="checked">
        <BasicSwitch />
      </FormItemNoLabel>
      <FormItemNoLabel name="originSql" hidden>
        <BasicInput />
      </FormItemNoLabel>
      <EmptyBox if={optimizationType === OptimizationTypeEnum.online}>
        <FormItemNoLabel name="enableHighAnalysis" valuePropName="checked">
          <Checkbox className="high-analysis-checkbox">
            <span className="high-analysis-checkbox-label">
              {t('sqlOptimization.create.sqlInfo.enableHighAnalysis')}
            </span>
            <span className="high-analysis-checkbox-tips">
              {t('sqlOptimization.create.sqlInfo.enableHighAnalysisTips')}
            </span>
          </Checkbox>
        </FormItemNoLabel>
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
            <SqlFormatterButtonStyleWrapper
              className={classNames({
                'active-formatter-button': formatted
              })}
              onClick={formatSql}
              loading={submitLoading}
            >
              {t('sqlOptimization.create.sqlInfo.format')}
            </SqlFormatterButtonStyleWrapper>
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
