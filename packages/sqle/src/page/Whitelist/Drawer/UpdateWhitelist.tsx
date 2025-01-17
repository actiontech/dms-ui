import { useCallback, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import audit_whitelist from '@actiontech/shared/lib/api/sqle/service/audit_whitelist';
import {
  CreateAuditWhitelistReqV1MatchTypeEnum,
  UpdateAuditWhitelistReqV1MatchTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Space, Form, message } from 'antd';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import { updateWhitelistModalStatus } from '../../../store/whitelist';
import EventEmitter from '../../../utils/EventEmitter';
import { WhitelistFormFields } from './index.type';
import WhitelistForm from './WhitelistForm';

const UpdateWhitelist = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [form] = Form.useForm<WhitelistFormFields>();
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.whitelist.modalStatus[ModalName.Update_Whitelist]
  );
  const { projectName } = useCurrentProject();
  const currentWhitelist = useSelector<
    IReduxState,
    IAuditWhitelistResV1 | null
  >((state) => state.whitelist.selectWhitelist);
  const dispatch = useDispatch();
  const [createLoading, { setTrue: startCreate, setFalse: createFinish }] =
    useBoolean();

  const closeModal = useCallback(() => {
    form.resetFields();
    dispatch(
      updateWhitelistModalStatus({
        modalName: ModalName.Update_Whitelist,
        status: false
      })
    );
  }, [dispatch, form]);

  const submit = useCallback(async () => {
    const values = await form.validateFields();
    startCreate();
    audit_whitelist
      .UpdateAuditWhitelistByIdV1({
        project_name: projectName,
        audit_whitelist_id: `${currentWhitelist?.audit_whitelist_id}`,
        value: values.sql,
        desc: values.desc,
        // emmmm... update enum should be same with create enum
        match_type:
          values.matchType as any as UpdateAuditWhitelistReqV1MatchTypeEnum
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          EventEmitter.emit(EmitterKey.Refresh_Whitelist_List);
          closeModal();
          messageApi.success(t('whitelist.modal.update.success'));
        }
      })
      .finally(() => {
        createFinish();
      });
  }, [
    closeModal,
    createFinish,
    currentWhitelist?.audit_whitelist_id,
    form,
    projectName,
    startCreate,
    messageApi,
    t
  ]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        sql: currentWhitelist?.value,
        desc: currentWhitelist?.desc,
        matchType:
          currentWhitelist?.match_type as CreateAuditWhitelistReqV1MatchTypeEnum
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        size="large"
        title={t('whitelist.modal.update.title')}
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
        <WhitelistForm isUpdate form={form} />
      </BasicDrawer>
    </>
  );
};

export default UpdateWhitelist;
