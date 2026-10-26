import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Space, message } from 'antd';
import { BasicButton, BasicInput, BasicModal } from '@actiontech/shared';
import { PlusOutlined } from '@actiontech/icons';
import sql_audit_record from '@actiontech/shared/lib/api/sqle/service/sql_audit_record';
import { isExportFileResponse } from '@actiontech/shared/lib/utils/Common';
import type { AxiosResponse } from 'axios';
import {
  MAX_AGGREGATE_EXPORT_CUSTOM_FIELDS,
  MAX_AGGREGATE_EXPORT_FIELD_NAME,
  MAX_AGGREGATE_EXPORT_FIELD_VALUE,
  buildAggregateExportFileNamePreview,
  createEmptyExportCustomFields,
  createExportCustomFieldRow,
  resolveRequestErrorMessage,
  type AggregateExportCustomFieldDraft
} from './index.data';
import type {
  AggregateQuerySnapshot,
  AggregateScopeMode,
  AggregateScopeParams,
  AggregateSummaryView
} from './index.type';
import { AggregateExportModalStyleWrapper } from './style';

export type AggregateExportModalProps = {
  open: boolean;
  onClose: () => void;
  projectName: string;
  scopeParams: AggregateScopeParams | null;
  summary: AggregateSummaryView | null;
  querySnapshot: AggregateQuerySnapshot | null;
  /** 只读摘要展示用 */
  displayMode: AggregateScopeMode;
  displayAuditTimeLabel: string;
  displayScopeDetail: string;
};

/**
 * 导出报表弹窗（AC-EXPORT-003）：零预置自定义字段、最多 5 组、文件名预览与下载接线。
 */
