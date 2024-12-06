import { BasicModal, BasicButton, BasicSelect } from '@actiontech/shared';
import { Form, message } from 'antd';
import { useTranslation } from 'react-i18next';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { UpdateSqlBackupStrategyReqStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { BackupStrategyOptions } from './index.data';
import { SwitchSqlBackupStrategyModalProps } from './index.type';
import { useMemo } from 'react';
import { InstanceTipResV1SupportedBackupStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const SwitchSqlBackupStrategyModal: React.FC<
  SwitchSqlBackupStrategyModalProps
> = ({ open, onCancel, taskID, sqlID, refresh, supportedBackupPolicies }) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm<{
    strategy: UpdateSqlBackupStrategyReqStrategyEnum;
  }>();

  const onSubmit = async () => {
    const values = await form.validateFields();
    workflow
      .UpdateSqlBackupStrategyV1({
        task_id: taskID ?? '',
        sql_id: `${sqlID}`,
        strategy: values.strategy
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('execWorkflow.create.auditResult.editBackupStrategySuccessTips')
          );
          refresh();
          onClose();
        }
      });
  };

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  const options = useMemo(() => {
    return BackupStrategyOptions.filter((i) =>
      supportedBackupPolicies?.includes(
        i.value as unknown as InstanceTipResV1SupportedBackupStrategyEnum
      )
    );
  }, [supportedBackupPolicies]);

  return (
    <BasicModal
      open={open}
      title={t('execWorkflow.create.auditResult.editBackupStrategy')}
      footer={
        <>
          <BasicButton onClick={onClose}>{t('common.cancel')}</BasicButton>
          <BasicButton type="primary" onClick={onSubmit}>
            {t('common.ok')}
          </BasicButton>
        </>
      }
      centered
      closable={false}
    >
      {contextHolder}
      <Form form={form} layout="vertical">
        <Form.Item name="strategy" rules={[{ required: true }]}>
          <BasicSelect options={options} />
        </Form.Item>
      </Form>
    </BasicModal>
  );
};

export default SwitchSqlBackupStrategyModal;
