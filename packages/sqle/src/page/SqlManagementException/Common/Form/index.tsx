import { Alert, Form, Radio, Space, FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  SqlManagementExceptionFormFieldType,
  SqlManagementExceptionFormProps
} from '../../index.type';
import {
  BlacklistResV1RuleScopeModeEnum,
  CreateBlacklistReqV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { DrawerFormLayout } from '@actiontech/shared/lib/data/common';
import {
  BasicInput,
  EmptyBox,
  BasicSelect,
  BasicButton
} from '@actiontech/shared';
import {
  SqlManagementExceptionExtendedMatchTypeOptions,
  SqlManagementExceptionBaseMatchTypeOptions,
  SqlManagementExceptionRuleScopeModeOptions
} from '../../index.data';
import useInstance from '../../../../hooks/useInstance';
import { useCallback, useEffect, useMemo } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  WarningFilled,
  MinusCircleOutlined,
  PlusOutlined
} from '@actiontech/icons';
import useRuleTips from '../../../../hooks/useRuleTips';
import { MatchRow, validateMatchRows } from '../../../RuleException/utils';
import useAuditTaskSelectOptions from '../../hooks/useAuditTaskSelectOptions';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { SqlManagementExceptionFormStyleWrapper } from './style';

type MatchRowContentFieldProps = {
  form: FormInstance<SqlManagementExceptionFormFieldType>;
  fieldName: number;
  loading: boolean;
  instanceIDOptions: ReturnType<typeof useInstance>['instanceIDOptions'];
  auditTaskTypeOptions: ReturnType<
    typeof useAuditTaskSelectOptions
  >['auditTaskTypeOptions'];
  getAuditTaskIdOptions: ReturnType<
    typeof useAuditTaskSelectOptions
  >['getAuditTaskIdOptions'];
  auditTaskTypeLoading: boolean;
  auditTaskIdLoading: boolean;
  selectedAuditTaskType?: string;
  clearAuditTaskIdRows: () => void;
  dbTypeOptions: Array<{ label: string; value: string }>;
};

const MATCH_ROW_CONTENT_WIDTH = 320;

const MatchRowSqlContentInput: React.FC<{
  form: FormInstance<SqlManagementExceptionFormFieldType>;
  fieldName: number;
}> = ({ form, fieldName }) => {
  const { t } = useTranslation();
  const content =
    Form.useWatch(['match_rows', fieldName, 'content'], form) ?? '';
  const hasNewlines = content.includes('\n');
  const lineCount = content.split('\n').length;

  return (
    <Form.Item
      name={[fieldName, 'content']}
      rules={[{ required: true }]}
      noStyle
    >
      <BasicInput.TextArea
        aria-label={t('sqlManagementException.modal.sql')}
        className={
          hasNewlines
            ? undefined
            : 'match-row-content-single-line textarea-no-resize'
        }
        style={{
          width: MATCH_ROW_CONTENT_WIDTH,
          ...(hasNewlines ? { resize: 'vertical' } : undefined)
        }}
        rows={hasNewlines ? Math.max(lineCount, 2) : 1}
        placeholder={t('common.form.placeholder.input')}
      />
    </Form.Item>
  );
};