const AggregateExportModal: React.FC<AggregateExportModalProps> = ({
  open,
  onClose,
  projectName,
  scopeParams,
  summary,
  querySnapshot,
  displayMode,
  displayAuditTimeLabel,
  displayScopeDetail
}) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [fields, setFields] = useState<AggregateExportCustomFieldDraft[]>(
    createEmptyExportCustomFields
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      // 每次打开重置为空列表（不预置服务单元/环境）
      setFields(createEmptyExportCustomFields());
      setSubmitting(false);
    }
  }, [open]);

  const fileNamePreview = useMemo(
    () =>
      buildAggregateExportFileNamePreview({
        projectName,
        customFields: fields,
        scopeType: scopeParams?.scope_type ?? displayMode,
        reportTimeFrom: summary?.report_time_from,
        reportTimeTo: summary?.report_time_to
      }),
    [
      projectName,
      fields,
      scopeParams?.scope_type,
      displayMode,
      summary?.report_time_from,
      summary?.report_time_to
    ]
  );

  const canAddField = fields.length < MAX_AGGREGATE_EXPORT_CUSTOM_FIELDS;

  const updateField = useCallback(
    (
      key: string,
      patch: Partial<Pick<AggregateExportCustomFieldDraft, 'name' | 'value'>>
    ) => {
      setFields((prev) =>
        prev.map((row) => (row.key === key ? { ...row, ...patch } : row))
      );
    },
    []
  );

  const removeField = useCallback((key: string) => {
    setFields((prev) => prev.filter((row) => row.key !== key));
  }, []);

  const moveField = useCallback((key: string, direction: -1 | 1) => {
    setFields((prev) => {
      const index = prev.findIndex((row) => row.key === key);
      if (index < 0) {
        return prev;
      }
      const target = index + direction;
      if (target < 0 || target >= prev.length) {
        return prev;
      }
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }, []);

  const addField = useCallback(() => {
    setFields((prev) => {
      if (prev.length >= MAX_AGGREGATE_EXPORT_CUSTOM_FIELDS) {
        return prev;
      }
      return [...prev, createExportCustomFieldRow()];
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (!scopeParams || submitting) {
      return;
    }
    setSubmitting(true);
    const hideLoading = messageApi.loading(
      t('sqlAudit.aggregate.export.downloading'),
      0
    );

    const custom_fields = fields.map((row) => ({
      name: row.name,
      value: row.value
    }));

    sql_audit_record
      .exportSQLAuditRecordAggregateV1({
        project_name: scopeParams.project_name,
        scope_type: scopeParams.scope_type,
        filter_create_time_from: scopeParams.filter_create_time_from,
        filter_create_time_to: scopeParams.filter_create_time_to,
        filter_instance_id: scopeParams.filter_instance_id,
        filter_audit_tag_ids: scopeParams.filter_audit_tag_ids,
        filter_audit_record_ids: scopeParams.filter_audit_record_ids,
        custom_fields
      })
      .then((res) => {
        const axiosRes = res as AxiosResponse;
        if (isExportFileResponse(axiosRes)) {
          messageApi.success(t('sqlAudit.aggregate.export.downloadSuccess'));
          onClose();
          return;
        }
        // 业务错误已由 ApiBase 全局通知；此处补一条可执行提示
        messageApi.error(t('sqlAudit.aggregate.export.downloadFailed'));
      })
      .catch((err: unknown) => {
        messageApi.error(
          resolveRequestErrorMessage(
            err,
            t('sqlAudit.aggregate.export.downloadFailed')
          )
        );
      })
      .finally(() => {
        hideLoading();
        setSubmitting(false);
      });
  }, [scopeParams, submitting, fields, messageApi, t, onClose]);

  const modeLabel = t(`sqlAudit.aggregate.scopeMode.${displayMode}`);
  const scopeDetailLabel =
    displayMode === 'records'
      ? t('sqlAudit.aggregate.reportScope.recordCount')
      : t('sqlAudit.aggregate.reportScope.instanceAndTags');
  const recordCount =
    querySnapshot?.mode === 'records' ? querySnapshot.recordCount : undefined;

  return (
    <>
      {messageContextHolder}
      <BasicModal
        open={open}
        title={t('sqlAudit.aggregate.export.title')}
        width={640}
        onCancel={submitting ? undefined : onClose}
        destroyOnClose
        maskClosable={!submitting}
        data-testid="sql-audit-aggregate-export-modal"
        footer={
          <Space>
            <BasicButton onClick={onClose} disabled={submitting}>
              {t('common.cancel')}
            </BasicButton>
            <BasicButton
              type="primary"
              loading={submitting}
              disabled={!scopeParams || submitting}
              onClick={handleConfirm}
              data-testid="sql-audit-aggregate-export-confirm"
            >
              {t('sqlAudit.aggregate.export.confirm')}
            </BasicButton>
          </Space>
        }
      >
        <AggregateExportModalStyleWrapper>
          <div
            className="export-meta"
            data-testid="sql-audit-aggregate-export-meta"
          >
            <div className="export-meta-item">
              <span className="export-meta-label">
                {t('sqlAudit.aggregate.reportScope.project')}
              </span>
              <span className="export-meta-value">{projectName}</span>
            </div>
            <div className="export-meta-item">
              <span className="export-meta-label">
                {t('sqlAudit.aggregate.reportScope.mode')}
              </span>
              <span className="export-meta-value">{modeLabel}</span>
            </div>
            <div className="export-meta-item">
              <span className="export-meta-label">
                {t('sqlAudit.aggregate.export.reportTime')}
              </span>
              <span className="export-meta-value">
                {displayAuditTimeLabel ||
                  t('sqlAudit.aggregate.overview.placeholder')}
              </span>
            </div>
            <div className="export-meta-item">
              <span className="export-meta-label">{scopeDetailLabel}</span>
              <span className="export-meta-value">
                {displayMode === 'records'
                  ? t('sqlAudit.aggregate.reportScope.recordCountValue', {
                      count: recordCount ?? 0
                    })
                  : displayScopeDetail}
              </span>
            </div>
          </div>

          <div className="export-fields-header">
            <span className="export-fields-title">
              {t('sqlAudit.aggregate.export.customFieldsTitle')}
            </span>
            <BasicButton
              size="small"
              disabled={!canAddField || submitting}
              onClick={addField}
              icon={
                <PlusOutlined color="currentColor" width={10} height={10} />
              }
              data-testid="sql-audit-aggregate-export-add-field"
            >
              {t('sqlAudit.aggregate.export.addField')}
            </BasicButton>
          </div>
          <p className="export-fields-hint">
            {t('sqlAudit.aggregate.export.customFieldsHint', {
              max: MAX_AGGREGATE_EXPORT_CUSTOM_FIELDS
            })}
          </p>

          {fields.length === 0 ? (
            <div
              className="export-fields-empty"
              data-testid="sql-audit-aggregate-export-fields-empty"
            >
              {t('sqlAudit.aggregate.export.customFieldsEmpty')}
            </div>
          ) : (
            <div data-testid="sql-audit-aggregate-export-fields">
              {fields.map((row, index) => (
                <div
                  className="export-field-row"
                  key={row.key}
                  data-testid={`sql-audit-aggregate-export-field-${index}`}
                >
                  <BasicInput
                    value={row.name}
                    maxLength={MAX_AGGREGATE_EXPORT_FIELD_NAME}
                    placeholder={t(
                      'sqlAudit.aggregate.export.fieldNamePlaceholder'
                    )}
                    disabled={submitting}
                    onChange={(e) =>
                      updateField(row.key, { name: e.target.value })
                    }
                    data-testid={`sql-audit-aggregate-export-field-name-${index}`}
                  />
                  <BasicInput
                    value={row.value}
                    maxLength={MAX_AGGREGATE_EXPORT_FIELD_VALUE}
                    placeholder={t(
                      'sqlAudit.aggregate.export.fieldValuePlaceholder'
                    )}
                    disabled={submitting}
                    onChange={(e) =>
                      updateField(row.key, { value: e.target.value })
                    }
                    data-testid={`sql-audit-aggregate-export-field-value-${index}`}
                  />
                  <div className="export-field-actions">
                    <BasicButton
                      size="small"
                      disabled={index === 0 || submitting}
                      onClick={() => moveField(row.key, -1)}
                      data-testid={`sql-audit-aggregate-export-field-up-${index}`}
                    >
                      {t('sqlAudit.aggregate.export.moveUp')}
                    </BasicButton>
                    <BasicButton
                      size="small"
                      disabled={index === fields.length - 1 || submitting}
                      onClick={() => moveField(row.key, 1)}
                      data-testid={`sql-audit-aggregate-export-field-down-${index}`}
                    >
                      {t('sqlAudit.aggregate.export.moveDown')}
                    </BasicButton>
                    <BasicButton
                      size="small"
                      danger
                      disabled={submitting}
                      onClick={() => removeField(row.key)}
                      data-testid={`sql-audit-aggregate-export-field-remove-${index}`}
                    >
                      {t('sqlAudit.aggregate.export.removeField')}
                    </BasicButton>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            className="export-filename"
            data-testid="sql-audit-aggregate-export-filename"
          >
            <div className="export-filename-label">
              {t('sqlAudit.aggregate.export.filenamePreview')}
            </div>
            <div className="export-filename-value">{fileNamePreview}</div>
          </div>
        </AggregateExportModalStyleWrapper>
      </BasicModal>
    </>
  );
};

export default AggregateExportModal;
