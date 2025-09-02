import React from 'react';
import { useTranslation } from 'react-i18next';
import { BasicButton, BasicModal } from '@actiontech/shared';
import { Space } from 'antd';
import { InfoHexagonOutlined } from '@actiontech/icons';
import { PrivacyModalTitleStyleWrapper } from './style';

export interface PrivacyAuthorizationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const PrivacyAuthorizationModal: React.FC<PrivacyAuthorizationModalProps> = ({
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
          <div className="icon authorization-icon">
            <InfoHexagonOutlined color="currentColor" width={20} height={20} />
          </div>
          {t('dmsAccount.privacy.authorization.title')}
        </PrivacyModalTitleStyleWrapper>
      }
      open={open}
      destroyOnClose
      footer={
        <Space>
          <BasicButton onClick={onCancel} disabled={loading}>
            {t('dmsAccount.privacy.authorization.cancel')}
          </BasicButton>
          <BasicButton type="primary" onClick={onConfirm} loading={loading}>
            {t('dmsAccount.privacy.authorization.confirm')}
          </BasicButton>
        </Space>
      }
    >
      <p>{t('dmsAccount.privacy.authorization.content')}</p>
    </BasicModal>
  );
};

export default PrivacyAuthorizationModal;
