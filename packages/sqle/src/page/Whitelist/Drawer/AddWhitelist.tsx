import { useCallback } from 'react';
import { useBoolean } from 'ahooks';
import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import audit_whitelist from '@actiontech/shared/lib/api/sqle/service/audit_whitelist';
import { Space } from 'antd';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ModalName } from '../../../data/ModalName';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import { IReduxState } from '../../../store';
import { updateWhitelistModalStatus } from '../../../store/whitelist';
import WhitelistForm from './WhitelistForm';
import { WhitelistFormFields } from './index.type';

const AddWhitelist = () => {
  const { t } = useTranslation();
  const [form] = useForm<WhitelistFormFields>();
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.whitelist.modalStatus[ModalName.Add_Whitelist]
  );
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
          EventEmitter.emit(EmitterKey.Refresh_Whitelist_List);
          closeModal();
        }
      })
      .finally(() => {
        createFinish();
      });
  }, [closeModal, createFinish, form, projectName, startCreate]);

  return (
    <BasicDrawer
      size="large"
      title={t('whitelist.modal.add.title')}
      open={visible}
      onClose={closeModal}
      footer={
        <Space>
          <BasicButton onClick={closeModal} disabled={createLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={submit} loading={createLoading}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      <WhitelistForm form={form} />
    </BasicDrawer>
  );
};

export default AddWhitelist;
