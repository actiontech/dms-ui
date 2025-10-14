import {
  BasicButton,
  BasicModal,
  ReminderInformation
} from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { ConnectableInfoModalWrapper } from '../style';

interface IConnectableErrorModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  onSubmit: () => void;
  loading: boolean;
  connectErrorList?: {
    name: string | undefined;
    connect_error_message: string;
  }[];
}
const ConnectableErrorModal = ({
  modalOpen,
  closeModal,
  onSubmit,
  loading,
  connectErrorList
}: IConnectableErrorModalProps) => {
  const { t } = useTranslation();

  return (
    <BasicModal
      open={modalOpen}
      title={t('dmsProject.batchImportDataSource.dataSourceConnectError')}
      footer={
        <Space>
          <BasicButton onClick={closeModal}>
            {t('dmsProject.batchImportDataSource.returnModify')}
          </BasicButton>
          <BasicButton
            onClick={onSubmit}
            loading={loading}
            type="primary"
            className="connectable-modal-btn"
          >
            {t('dmsProject.batchImportDataSource.continueSubmit')}
          </BasicButton>
        </Space>
      }
      closable={false}
    >
      <ConnectableInfoModalWrapper>
        {connectErrorList?.map((item) => (
          <div key={item.name}>
            <div>{item.name}</div>
            <ReminderInformation
              status="error"
              message={item.connect_error_message}
            />
          </div>
        ))}
      </ConnectableInfoModalWrapper>
    </BasicModal>
  );
};

export default ConnectableErrorModal;
