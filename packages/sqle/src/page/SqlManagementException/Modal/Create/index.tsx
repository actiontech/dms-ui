import { useCallback, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import blacklist from '@actiontech/shared/lib/api/sqle/service/blacklist';
import { Space, message, Form } from 'antd';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ModalName } from '../../../../data/ModalName';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { IReduxState } from '../../../../store';
import {
  updateSqlManagementExceptModalStatus,
  initSqlManagementExceptModalStatus,
  updateSelectSqlManagementException
} from '../../../../store/sqlManagementException';
import SqlManagementExceptionForm from '../../Common/Form';
import { SqlManagementExceptionFormFieldType } from '../../index.type';
import { CreateBlacklistReqV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { formValuesToBlacklistPayload } from '../../utils';
import { RULE_EXCEPTION_CONFLICT_CODE } from '../../../RuleException/index.type';
import { parseRuleExceptionConflictId } from '../../../RuleException/utils';
import { useNavigate } from 'react-router-dom';
import { buildRuleExceptionDetailPath } from '../../../RuleException/utils';

const CreateSqlManagementException: React.FC<{
  onCreated?: () => void;
}> = ({ onCreated }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [messageApi, messageContextHolder] = message.useMessage();

  const [form] = Form.useForm<SqlManagementExceptionFormFieldType>();

  const visible = useSelector<IReduxState, boolean>(
    (state) =>
      !!state.sqlManagementException.modalStatus[
        ModalName.Create_Sql_Management_Exception
      ]
  );

  const currentSqlManagementExceptionRecord = useSelector<
    IReduxState,
    IBlacklistResV1 | null
  >((state) => state.sqlManagementException.selectSqlManagementExceptionRecord);

  const dispatch = useDispatch();

  const [createLoading, { setTrue: startCreate, setFalse: createFinish }] =
    useBoolean();

  const { projectName, projectID } = useCurrentProject();

  const closeModal = useCallback(() => {
    form.resetFields();
    dispatch(
      updateSqlManagementExceptModalStatus({
        modalName: ModalName.Create_Sql_Management_Exception,
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
      .createBlacklistV1({
        ...payload,
        rule_scope: payload.rule_scope as string | undefined,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onCreated?.();
          EventEmitter.emit(EmitterKey.Refresh_Sql_management_Exception_List);
          closeModal();
          messageApi.success(t('sqlManagementException.modal.add.success'));
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
    form,
    messageApi,
    navigate,
    onCreated,
    projectID,
    projectName,
    startCreate,
    t
  ]);

  useEffect(() => {
    const modalStatus = {
      [ModalName.Create_Sql_Management_Exception]: false
    };
    dispatch(initSqlManagementExceptModalStatus({ modalStatus }));
  }, [dispatch]);

  useEffect(() => {
    if (visible && !!currentSqlManagementExceptionRecord?.content) {
      form.setFieldsValue({
        match_rows: [
          {
            type: CreateBlacklistReqV1TypeEnum.fp_sql,
            content: currentSqlManagementExceptionRecord.content
          }
        ]
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        size="large"
        title={t('sqlManagementException.modal.add.title')}
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
        <SqlManagementExceptionForm form={form} />
      </BasicDrawer>
    </>
  );
};

export default CreateSqlManagementException;
