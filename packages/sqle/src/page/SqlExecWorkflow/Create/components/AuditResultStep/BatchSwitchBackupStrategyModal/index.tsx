import { BasicModal, BasicButton, BasicSelect } from '@actiontech/shared';
import { Space, Form, Typography, message } from 'antd';
import { useTranslation } from 'react-i18next';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { UpdateTaskBackupStrategyReqStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { BackupStrategyOptions } from '../../../../Common/AuditResultList/Table/index.data';
import EventEmitter from '../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../data/EmitterKey';
import { InstanceTipResV1SupportedBackupStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useMemo } from 'react';

type BatchSwitchBackupStrategyModalProps = {
  taskID?: string;
  open: boolean;
  onCancel: () => void;
  currentTaskSupportedBackupPolicies?: InstanceTipResV1SupportedBackupStrategyEnum[];
};

const BatchSwitchBackupStrategyModal: React.FC<
  BatchSwitchBackupStrategyModalProps
> = ({ taskID, open, onCancel, currentTaskSupportedBackupPolicies }) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm<{
    strategy: UpdateTaskBackupStrategyReqStrategyEnum;
  }>();

  const onSubmit = async () => {
    const values = await form.validateFields();
    onClose();
    workflow
      .UpdateTaskBackupStrategyV1({
        task_id: taskID ?? '',
        strategy: values.strategy
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t(
              'execWorkflow.create.auditResult.switchDatabaseBackupPolicySuccessTips'
            )
          );
          EventEmitter.emit(
            EmitterKey.Refresh_Sql_Exec_workflow_Audit_Result_List
          );
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
      currentTaskSupportedBackupPolicies?.includes(
        i.value as unknown as InstanceTipResV1SupportedBackupStrategyEnum
      )
    );
  }, [currentTaskSupportedBackupPolicies]);

  return (
    <BasicModal
      open={open}
      title={t('execWorkflow.create.auditResult.switchDatabaseBackupPolicy')}
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
      <Space className="full-width-element" direction="vertical">
        <Typography.Text type="secondary">
          {t('execWorkflow.create.auditResult.switchDatabaseBackupPolicyTips')}
        </Typography.Text>
        <Form form={form} layout="vertical">
          <Form.Item name="strategy" rules={[{ required: true }]}>
            <BasicSelect options={options} />
          </Form.Item>
        </Form>
      </Space>
    </BasicModal>
  );
};

export default BatchSwitchBackupStrategyModal;
