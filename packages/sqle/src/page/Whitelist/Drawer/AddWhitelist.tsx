import { useCallback, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import audit_whitelist from '@actiontech/shared/lib/api/sqle/service/audit_whitelist';
import { Space, message, Form } from 'antd';
import { BasicButton, BasicDrawer } from '@actiontech/dms-kit';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/dms-kit';
import { ModalName } from '../../../data/ModalName';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import { IReduxState } from '../../../store';
import {
  updateWhitelistModalStatus,
  updateSelectWhitelist
} from '../../../store/whitelist';
import WhitelistForm from './WhitelistForm';
import { WhitelistFormFields } from './index.type';
import { initWhitelistModalStatus } from '../../../store/whitelist';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { useMedia } from '@actiontech/shared';
const AddWhitelist: React.FC<{
  onCreated?: () => void;
}> = ({ onCreated }) => {
  const { t } = useTranslation();
  const { isMobile } = useMedia();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [form] = Form.useForm<WhitelistFormFields>();
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.whitelist.modalStatus[ModalName.Add_Whitelist]
  );
  const currentWhitelist = useSelector<
    IReduxState,
    IAuditWhitelistResV1 | null
  >((state) => state.whitelist.selectWhitelist);
  const dispatch = useDispatch();
  const [createLoading, { setTrue: startCreate, setFalse: createFinish }] =
    useBoolean();
  const { projectName } = useCurrentProject();
  const closeModal = useCallback(() => {
    form.resetFields();
    dispatch(
      updateWhitelistModalStatus({
        modalName: ModalName.Add_Whitelist,
        status: false
      })
    );
    dispatch(
      updateSelectWhitelist({
        selectRow: null
      })
    );
  }, [dispatch, form]);
  const submit = useCallback(async () => {
    const values = await form.validateFields();
    startCreate();
    audit_whitelist
      .createAuditWhitelistV1({
        value: values.sql,
        desc: values.desc,
        match_type: values.matchType,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onCreated?.();
          EventEmitter.emit(EmitterKey.Refresh_Whitelist_List);
          closeModal();
          messageApi.success(t('whitelist.modal.add.success'));
        }
      })
      .finally(() => {
        createFinish();
      });
  }, [
    closeModal,
    createFinish,
    form,
    projectName,
    startCreate,
    onCreated,
    messageApi,
    t
  ]);
  useEffect(() => {
    if (visible && !!currentWhitelist?.value) {
      form.setFieldsValue({
        sql: currentWhitelist?.value
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  useEffect(() => {
    const modalStatus = {
      [ModalName.Add_Whitelist]: false
    };
    dispatch(
      initWhitelistModalStatus({
        modalStatus
      })
    );
  }, [dispatch]);
  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        size="large"
        width={isMobile ? '23rem' : undefined}
        title={t('whitelist.modal.add.title')}
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
        <WhitelistForm form={form} />
      </BasicDrawer>
    </>
  );
};
export default AddWhitelist;
