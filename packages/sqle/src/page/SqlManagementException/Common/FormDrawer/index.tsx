import { useCallback, useEffect, useState, type Key } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { Space, message, Form, Spin } from 'antd';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useNavigate } from 'react-router-dom';
import blacklist from '@actiontech/shared/lib/api/sqle/service/blacklist';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IUpdateBlacklistReqV1 } from '@actiontech/shared/lib/api/sqle/service/common.d';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import useRuleTips from '../../../../hooks/useRuleTips';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import SqlManagementExceptionForm from '../Form';
import { SqlManagementExceptionFormFieldType } from '../../index.type';
import {
  blacklistRecordToFormValues,
  buildUpdateFormValuesFromRecord,
  formValuesToBlacklistPayload
} from '../../utils';
import { RULE_EXCEPTION_CONFLICT_CODE } from '../../../RuleException/index.type';
import {
  buildRuleExceptionDetailPath,
  parseRuleExceptionConflictId
} from '../../../RuleException/utils';
import { BlacklistResV1RuleScopeModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { normalizeRuleScopeList } from '../../../RuleException/index.data';

export type SqlManagementExceptionFormDrawerMode = 'create' | 'update';

export type SqlManagementExceptionFormDrawerProps = {
  mode: SqlManagementExceptionFormDrawerMode;
  open: boolean;
  record?: IBlacklistResV1 | null;
  onClose: () => void;
  onSuccess?: () => void;
};

const SqlManagementExceptionFormDrawer: React.FC<
  SqlManagementExceptionFormDrawerProps
> = ({ mode, open, record, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    updateRuleTips,
    ruleTips,
    loading: ruleTipsLoading,
    generateFlatRuleOptionsByDbType,
    ruleNameDescMap
  } = useRuleTips();
  const {
    updateDriverNameList,
    dbTypeOptions,
    loading: dbTypeLoading
  } = useDatabaseType();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [form] = Form.useForm<SqlManagementExceptionFormFieldType>();
  const { projectName, projectID } = useCurrentProject();
  const isUpdate = mode === 'update';

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const [submitErrorFields, setSubmitErrorFields] = useState<
    Array<{ name: Key[]; errors: string[] }>
  >([]);

  const clearSubmitError = useCallback(() => {
    setSubmitErrorFields((prev) => (prev.length ? [] : prev));
  }, []);

  const {
    data: detailRecord,
    loading: detailLoading,
    run: fetchDetail,
    mutate: mutateDetail
  } = useRequest(
    (id: string) =>
      blacklist
        .getBlacklistByIDV1({
          project_name: projectName,
          blacklist_id: id
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
          throw new Error(res.data.message);
        }),
    { manual: true }
  );

  const handleClose = useCallback(() => {
    form.resetFields();
    mutateDetail(undefined);
    setSubmitErrorFields([]);
    onClose();
  }, [form, mutateDetail, onClose]);

  const submit = useCallback(async () => {
    let values: SqlManagementExceptionFormFieldType;
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
    const payload = formValuesToBlacklistPayload(values);

    const request =
      mode === 'create'
        ? blacklist.createBlacklistV1({
            ...payload,
            rule_scope: payload.rule_scope as string | undefined,
            project_name: projectName
          })
        : blacklist.updateBlacklistV1({
            project_name: projectName,
            blacklist_id: `${record?.blacklist_id}`,
            ...payload,
            rule_scope: payload.rule_scope as string | undefined,
            type: payload.type as unknown as IUpdateBlacklistReqV1['type']
          });

    request
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onSuccess?.();
          EventEmitter.emit(EmitterKey.Refresh_Sql_management_Exception_List);
          handleClose();
          messageApi.success(
            isUpdate
              ? t('sqlManagementException.modal.update.success')
              : t('sqlManagementException.modal.add.success')
          );
          return;
        }
        if (res.data.code === RULE_EXCEPTION_CONFLICT_CODE) {
          const conflictId = parseRuleExceptionConflictId(res.data.message);
          messageApi.warning(t('ruleException.quickAdd.conflict'));
          if (conflictId) {
            navigate(buildRuleExceptionDetailPath(projectID, conflictId));
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
    mode,
    navigate,
    onSuccess,
    projectID,
    projectName,
    record?.blacklist_id,
    startSubmit,
    submitFinish,
    t
  ]);

  useEffect(() => {
    if (!projectName) {
      return;
    }
    updateRuleTips(projectName);
    updateDriverNameList();
  }, [projectName, updateRuleTips, updateDriverNameList]);

  useEffect(() => {
    if (!open) {
      mutateDetail(undefined);
      return;
    }

    if (isUpdate && record?.blacklist_id) {
      fetchDetail(`${record.blacklist_id}`);
    }
  }, [fetchDetail, isUpdate, mutateDetail, open, record?.blacklist_id]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isUpdate) {
      if (ruleTipsLoading || detailLoading) {
        return;
      }

      const sourceRecord = detailRecord ?? record;
      form.resetFields();
      form.setFieldsValue(
        buildUpdateFormValuesFromRecord(sourceRecord, ruleTips)
      );
      return;
    }

    if (ruleTipsLoading) {
      return;
    }

    form.resetFields();
    if (record) {
      const prefilledRuleNames = normalizeRuleScopeList(
        record.rule_scope as string[] | 'ALL' | undefined
      );
      const hasTriggeredRuleScopeDisplay = !!record.rule_scope_display?.length;
      const hasRuleScopePrefill =
        record.rule_scope_mode === BlacklistResV1RuleScopeModeEnum.specific &&
        (prefilledRuleNames.length > 0 || hasTriggeredRuleScopeDisplay);
      const formValues = hasRuleScopePrefill
        ? buildUpdateFormValuesFromRecord(record, ruleTips)
        : blacklistRecordToFormValues(record);
      if (
        formValues.match_rows?.length ||
        hasRuleScopePrefill ||
        hasTriggeredRuleScopeDisplay
      ) {
        form.setFieldsValue(formValues);
      }
    }
  }, [
    detailLoading,
    detailRecord,
    form,
    isUpdate,
    open,
    record,
    ruleTips,
    ruleTipsLoading
  ]);

  const triggeredRuleScopeDisplay =
    !isUpdate && record?.rule_scope_display?.length
      ? record.rule_scope_display
      : undefined;

  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        size="large"
        title={
          isUpdate
            ? t('sqlManagementException.modal.update.title')
            : t('sqlManagementException.modal.add.title')
        }
        open={open}
        onClose={handleClose}
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
        <Spin
          spinning={
            open &&
            (ruleTipsLoading || dbTypeLoading || (isUpdate && detailLoading))
          }
        >
          <SqlManagementExceptionForm
            form={form}
            isUpdate={isUpdate}
            triggeredRuleScopeDisplay={triggeredRuleScopeDisplay}
            ruleTipsLoading={ruleTipsLoading}
            dbTypeOptions={dbTypeOptions}
            dbTypeLoading={dbTypeLoading}
            generateFlatRuleOptionsByDbType={generateFlatRuleOptionsByDbType}
            ruleNameDescMap={ruleNameDescMap}
            submitErrorFields={submitErrorFields}
            onValuesChangeClearError={clearSubmitError}
          />
        </Spin>
      </BasicDrawer>
    </>
  );
};

export default SqlManagementExceptionFormDrawer;