const MatchRowContentField: React.FC<MatchRowContentFieldProps> = ({
  form,
  fieldName,
  loading,
  instanceIDOptions,
  auditTaskTypeOptions,
  getAuditTaskIdOptions,
  auditTaskTypeLoading,
  auditTaskIdLoading,
  selectedAuditTaskType,
  clearAuditTaskIdRows,
  dbTypeOptions
}) => {
  const { t } = useTranslation();
  const type = Form.useWatch(['match_rows', fieldName, 'type'], form);

  if (type === CreateBlacklistReqV1TypeEnum.instance) {
    return (
      <Form.Item
        name={[fieldName, 'content']}
        rules={[{ required: true }]}
        noStyle
      >
        <BasicSelect
          style={{ width: MATCH_ROW_CONTENT_WIDTH }}
          loading={loading}
          options={instanceIDOptions}
          placeholder={t('common.form.placeholder.select')}
        />
      </Form.Item>
    );
  }

  if (type === MatchConditionReqV1TypeEnum.audit_task_type) {
    return (
      <Form.Item
        name={[fieldName, 'content']}
        rules={[{ required: true }]}
        noStyle
      >
        <BasicSelect
          style={{ width: MATCH_ROW_CONTENT_WIDTH }}
          loading={auditTaskTypeLoading}
          options={auditTaskTypeOptions}
          placeholder={t('common.form.placeholder.select')}
          onChange={clearAuditTaskIdRows}
        />
      </Form.Item>
    );
  }

  if (type === MatchConditionReqV1TypeEnum.audit_task_id) {
    return (
      <Form.Item
        name={[fieldName, 'content']}
        rules={[{ required: true }]}
        noStyle
      >
        <BasicSelect
          style={{ width: MATCH_ROW_CONTENT_WIDTH }}
          loading={auditTaskIdLoading}
          options={getAuditTaskIdOptions(selectedAuditTaskType)}
          placeholder={t('common.form.placeholder.select')}
        />
      </Form.Item>
    );
  }

  if (type === MatchConditionReqV1TypeEnum.db_type) {
    return (
      <Form.Item
        name={[fieldName, 'content']}
        rules={[{ required: true }]}
        noStyle
      >
        <BasicSelect
          style={{ width: MATCH_ROW_CONTENT_WIDTH }}
          options={dbTypeOptions}
          placeholder={t('common.form.placeholder.select')}
        />
      </Form.Item>
    );
  }

  if (
    type === CreateBlacklistReqV1TypeEnum.sql ||
    type === CreateBlacklistReqV1TypeEnum.fp_sql
  ) {
    return <MatchRowSqlContentInput form={form} fieldName={fieldName} />;
  }

  return (
    <Form.Item
      name={[fieldName, 'content']}
      rules={[{ required: true }]}
      noStyle
    >
      <BasicInput
        style={{ width: MATCH_ROW_CONTENT_WIDTH }}
        placeholder={t('common.form.placeholder.input')}
      />
    </Form.Item>
  );
};

