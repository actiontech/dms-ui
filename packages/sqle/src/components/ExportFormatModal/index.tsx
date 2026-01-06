import { BasicButton, BasicModal } from '@actiontech/dms-kit';
import { Radio, Space } from 'antd';
import { useTranslation } from 'react-i18next';

export interface ExportFormatModalProps<T extends string = string> {
  open: boolean;
  selectedFormat: T;
  onFormatChange: (format: T) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExportFormatModal = <T extends string = string>({
  open,
  selectedFormat,
  onFormatChange,
  onConfirm,
  onCancel
}: ExportFormatModalProps<T>) => {
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
          <Radio value="csv">CSV</Radio>
          <Radio value="excel">Excel</Radio>
        </Space>
      </Radio.Group>
    </BasicModal>
  );
};

export default ExportFormatModal;
