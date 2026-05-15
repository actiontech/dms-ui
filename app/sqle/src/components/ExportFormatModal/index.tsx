import { BasicButton, BasicModal } from '@actiontech/dms-kit';
import { Radio, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { GetAuditPlanSQLExportReqV1ExportFormatEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export interface ExportFormatModalProps {
  open: boolean;
  selectedFormat: GetAuditPlanSQLExportReqV1ExportFormatEnum;
  onFormatChange: (format: GetAuditPlanSQLExportReqV1ExportFormatEnum) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExportFormatModal = ({
  open,
  selectedFormat,
  onFormatChange,
  onConfirm,
  onCancel
}: ExportFormatModalProps) => {
  const { t } = useTranslation();

  return (
    <BasicModal
      title={t('sqlManagement.pageHeader.action.exportFormatModal.title')}
      open={open}
      onCancel={onCancel}
      size="small"
      footer={
        <Space>
          <BasicButton onClick={onCancel}>{t('common.cancel')}</BasicButton>
          <BasicButton onClick={onConfirm} type="primary">
            {t('common.ok')}
          </BasicButton>
        </Space>
      }
    >
      <Radio.Group
        value={selectedFormat}
        onChange={(e) => onFormatChange(e.target.value)}
      >
        <Space direction="vertical">
          <Radio value={GetAuditPlanSQLExportReqV1ExportFormatEnum.csv}>
            CSV
          </Radio>
          <Radio value={GetAuditPlanSQLExportReqV1ExportFormatEnum.excel}>
            Excel
          </Radio>
        </Space>
      </Radio.Group>
    </BasicModal>
  );
};

export default ExportFormatModal;
