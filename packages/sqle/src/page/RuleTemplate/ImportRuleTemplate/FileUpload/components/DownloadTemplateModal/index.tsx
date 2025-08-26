import { BasicButton, BasicModal, BasicSelect } from '@actiontech/dms-kit';
import {
  DownloadTemplateFormFields,
  DownloadTemplateModalProps
} from './index.type';
import { useTranslation } from 'react-i18next';
import { Form, message } from 'antd';
import { FormItemLabel } from '@actiontech/dms-kit';
import { useRequest } from 'ahooks';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import useDatabaseType from '../../../../../../hooks/useDatabaseType';
import { useEffect } from 'react';
const DownloadTemplateModal: React.FC<DownloadTemplateModalProps> = ({
  open,
  fileType,
  onClose
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<DownloadTemplateFormFields>();
  const { dbTypeOptions, updateDriverNameList } = useDatabaseType();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { runAsync: downloadTemplate, loading: submitPending } = useRequest(
    (dbType: string) =>
      rule_template.getRuleTemplateFileV1(
        {
          instance_type: dbType,
          file_type: fileType
        },
        {
          responseType: 'blob'
        }
      ),
    {
      manual: true
    }
  );
  const closeModalAndResetForm = () => {
    onClose();
    form.resetFields();
  };
  const onSubmit = async () => {
    const values = await form.validateFields();
    const hideLoading = messageApi.loading(
      t('ruleTemplate.importRuleTemplate.downloading'),
      0
    );
    downloadTemplate(values.dbType)
      .then(() => {
        closeModalAndResetForm();
      })
      .finally(() => {
        hideLoading();
      });
  };
  useEffect(() => {
    if (open) {
      updateDriverNameList();
    }
  }, [open, updateDriverNameList]);
  return (
    <BasicModal
      size="small"
      title={t('ruleTemplate.importRuleTemplate.downloadTemplate')}
      open={open}
      onCancel={closeModalAndResetForm}
      footer={
        <>
          <BasicButton
            disabled={submitPending}
            onClick={closeModalAndResetForm}
          >
            {t('common.cancel')}
          </BasicButton>
          <BasicButton
            disabled={submitPending}
            type="primary"
            onClick={onSubmit}
          >
            {t('common.download')}
          </BasicButton>
        </>
      }
    >
      {messageContextHolder}
      <Form form={form}>
        <FormItemLabel
          rules={[
            {
              required: true
            }
          ]}
          name="dbType"
          className="has-required-style"
          label={t('ruleTemplate.importRuleTemplate.dbType')}
        >
          <BasicSelect options={dbTypeOptions} />
        </FormItemLabel>
      </Form>
    </BasicModal>
  );
};
export default DownloadTemplateModal;
