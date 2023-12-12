import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useBoolean } from 'ahooks';
import { Form, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { EventEmitterKey, ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import { timeDayOptions } from '~/page/Auth/AddAuth/index.data';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import EventEmitter from '~/utils/EventEmitter';
import { BasicButton, BasicModal, BasicSelect } from '@actiontech/shared';
import { FormItemWithExtraStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { IUpdateExpirationInAuthFormFields } from '../List/index.type';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const UpdateExpiration = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

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
    closeModal();
    const timeId = setTimeout(() => {
      form.resetFields();
      clearTimeout(timeId);
    }, 300);
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
        messageApi.success(t('auth.updateTemplateSuccess'));
        closeAndReset();
        EventEmitter.emit(EventEmitterKey.Refresh_Auth_List_Table);
      }
    } finally {
      updateFinish();
    }
  };

  return (
    <BasicModal
      title={t('auth.updateExpirationTitle')}
      open={visible}
      footer={
        <>
          <BasicButton disabled={updateLoading} onClick={closeAndReset}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" loading={updateLoading} onClick={submit}>
            {t('common.submit')}
          </BasicButton>
        </>
      }
      onCancel={closeAndReset}
    >
      {contextHolder}
      <Form layout="vertical" form={form}>
        <FormItemWithExtraStyleWrapper
          name="renewal_effective_time_day"
          label={t('auth.updateExpirationField')}
          required={true}
          extra={t('auth.updateExpirationExtra')}
        >
          <BasicSelect options={timeDayOptions} />
        </FormItemWithExtraStyleWrapper>
      </Form>
    </BasicModal>
  );
};

export default UpdateExpiration;
