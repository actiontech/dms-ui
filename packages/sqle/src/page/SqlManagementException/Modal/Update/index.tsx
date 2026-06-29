import { useCallback, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import blacklist from '@actiontech/shared/lib/api/sqle/service/blacklist';
import { Space, message, Form } from 'antd';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { IReduxState } from '../../../../store';
import {
  updateSqlManagementExceptModalStatus,
  updateSelectSqlManagementException
} from '../../../../store/sqlManagementException';
import EventEmitter from '../../../../utils/EventEmitter';
import SqlManagementExceptionForm from '../../Common/Form';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IUpdateBlacklistReqV1 } from '@actiontech/shared/lib/api/sqle/service/common.d';
import { SqlManagementExceptionFormFieldType } from '../../index.type';
import {
  blacklistRecordToFormValues,
  formValuesToBlacklistPayload
} from '../../utils';
import { RULE_EXCEPTION_CONFLICT_CODE } from '../../../RuleException/index.type';
import {
  buildRuleExceptionDetailPath,
  parseRuleExceptionConflictId
} from '../../../RuleException/utils';
import { useNavigate } from 'react-router-dom';
import useRuleTips from '../../../../hooks/useRuleTips';

const UpdateSqlManagementException = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mapRuleNamesToSelectValues } = useRuleTips();

  const [messageApi, messageContextHolder] = message.useMessage();

  const [form] = Form.useForm<SqlManagementExceptionFormFieldType>();

  const visible = useSelector<IReduxState, boolean>(
    (state) =>
      !!state.sqlManagementException.modalStatus[
        ModalName.Update_Sql_Management_Exception
      ]
  );

  const { projectName, projectID } = useCurrentProject();

  const currentSqlManagementExceptionRecord = useSelector<
    IReduxState,
    IBlacklistResV1 | null
  >((state) => state.sqlManagementException.selectSqlManagementExceptionRecord);

  const dispatch = useDispatch();

  const [createLoading, { setTrue: startCreate, setFalse: createFinish }] =
    useBoolean();

  const closeModal = useCallback(() => {
    form.resetFields();
    dispatch(
      updateSqlManagementExceptModalStatus({
        modalName: ModalName.Update_Sql_Management_Exception,
        status: false
      })
    );
    dispatch(updateSelectSqlManagementException({ selectRow: null }));
  }, [dispatch, form]);

  const submit = useCallback(async () => {
    const values = await form.validateFields();
    startCreate();
    const payload = formValuesToBlacklistPayload(values);

    blacklist
      .updateBlacklistV1({
        project_name: projectName,
        blacklist_id: `${currentSqlManagementExceptionRecord?.blacklist_id}`,
        ...payload,
        rule_scope: payload.rule_scope as string | undefined,
        type: payload.type as unknown as IUpdateBlacklistReqV1['type']
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          EventEmitter.emit(EmitterKey.Refresh_Sql_management_Exception_List);
          closeModal();
          messageApi.success(t('sqlManagementException.modal.update.success'));
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
        createFinish();
      });
  }, [
    closeModal,
    createFinish,
    currentSqlManagementExceptionRecord,
    form,
    messageApi,
    navigate,
    projectID,
    projectName,
    startCreate,
    t
  ]);

  useEffect(() => {
    if (visible) {
      const values = blacklistRecordToFormValues(
        currentSqlManagementExceptionRecord
      );
      form.setFieldsValue({
        ...values,
        rule_scope: mapRuleNamesToSelectValues(values.rule_scope ?? [])
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        size="large"
        title={t('sqlManagementException.modal.update.title')}
        open={visible}
        onClose={closeModal}
        footer={
          <Space>
            <BasicButton onClick={closeModal} disabled={createLoading}>
              {t('common.close')}
            </BasicButton>
            <BasicButton
              type="primary"
              onClick={submit}
              loading={createLoading}
            >
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      >
        <SqlManagementExceptionForm form={form} isUpdate />
      </BasicDrawer>
    </>
  );
};

export default UpdateSqlManagementException;
