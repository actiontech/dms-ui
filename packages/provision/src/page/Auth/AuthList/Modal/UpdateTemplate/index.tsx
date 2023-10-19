import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useBoolean, useRequest } from 'ahooks';
import { Button, Form, message, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { ModalFormLayout, ResponseCode } from '~/data/common';
import { EventEmitterKey, ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import EventEmitter from '~/utils/EventEmitter';

interface IUpdateTemplateFormFields {
  data_permission_template_uid: string;
}

const UpdateTemplate = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();
  const { toggleModal, visible } = useModalStatus(
    AuthListModalStatus,
    ModalName.UpdateTemplateInAuth
  );
  const [selectData, updateSelectData] = useRecoilState(AuthListSelectData);

  const [form] = Form.useForm<IUpdateTemplateFormFields>();

  const [updateLoading, { setTrue: startUpdate, setFalse: updateFinish }] =
    useBoolean();

  const closeModal = () => {
    toggleModal(ModalName.UpdateTemplateInAuth, false);
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
          data_permission_template_uid: values.data_permission_template_uid
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

  const { data: authTemplateOptions } = useRequest(
    () =>
      auth
        .AuthListDataPermissionTemplate({
          page_index: 1,
          page_size: 999,
          filter_by_namespace_uid: projectID ?? ''
        })
        .then((res) => {
          return (
            res.data.data?.map((item) => ({
              value: item.uid ?? '',
              label: item.name ?? ''
            })) ?? []
          );
        }),
    {
      ready: visible,
      refreshDeps: [projectID]
    }
  );

  useEffect(() => {
    if (
      selectData?.data_permission_template_names?.length &&
      authTemplateOptions?.length !== 0
    ) {
      const cur = authTemplateOptions?.find(
        (item) => item.label === selectData.data_permission_template_names?.[0]
      );
      if (!cur) return;
      form.setFieldValue('data_permission_template_uid', cur.value);
    }
  }, [authTemplateOptions, form, selectData?.data_permission_template_names]);
  return (
    <Modal
      closable={false}
      title={t('auth.updateTemplateTitle')}
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
          name="data_permission_template_uid"
          label={t('auth.addAuth.baseForm.template')}
          required={true}
        >
          <Select options={authTemplateOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateTemplate;
