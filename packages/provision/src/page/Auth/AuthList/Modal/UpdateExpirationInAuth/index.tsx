import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useBoolean } from 'ahooks';
import { Button, Form, message, Modal, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { ModalFormLayout, ResponseCode } from '~/data/common';
import { EventEmitterKey, ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import { timeDayOptions } from '~/page/Auth/AddAuth/index.data';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import EventEmitter from '~/utils/EventEmitter';

interface IUpdateExpirationInAuthFormFields {
  renewal_effective_time_day: string;
}

const UpdateExpirationInAuth = () => {
  const { t } = useTranslation();

  const { toggleModal, visible } = useModalStatus(
    AuthListModalStatus,
    ModalName.UpdateExpirationInAuth
  );
  const [selectData, updateSelectData] = useRecoilState(AuthListSelectData);

  const [form] = Form.useForm<IUpdateExpirationInAuthFormFields>();

  const [updateLoading, { setTrue: startUpdate, setFalse: updateFinish }] =
    useBoolean();

  const closeModal = () => {
    toggleModal(ModalName.UpdateExpirationInAuth, false);
    updateSelectData(null);
  };

  const closeAndReset = () => {
    form.resetFields();
    closeModal();
  };

  const submit = async () => {
    const values = await form.validateFields();
    startUpdate();
    try {
      const res = await auth.AuthUpdateAuthorization({
        authorization_uid: selectData?.uid ?? '',
        authorization: {
          renewal_effective_time_day: Number(values.renewal_effective_time_day)
        }
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        message.success(t('auth.updateTemplateSuccess'));
        closeAndReset();
        EventEmitter.emit(EventEmitterKey.Refresh_Auth_List_Table);
      }
    } finally {
      updateFinish();
    }
  };

  return (
    <Modal
      closable={false}
      title={t('auth.updateExpirationTitle')}
      open={visible}
      footer={
        <>
          <Button disabled={updateLoading} onClick={closeAndReset}>
            {t('common.close')}
          </Button>
          <Button type="primary" loading={updateLoading} onClick={submit}>
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <Form {...ModalFormLayout} form={form}>
        <Form.Item
          name="renewal_effective_time_day"
          label={t('auth.updateExpirationField')}
          required={true}
          extra={t('auth.updateExpirationExtra')}
        >
          <Select options={timeDayOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateExpirationInAuth;