const SqlManagementExceptionForm: React.FC<SqlManagementExceptionFormProps> = ({
  form,
  isUpdate
}) => {
  const { t } = useTranslation();

  const ruleScopeMode = Form.useWatch('rule_scope_mode', form);
  const ruleScopeDbType = Form.useWatch('rule_scope_db_type', form);

  const { updateInstanceList, instanceIDOptions, loading } = useInstance();
  const {
    updateRuleTips,
    generateFlatRuleOptionsByDbType,
    dbTypeOptions,
    loading: ruleTipsLoading
  } = useRuleTips();

  const { projectName } = useCurrentProject();

  const matchRows = Form.useWatch('match_rows', form);

  const {
    auditTaskTypeOptions,
    getAuditTaskIdOptions,
    auditTaskTypeLoading,
    auditTaskIdLoading
  } = useAuditTaskSelectOptions(projectName);

  const selectedAuditTaskType = useMemo(() => {
    return matchRows?.find(
      (row: MatchRow) =>
        row?.type === MatchConditionReqV1TypeEnum.audit_task_type
    )?.content;
  }, [matchRows]);

  const filteredRuleOptions = useMemo(
    () => generateFlatRuleOptionsByDbType(ruleScopeDbType),
    [generateFlatRuleOptionsByDbType, ruleScopeDbType]
  );

  const clearAuditTaskIdRows = useCallback(() => {
    const rows: MatchRow[] = form.getFieldValue('match_rows') ?? [];
    const nextRows = rows.map((row) =>
      row?.type === MatchConditionReqV1TypeEnum.audit_task_id
        ? { ...row, content: undefined }
        : row
    );
    form.setFieldsValue({ match_rows: nextRows });
  }, [form]);

  const clearRuleScopeFields = useCallback(() => {
    form.setFieldsValue({
      rule_scope_db_type: undefined,
      rule_scope: []
    });
  }, [form]);

  const handleRuleScopeDbTypeChange = useCallback(() => {
    form.setFieldValue('rule_scope', []);
  }, [form]);

  useEffect(() => {
    updateInstanceList({
      project_name: projectName,
      functional_module: getInstanceTipListV1FunctionalModuleEnum.sql_manage
    });
    updateRuleTips(projectName);
  }, [updateInstanceList, updateRuleTips, projectName]);

  useEffect(() => {
    if (ruleScopeMode !== BlacklistResV1RuleScopeModeEnum.specific) {
      clearRuleScopeFields();
    }
  }, [clearRuleScopeFields, ruleScopeMode]);

  return (
    <SqlManagementExceptionFormStyleWrapper>
      <Form
        form={form}
        layout="vertical"
        {...DrawerFormLayout}
        initialValues={{
          rule_scope_mode: BlacklistResV1RuleScopeModeEnum.all,
          match_rows: [{ type: CreateBlacklistReqV1TypeEnum.sql, content: '' }]
        }}
      >
        <Form.Item label={t('ruleException.table.matchMode')} required>
          <Form.List
            name="match_rows"
            rules={[
              {
                validator: async (_, rows) => {
                  const errorCode = validateMatchRows(rows);
                  if (errorCode === 'empty') {
                    return Promise.reject(
                      new Error(
                        t('ruleException.form.validation.atLeastOneRow')
                      )
                    );
                  }
                  if (errorCode === 'invalidFirstType') {
                    return Promise.reject(
                      new Error(
                        t('ruleException.form.validation.invalidFirstRowType')
                      )
                    );
                  }
                  if (errorCode === 'duplicate') {
                    return Promise.reject(
                      new Error(t('ruleException.form.validation.duplicateRow'))
                    );
                  }
                  if (errorCode === 'incomplete') {
                    return Promise.reject(
                      new Error(
                        t('ruleException.form.validation.incompleteRow')
                      )
                    );
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            {(fields, { add, remove }) => (
              <Space
                direction="vertical"
                size={12}
                className="full-width-element"
              >
                {fields.map((field, index) => (
                  <Space key={field.key} align="start" className="match-row">
                    <Form.Item
                      {...field}
                      name={[field.name, 'type']}
                      rules={[{ required: true }]}
                    >
                      <BasicSelect
                        style={{ width: 180 }}
                        options={
                          index === 0
                            ? SqlManagementExceptionBaseMatchTypeOptions
                            : SqlManagementExceptionExtendedMatchTypeOptions
                        }
                      />
                    </Form.Item>
                    <MatchRowContentField
                      form={form}
                      fieldName={field.name}
                      loading={loading}
                      instanceIDOptions={instanceIDOptions}
                      auditTaskTypeOptions={auditTaskTypeOptions}
                      getAuditTaskIdOptions={getAuditTaskIdOptions}
                      auditTaskTypeLoading={auditTaskTypeLoading}
                      auditTaskIdLoading={auditTaskIdLoading}
                      selectedAuditTaskType={selectedAuditTaskType}
                      clearAuditTaskIdRows={clearAuditTaskIdRows}
                      dbTypeOptions={dbTypeOptions}
                    />
                    <EmptyBox if={fields.length > 1}>
                      <MinusCircleOutlined
                        className="pointer"
                        onClick={() => remove(field.name)}
                      />
                    </EmptyBox>
                  </Space>
                ))}
                <BasicButton
                  type="dashed"
                  icon={
                    <PlusOutlined width={10} height={10} color="currentColor" />
                  }
                  onClick={() =>
                    add({
                      type: MatchConditionReqV1TypeEnum.instance,
                      content: ''
                    })
                  }
                >
                  {t('ruleException.form.addCondition')}
                </BasicButton>
              </Space>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item label={t('ruleException.form.reason')} name="desc">
          <BasicInput.TextArea
            className="textarea-no-resize"
            autoSize={{
              minRows: 3,
              maxRows: 10
            }}
            placeholder={t('common.form.placeholder.input')}
          />
        </Form.Item>

        <Form.Item
          label={t('ruleException.form.ruleScopeMode')}
          name="rule_scope_mode"
        >
          <Radio.Group options={SqlManagementExceptionRuleScopeModeOptions} />
        </Form.Item>
        <EmptyBox
          if={ruleScopeMode === BlacklistResV1RuleScopeModeEnum.specific}
        >
          <Form.Item
            label={t('ruleException.form.selectDbType')}
            name="rule_scope_db_type"
            rules={[{ required: true }]}
          >
            <BasicSelect
              loading={ruleTipsLoading}
              options={dbTypeOptions}
              placeholder={t('common.form.placeholder.select')}
              onChange={handleRuleScopeDbTypeChange}
            />
          </Form.Item>
          <Form.Item
            label={t('ruleException.form.selectRules')}
            name="rule_scope"
            rules={[{ required: true, type: 'array', min: 1 }]}
          >
            <BasicSelect
              mode="multiple"
              loading={ruleTipsLoading}
              disabled={!ruleScopeDbType}
              options={filteredRuleOptions}
              placeholder={t('common.form.placeholder.select')}
            />
          </Form.Item>
        </EmptyBox>
        <EmptyBox if={isUpdate}>
          <Alert
            showIcon
            icon={<WarningFilled />}
            message={t('sqlManagementException.modal.update.tips')}
            type="warning"
          />
        </EmptyBox>
      </Form>
    </SqlManagementExceptionFormStyleWrapper>
  );
};

export default SqlManagementExceptionForm;
