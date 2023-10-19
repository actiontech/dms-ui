import { useBoolean } from 'ahooks';
import { Button, Form, Input, message, Modal } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { ModalFormLayout, ResponseCode } from '~/data/common';
import { ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import {
  AuthTemplateListSelectData,
  AuthTemplateModalStatus
} from '~/store/auth/templateList';
import useNavigate from '../../../../../hooks/useNavigate';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';

interface ICopyTemplateFormFields {
  data_permission_template_name: string;
  name: string;
}
const CopyTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectID } = useCurrentProject();
  const { toggleModal, visible } = useModalStatus(
    AuthTemplateModalStatus,
    ModalName.CopyTemplate
  );
  const [selectedData, setSelectedData] = useRecoilState(
    AuthTemplateListSelectData
  );
  const [form] = Form.useForm<ICopyTemplateFormFields>();
  useEffect(() => {
    if (visible && selectedData) {
      form.setFieldsValue({
        data_permission_template_name: selectedData.name
      });
    }
  }, [form, selectedData, visible]);

  const [copyLoading, { setTrue: startCopy, setFalse: copyFinish }] =
    useBoolean();

  const closeModal = () => {
    toggleModal(ModalName.CopyTemplate, false);
    setSelectedData(null);
  };

  const closeAndReset = () => {
    form.resetFields();
    closeModal();
  };

  const submit = async () => {
    const values = await form.validateFields();
    try {
      startCopy();
      const res = await auth.AuthCopyDataPermissionTemplate({
        data_permission_template_uid: selectedData?.uid ?? '',
        new_template: { name: values.name }
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        closeAndReset();
        message.success(
          t('auth.editTemplate.addSuccessTips', { name: values.name })
        );
        navigate(`${projectID}auth/template/edit_template?name=${values.name}`);
      }
    } finally {
      copyFinish();
    }
  };

  return (
    <Modal
      closable={false}
      title={t('auth.button.copyTemplate')}
      open={visible}
      footer={
        <>
          <Button disabled={copyLoading} onClick={closeAndReset}>
            {t('common.close')}
          </Button>
          <Button type="primary" loading={copyLoading} onClick={submit}>
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <Form {...ModalFormLayout} form={form}>
        <Form.Item
          name="data_permission_template_name"
          label={t('auth.addAuth.baseForm.template')}
          required={true}
        >
          <Input readOnly={true} />
        </Form.Item>
        <Form.Item
          name="name"
          label={t('auth.template.searchLabel')}
          rules={[{ required: true }]}
        >
          <Input placeholder={t('auth.editTemplate.templateNamePlaceholder')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CopyTemplate;
