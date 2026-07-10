import { useCallback, useEffect, useMemo, useState, type Key } from 'react';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { Space, message, Form, Spin } from 'antd';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import AuditWhitelistService from '@actiontech/shared/lib/api/sqle/service/audit_whitelist';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import useDatabaseType from '../../../hooks/useDatabaseType';
import useRuleScopeOptions from '../../../hooks/useRuleScopeOptions';
import { RuleExceptionMatchConditionsForm } from '../../../components/RuleExceptionMatchConditions';
import { AuditWhitelistFormFieldType } from '../index.type';
import {
  auditWhitelistRecordToFormValues,
  formValuesToAuditWhitelistPayload
} from '../utils';
import { RULE_EXCEPTION_CONFLICT_CODE } from '../../RuleException/index.type';
import { useDispatch } from 'react-redux';
import { openWhitelistDetailDrawer } from '../../../store/whitelist';
import { parseConflictAuditWhitelistId } from '../../RuleException/utils';
import { RULE_EXCEPTION_OVERLAY_DRAWER_Z_INDEX } from '../../../components/RuleException/drawerZIndex';
import RuleExceptionOverlayConfigProvider from '../../../components/RuleException/RuleExceptionOverlayConfigProvider';

export type AuditWhitelistFormDrawerMode = 'create' | 'update';

export type AuditWhitelistFormDrawerProps = {
  mode: AuditWhitelistFormDrawerMode;
  open: boolean;
  record?: IAuditWhitelistResV1 | null;
  onClose: () => void;
  onSuccess?: () => void;
  zIndex?: number;
};

const AuditWhitelistFormDrawer: React.FC<AuditWhitelistFormDrawerProps> = ({
  mode,
  open,
  record,
  onClose,
  onSuccess,
  zIndex = RULE_EXCEPTION_OVERLAY_DRAWER_Z_INDEX
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    updateDriverNameList,
    dbTypeOptions,
    loading: dbTypeLoading
  } = useDatabaseType();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [form] = Form.useForm<AuditWhitelistFormFieldType>();
  const { projectName } = useCurrentProject();
  const isUpdate = mode === 'update';

  const ruleScopeDbType = Form.useWatch('rule_scope_db_type', form);

  const {
    loading: ruleScopeLoading,
    error: ruleScopeError,
    reload: reloadRuleScopeOptions,
    searchRules,
    ruleNameDescMap,
    generateFlatRuleOptionsByDbType
  } = useRuleScopeOptions(open ? ruleScopeDbType : undefined);

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const [submitErrorFields, setSubmitErrorFields] = useState<
    Array<{ name: Key[]; errors: string[] }>
  >([]);

  const clearSubmitError = useCallback(() => {
    setSubmitErrorFields((prev) => (prev.length ? [] : prev));
  }, []);

  const handleClose = useCallback(() => {
    form.resetFields();
    setSubmitErrorFields([]);
    onClose();
  }, [form, onClose]);

  const submit = useCallback(async () => {
    let values: AuditWhitelistFormFieldType;
    try {
      values = await form.validateFields();
      setSubmitErrorFields([]);
    } catch (err) {
      const errorInfo = err as {
        errorFields?: Array<{ name: Key[]; errors: string[] }>;
      };
      setSubmitErrorFields(errorInfo?.errorFields ?? []);
      return;
    }
    startSubmit();
    const payload = formValuesToAuditWhitelistPayload(values);

    const request = isUpdate
      ? AuditWhitelistService.UpdateAuditWhitelistByIdV1({
          project_name: projectName,
          audit_whitelist_id: `${record?.audit_whitelist_id}`,
          desc: payload.desc,
          match_conditions: payload.match_conditions,
          rule_scope: payload.rule_scope as string | undefined
        })
      : AuditWhitelistService.createAuditWhitelistV1({
          project_name: projectName,
          desc: payload.desc,
          match_conditions: payload.match_conditions,
          rule_scope: payload.rule_scope as string | undefined
        });

    request
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onSuccess?.();
          EventEmitter.emit(EmitterKey.Refresh_Whitelist_List);
          handleClose();
          messageApi.success(
            isUpdate
              ? t('whitelist.modal.update.success')
              : t('whitelist.modal.add.success')
          );
          return;
        }
        if (res.data.code === RULE_EXCEPTION_CONFLICT_CODE) {
          const conflictId = parseConflictAuditWhitelistId(res.data.message);
          messageApi.warning(t('ruleException.quickAdd.conflict'));
          if (conflictId) {
            dispatch(openWhitelistDetailDrawer(conflictId));
          }
        }
      })
      .finally(() => {
        submitFinish();
      });
  }, [
    form,
    handleClose,
    isUpdate,
    messageApi,
    dispatch,
    onSuccess,
    projectName,
    record?.audit_whitelist_id,
    startSubmit,
    submitFinish,
    t
  ]);

  useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);

  useEffect(() => {
    if (!open) {
      return;
    }
    form.resetFields();
    if (record) {
      form.setFieldsValue(auditWhitelistRecordToFormValues(record));
    }
  }, [form, open, record]);

  const triggeredRuleScopeDisplay = useMemo(() => {
    const extended = record as IAuditWhitelistResV1 & {
      rule_scope_display?: Array<{ rule_name?: string; db_type?: string }>;
    };
    return extended?.rule_scope_display?.length
      ? extended.rule_scope_display
      : undefined;
  }, [record]);

  const savedRuleScopeDisplay = triggeredRuleScopeDisplay;

  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        size="large"
        title={
          isUpdate
            ? t('whitelist.modal.update.title')
            : t('whitelist.modal.add.title')
        }
        open={open}
        onClose={handleClose}
        zIndex={zIndex}
        footer={
          <Space>
            <BasicButton onClick={handleClose} disabled={submitLoading}>
              {t('common.close')}
            </BasicButton>
            <BasicButton
              type="primary"
              onClick={submit}
              loading={submitLoading}
            >
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      >
        <RuleExceptionOverlayConfigProvider drawerZIndex={zIndex}>
          <Spin spinning={open && dbTypeLoading}>
            <RuleExceptionMatchConditionsForm
              form={form}
              isUpdate={isUpdate}
              triggeredRuleScopeDisplay={triggeredRuleScopeDisplay}
              savedRuleScopeDisplay={savedRuleScopeDisplay}
              ruleScopeLoading={ruleScopeLoading}
              ruleScopeError={ruleScopeError}
              onRuleScopeSearch={searchRules}
              onRuleScopeReload={reloadRuleScopeOptions}
              dbTypeOptions={dbTypeOptions}
              dbTypeLoading={dbTypeLoading}
              generateFlatRuleOptionsByDbType={generateFlatRuleOptionsByDbType}
              ruleNameDescMap={ruleNameDescMap}
              submitErrorFields={submitErrorFields}
              onValuesChangeClearError={clearSubmitError}
            />
          </Spin>
        </RuleExceptionOverlayConfigProvider>
      </BasicDrawer>
    </>
  );
};

export default AuditWhitelistFormDrawer;
