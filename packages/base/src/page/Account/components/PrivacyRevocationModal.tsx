import React from 'react';
import { useTranslation } from 'react-i18next';
import { BasicButton, BasicModal } from '@actiontech/shared';
import { Space } from 'antd';
import { InfoHexagonOutlined } from '@actiontech/icons';
import { PrivacyModalTitleStyleWrapper } from './style';

export interface PrivacyRevocationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const PrivacyRevocationModal: React.FC<PrivacyRevocationModalProps> = ({
  open,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const { t } = useTranslation();

  return (
    <BasicModal
      title={
        <PrivacyModalTitleStyleWrapper>
          <div className="icon revocation-icon">
            <InfoHexagonOutlined color="currentColor" width={20} height={20} />
          </div>
          {t('dmsAccount.privacy.revocation.title')}
        </PrivacyModalTitleStyleWrapper>
      }
      open={open}
      destroyOnClose
      footer={
        <Space>
          <BasicButton onClick={onCancel} disabled={loading}>
            {t('dmsAccount.privacy.revocation.cancel')}
          </BasicButton>
          <BasicButton danger onClick={onConfirm} loading={loading}>
            {t('dmsAccount.privacy.revocation.confirm')}
          </BasicButton>
        </Space>
      }
    >
      <p>{t('dmsAccount.privacy.revocation.content')}</p>
    </BasicModal>
  );
};

export default PrivacyRevocationModal;
