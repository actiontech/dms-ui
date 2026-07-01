import { Alert, Form, Radio, Space, Typography, FormInstance } from 'antd';
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
  BasicButton,
  SQLRenderer
} from '@actiontech/shared';
import {
  SqlManagementExceptionExtendedMatchTypeOptions,
  SqlManagementExceptionBaseMatchTypeOptions,
  SqlManagementExceptionRuleScopeModeOptions
} from '../../index.data';
import useInstance from '../../../../hooks/useInstance';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
} from '../../../../hooks/useRuleTips';
import { MatchRow, validateMatchRows } from '../../../RuleException/utils';
import useAuditTaskSelectOptions from '../../hooks/useAuditTaskSelectOptions';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { SqlManagementExceptionFormStyleWrapper } from './style';
import { IRuleScopeDisplayV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { PASS_AUDIT_LEVELS } from '../../../../components/AuditResultMessage/auditLevelUtils';

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
const SQL_SNIPPET_COLLAPSED_ROWS = 1;

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

const useMatchRowSqlContentInput = (
  form: FormInstance<SqlManagementExceptionFormFieldType>,
  fieldName: number,
  enabled: boolean
) => {
  const { t } = useTranslation();
  const content =
    Form.useWatch(['match_rows', fieldName, 'content'], form) ?? '';
  const hasNewlines = content.includes('\n');
  const lineCount = content.split('\n').length;
  const [expanded, setExpanded] = useState(false);
  const [isUserEditing, setIsUserEditing] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setExpanded(false);
      setIsUserEditing(false);
      return;
    }
    if (!content) {
      setExpanded(false);
      setIsUserEditing(false);
      return;
    }
    const isEditingSqlField = document.activeElement?.closest(
      '.match-row-sql-editor'
    );
    if (!isEditingSqlField) {
      setExpanded(false);
      setIsUserEditing(false);
    }
  }, [content, enabled]);

  const showSnippet = enabled && !!content && !expanded && !isUserEditing;

  const expandToggle =
    enabled && content ? (
      showSnippet ? (
        <Typography.Link
          className="match-row-sql-expand"
          onClick={() => setExpanded(true)}
        >
          {t('common.expansion')}
        </Typography.Link>
      ) : (
        <Typography.Link
          className="match-row-sql-toggle"
          onClick={() => {
            setExpanded(false);
            setIsUserEditing(false);
          }}
        >
          {t('common.collapse')}
        </Typography.Link>
      )
    ) : null;

  const contentNode = !enabled ? null : showSnippet ? (
    <>
      <Form.Item
        name={[fieldName, 'content']}
        rules={[{ required: true }]}
        hidden
      >
        <BasicInput />
      </Form.Item>
      <div
        className="match-row-sql-snippet"
        style={{ width: MATCH_ROW_CONTENT_WIDTH }}
      >
        <SQLRenderer.Snippet
          sql={content}
          rows={SQL_SNIPPET_COLLAPSED_ROWS}
          showCopyIcon={false}
          tooltip={false}
          highlightSyntax={false}
        />
      </div>
    </>
  ) : (
    <div
      className="match-row-sql-editor"
      style={{ width: MATCH_ROW_CONTENT_WIDTH }}
    >
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
          rows={hasNewlines ? Math.min(Math.max(lineCount, 3), 18) : 1}
          placeholder={t('common.form.placeholder.input')}
          onFocus={() => setIsUserEditing(true)}
        />
      </Form.Item>
    </div>
  );

  return { contentNode, expandToggle };
};

type MatchRowItemProps = MatchRowContentFieldProps & {
  field: { key: React.Key; name: number };
  index: number;
  fieldsLength: number;
  onRemove: (name: number) => void;
};

const MatchRowItem: React.FC<MatchRowItemProps> = ({
  field,
  index,
  fieldsLength,
  onRemove,
  form,
  ...contentFieldProps
}) => {
  const type = Form.useWatch(['match_rows', field.name, 'type'], form);
  const isSqlType =
    type === CreateBlacklistReqV1TypeEnum.sql ||
    type === CreateBlacklistReqV1TypeEnum.fp_sql;
  const { contentNode, expandToggle } = useMatchRowSqlContentInput(
    form,
    field.name,
    isSqlType
  );

  return (
    <Space align="center" className="match-row">
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
      {isSqlType ? (
        contentNode
      ) : (
        <MatchRowContentField
          form={form}
          fieldName={field.name}
          {...contentFieldProps}
        />
      )}
      <Space align="center" size={8} className="match-row-actions">
        <EmptyBox if={fieldsLength > 1}>
          <MinusCircleOutlined
            className="pointer"
            onClick={() => onRemove(field.name)}
          />
        </EmptyBox>
        {expandToggle}
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
  isUpdate,
  triggeredRuleScopeDisplay,
  ruleTipsLoading = false,
  dbTypeOptions = [],
  generateFlatRuleOptionsByDbType = () => [],
  ruleNameDescMap = new Map()
}) => {
  const { t } = useTranslation();

  const ruleScopeMode = Form.useWatch('rule_scope_mode', form);
  const ruleScopeDbType = Form.useWatch('rule_scope_db_type', form);

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

    const flatOptions = generateFlatRuleOptionsByDbType(ruleScopeDbType);

    if (!hasTriggeredRuleContext) {
      return flatOptions;
    }

    const dbType = ruleScopeDbType.trim();
    const triggeredOptions: Array<{ label: React.ReactNode; value: string }> =
      [];
    const otherOptions: Array<{ label: React.ReactNode; value: string }> = [];
    const seenRuleNames = new Set<string>();

    flatOptions.forEach((option) => {
      const value = String(option.value);
      const ruleName = splitRuleTipSelectValue(value);
      seenRuleNames.add(ruleName);
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
      if (!ruleName || seenRuleNames.has(ruleName)) {
        return;
      }
      seenRuleNames.add(ruleName);
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
  }, [form]);

  useEffect(() => {
    updateInstanceList({
      project_name: projectName,
      functional_module: getInstanceTipListV1FunctionalModuleEnum.sql_manage
    });
  }, [updateInstanceList, projectName]);

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
                  <MatchRowItem
                    key={field.key}
                    field={field}
                    index={index}
                    fieldsLength={fields.length}
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
                  />
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

export default SqlManagementExceptionForm;
