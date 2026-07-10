import {
  Alert,
  Form,
  Radio,
  Space,
  FormInstance,
  SelectProps,
  Typography
} from 'antd';
import { useTranslation } from 'react-i18next';
import {
  AuditWhitelistFormFieldType,
  AuditWhitelistFormProps
} from '../index.type';
import {
  AuditWhitelistResV1RuleScopeModeEnum,
  CreateBlacklistReqV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { DrawerFormLayout } from '@actiontech/shared/lib/data/common';
import {
  BasicInput,
  EmptyBox,
  BasicSelect,
  BasicButton,
  BasicToolTips
} from '@actiontech/shared';
import {
  AuditWhitelistAllMatchTypeOptions,
  AuditWhitelistSqlSourceContentOptions,
  SqlManagementExceptionRuleScopeModeOptions
} from '../index.data';
import useInstance from '../../../hooks/useInstance';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  WarningFilled,
  MinusCircleOutlined,
  PlusOutlined,
  CheckCircleFilled,
  InfoHexagonFilled,
  CloseCircleFilled
} from '@actiontech/icons';
import {
  DB_TYPE_RULE_NAME_SEPARATOR,
  splitRuleTipSelectValue
} from '../../../hooks/useRuleTips';
import {
  MatchRow,
  validateAuditWhitelistMatchRows
} from '../../../page/RuleException/utils';
import useAuditTaskSelectOptions from '../hooks/useAuditTaskSelectOptions';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { SqlManagementExceptionFormStyleWrapper } from './style';
import MatchRowSqlContentField from './MatchRowSqlContentField';
import { IRuleScopeDisplayV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { PASS_AUDIT_LEVELS } from '../../../components/AuditResultMessage/auditLevelUtils';

type MatchRowContentFieldProps = {
  form: FormInstance<AuditWhitelistFormFieldType>;
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
  dbTypeOptions: SelectProps['options'];
  dbTypeLoading?: boolean;
};

const MATCH_ROW_CONTENT_WIDTH = 320;

const TriggeredRuleLevelIcon: React.FC<{ level?: string }> = ({ level }) => {
  if (
    !level ||
    PASS_AUDIT_LEVELS.includes(level as (typeof PASS_AUDIT_LEVELS)[number])
  ) {
    return <CheckCircleFilled width={16} height={16} />;
  }
  if (level === 'notice') {
    return <InfoHexagonFilled width={16} height={16} />;
  }
  if (level === 'warn') {
    return <WarningFilled width={16} height={16} />;
  }
  if (level === 'error') {
    return <CloseCircleFilled width={16} height={16} />;
  }
  return null;
};

const TriggeredRuleScopeOptionLabel: React.FC<{
  item: IRuleScopeDisplayV1;
  fallbackLabel?: string;
}> = ({ item, fallbackLabel }) => {
  const label =
    item.rule_desc?.trim() || fallbackLabel?.trim() || item.rule_name || '';

  return (
    <Space size={8}>
      <TriggeredRuleLevelIcon level={item.level} />
      <span>{label}</span>
    </Space>
  );
};

type MatchRowItemProps = MatchRowContentFieldProps & {
  field: { key: React.Key; name: number };
  fieldsLength: number;
  rowIndex: number;
  onRemove: (name: number) => void;
};

const MatchRowItem: React.FC<MatchRowItemProps> = ({
  field,
  fieldsLength,
  rowIndex,
  onRemove,
  form,
  ...contentFieldProps
}) => {
  const { t } = useTranslation();
  const type = Form.useWatch(['match_rows', field.name, 'type'], form);
  const isSqlType =
    type === CreateBlacklistReqV1TypeEnum.sql ||
    type === CreateBlacklistReqV1TypeEnum.fp_sql;
  const sqlModalTitle =
    type === CreateBlacklistReqV1TypeEnum.fp_sql
      ? t('sqlManagementException.matchType.fingerPrint')
      : t('sqlManagementException.modal.sql');
  const matchTypeOptions = AuditWhitelistAllMatchTypeOptions;

  return (
    <Space align="center" className="match-row">
      <Form.Item
        {...field}
        name={[field.name, 'type']}
        rules={[{ required: true }]}
      >
        <BasicSelect style={{ width: 180 }} options={matchTypeOptions} />
      </Form.Item>
      {isSqlType ? (
        <MatchRowSqlContentField
          fieldName={field.name}
          modalTitle={sqlModalTitle}
        />
      ) : (
        <MatchRowContentField form={form} {...contentFieldProps} />
      )}
      <Space align="center" size={8} className="match-row-actions">
        <EmptyBox if={fieldsLength > 1}>
          <MinusCircleOutlined
            className="pointer"
            onClick={() => onRemove(field.name)}
          />
        </EmptyBox>
      </Space>
    </Space>
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
  dbTypeOptions,
  dbTypeLoading = false
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
          loading={dbTypeLoading}
          options={dbTypeOptions}
          placeholder={t('common.form.placeholder.select')}
        />
      </Form.Item>
    );
  }

  if (type === MatchConditionReqV1TypeEnum.sql_source) {
    return (
      <Form.Item
        name={[fieldName, 'content']}
        rules={[{ required: true }]}
        noStyle
      >
        <BasicSelect
          style={{ width: MATCH_ROW_CONTENT_WIDTH }}
          options={AuditWhitelistSqlSourceContentOptions}
          placeholder={t('common.form.placeholder.select')}
        />
      </Form.Item>
    );
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

const RuleExceptionMatchConditionsForm: React.FC<AuditWhitelistFormProps> = ({
  form,
  isUpdate,
  triggeredRuleScopeDisplay,
  savedRuleScopeDisplay,
  ruleScopeLoading = false,
  ruleScopeError,
  onRuleScopeSearch,
  onRuleScopeReload,
  dbTypeReadonly = false,
  dbTypeOptions = [],
  dbTypeLoading = false,
  generateFlatRuleOptionsByDbType = () => [],
  ruleNameDescMap = new Map(),
  submitErrorFields = [],
  onValuesChangeClearError
}) => {
  const { t } = useTranslation();

  const ruleScopeMode = Form.useWatch('rule_scope_mode', form);
  const ruleScopeDbType = Form.useWatch('rule_scope_db_type', form);
  const selectedRuleScope = Form.useWatch('rule_scope', form);

  const { updateInstanceList, instanceIDOptions, loading } = useInstance();

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

  const hasTriggeredRuleContext = !!triggeredRuleScopeDisplay?.length;

  const triggeredRuleByName = useMemo(() => {
    const map = new Map<string, IRuleScopeDisplayV1>();
    triggeredRuleScopeDisplay?.forEach((item) => {
      const ruleName = item.rule_name?.trim();
      if (ruleName) {
        map.set(ruleName, item);
      }
    });
    return map;
  }, [triggeredRuleScopeDisplay]);

  const filteredRuleOptions = useMemo(() => {
    if (!ruleScopeDbType?.trim()) {
      return [];
    }

    const flatOptions = [
      ...generateFlatRuleOptionsByDbType(ruleScopeDbType, savedRuleScopeDisplay)
    ];
    const seenRuleNames = new Set(
      flatOptions.map((option) => splitRuleTipSelectValue(String(option.value)))
    );
    selectedRuleScope?.forEach((value) => {
      const ruleName = splitRuleTipSelectValue(String(value));
      if (!ruleName || seenRuleNames.has(ruleName)) {
        return;
      }
      seenRuleNames.add(ruleName);
      flatOptions.push({
        label: ruleNameDescMap.get(ruleName) ?? ruleName,
        value: `${ruleScopeDbType.trim()}${DB_TYPE_RULE_NAME_SEPARATOR}${ruleName}`
      });
    });

    if (!hasTriggeredRuleContext) {
      return flatOptions.sort((left, right) =>
        String(left.label).localeCompare(String(right.label))
      );
    }

    const dbType = ruleScopeDbType.trim();
    const triggeredOptions: Array<{ label: React.ReactNode; value: string }> =
      [];
    const otherOptions: Array<{ label: React.ReactNode; value: string }> = [];
    const groupedSeenRuleNames = new Set<string>();

    flatOptions.forEach((option) => {
      const value = String(option.value);
      const ruleName = splitRuleTipSelectValue(value);
      groupedSeenRuleNames.add(ruleName);
      const triggeredItem = triggeredRuleByName.get(ruleName);

      const label = triggeredItem ? (
        <TriggeredRuleScopeOptionLabel
          item={triggeredItem}
          fallbackLabel={ruleNameDescMap.get(ruleName)}
        />
      ) : (
        option.label
      );

      if (triggeredItem) {
        triggeredOptions.push({ label, value });
      } else {
        otherOptions.push({ label, value });
      }
    });

    triggeredRuleScopeDisplay?.forEach((item) => {
      const ruleName = item.rule_name?.trim();
      if (!ruleName || groupedSeenRuleNames.has(ruleName)) {
        return;
      }
      groupedSeenRuleNames.add(ruleName);
      triggeredOptions.push({
        label: (
          <TriggeredRuleScopeOptionLabel
            item={item}
            fallbackLabel={ruleNameDescMap.get(ruleName)}
          />
        ),
        value: `${dbType}${DB_TYPE_RULE_NAME_SEPARATOR}${ruleName}`
      });
    });

    const groups: Array<{
      label: string;
      options: Array<{ label: React.ReactNode; value: string }>;
    }> = [];

    if (triggeredOptions.length) {
      groups.push({
        label: t('ruleException.form.triggeredRules'),
        options: triggeredOptions
      });
    }
    if (otherOptions.length) {
      groups.push({
        label: t('ruleException.form.otherRules'),
        options: otherOptions
      });
    }

    return groups;
  }, [
    generateFlatRuleOptionsByDbType,
    hasTriggeredRuleContext,
    ruleNameDescMap,
    ruleScopeDbType,
    savedRuleScopeDisplay,
    selectedRuleScope,
    t,
    triggeredRuleByName,
    triggeredRuleScopeDisplay
  ]);

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
    onRuleScopeSearch?.('');
  }, [form, onRuleScopeSearch]);

  const prevRuleScopeModeRef = useRef<string>();

  useEffect(() => {
    updateInstanceList({
      project_name: projectName,
      functional_module: getInstanceTipListV1FunctionalModuleEnum.sql_manage
    });
  }, [updateInstanceList, projectName]);

  useEffect(() => {
    const currentMode = form.getFieldValue('rule_scope_mode');
    const prevMode = prevRuleScopeModeRef.current;
    prevRuleScopeModeRef.current = currentMode;

    if (
      prevMode === AuditWhitelistResV1RuleScopeModeEnum.specific &&
      currentMode !== AuditWhitelistResV1RuleScopeModeEnum.specific
    ) {
      clearRuleScopeFields();
    }
  }, [clearRuleScopeFields, form, ruleScopeMode]);

  const summaryMessages = useMemo(() => {
    if (!submitErrorFields?.length) {
      return [] as string[];
    }
    const messages: string[] = [];
    submitErrorFields.forEach((field) => {
      if (!field.errors?.length) {
        return;
      }
      const [rootName] = field.name ?? [];
      if (rootName === 'match_rows') {
        return;
      }
      if (rootName === 'rule_scope_db_type') {
        messages.push(
          `${t('ruleException.form.selectDbType')}: ${field.errors[0]}`
        );
        return;
      }
      if (rootName === 'rule_scope') {
        messages.push(
          `${t('ruleException.form.selectRules')}: ${field.errors[0]}`
        );
        return;
      }
      messages.push(field.errors[0]);
    });
    return messages;
  }, [submitErrorFields, t]);

  const handleValuesChange = useCallback(() => {
    onValuesChangeClearError?.();
  }, [onValuesChangeClearError]);

  return (
    <SqlManagementExceptionFormStyleWrapper>
      <Form
        form={form}
        layout="vertical"
        {...DrawerFormLayout}
        onValuesChange={handleValuesChange}
        initialValues={{
          rule_scope_mode: AuditWhitelistResV1RuleScopeModeEnum.all,
          match_rows: [{ type: CreateBlacklistReqV1TypeEnum.sql, content: '' }]
        }}
      >
        <EmptyBox if={summaryMessages.length > 0}>
          <Alert
            className="sql-management-exception-error-summary"
            type="error"
            showIcon
            closable={false}
            message={t('ruleException.form.validation.summaryTitle')}
            description={
              <ul style={{ margin: 0, paddingInlineStart: 20 }}>
                {summaryMessages.map((msg, idx) => (
                  <li key={`${idx}-${msg}`}>{msg}</li>
                ))}
              </ul>
            }
            style={{ marginBottom: 16 }}
          />
        </EmptyBox>
        <Form.Item
          colon={false}
          required
          label={
            <BasicToolTips
              title={t('ruleException.form.matchModeTips')}
              suffixIcon
            >
              <Typography.Text strong>
                {t('ruleException.table.matchMode')}
              </Typography.Text>
            </BasicToolTips>
          }
        >
          <Form.List
            name="match_rows"
            rules={[
              {
                validator: async (_, rows) => {
                  const errorCode = validateAuditWhitelistMatchRows(rows);
                  if (errorCode === 'empty') {
                    return Promise.reject(
                      new Error(
                        t('ruleException.form.validation.atLeastOneRow')
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
            {(fields, { add, remove }, { errors }) => (
              <Space
                direction="vertical"
                size={12}
                className="full-width-element"
              >
                {fields.map((field) => (
                  <MatchRowItem
                    key={field.key}
                    field={field}
                    fieldsLength={fields.length}
                    rowIndex={field.name}
                    onRemove={remove}
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
                    dbTypeLoading={dbTypeLoading}
                  />
                ))}
                <Form.ErrorList errors={errors} />
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

        <Form.Item
          colon={false}
          label={
            <BasicToolTips
              title={t('ruleException.form.ruleScopeModeTips')}
              suffixIcon
            >
              <Typography.Text strong>
                {t('ruleException.form.ruleScopeMode')}
              </Typography.Text>
            </BasicToolTips>
          }
          name="rule_scope_mode"
        >
          <Radio.Group options={SqlManagementExceptionRuleScopeModeOptions} />
        </Form.Item>
        <EmptyBox
          if={ruleScopeMode === AuditWhitelistResV1RuleScopeModeEnum.specific}
        >
          <Form.Item
            label={t('ruleException.form.selectDbType')}
            name="rule_scope_db_type"
            rules={[{ required: true }]}
          >
            <BasicSelect
              loading={dbTypeLoading}
              disabled={dbTypeReadonly}
              options={dbTypeOptions}
              placeholder={t('common.form.placeholder.select')}
              onChange={handleRuleScopeDbTypeChange}
            />
          </Form.Item>
          <EmptyBox if={!!ruleScopeError}>
            <Alert
              type="error"
              showIcon
              message={t('ruleException.form.ruleScopeLoadFailed')}
              action={
                onRuleScopeReload ? (
                  <BasicButton size="small" onClick={onRuleScopeReload}>
                    {t('common.retry')}
                  </BasicButton>
                ) : undefined
              }
              style={{ marginBottom: 16 }}
            />
          </EmptyBox>
          <Form.Item
            label={t('ruleException.form.selectRules')}
            name="rule_scope"
            rules={[{ required: true, type: 'array', min: 1 }]}
          >
            <BasicSelect
              mode="multiple"
              loading={ruleScopeLoading}
              disabled={!ruleScopeDbType || !!ruleScopeError}
              options={filteredRuleOptions}
              showSearch
              filterOption={false}
              onSearch={onRuleScopeSearch}
              placeholder={
                ruleScopeDbType
                  ? t('ruleException.form.ruleScopeSearchPlaceholder')
                  : t('ruleException.form.selectDbTypeFirst')
              }
            />
          </Form.Item>
        </EmptyBox>

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

export default RuleExceptionMatchConditionsForm;
