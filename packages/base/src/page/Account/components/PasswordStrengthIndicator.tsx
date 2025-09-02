import React from 'react';
import { useTranslation } from 'react-i18next';
import { Progress } from 'antd';
import { styled } from '@mui/system';
import { getPasswordStrength } from '../../../utils/passwordComplexity';

const PasswordStrengthWrapper = styled('div')`
  margin-top: 8px;

  .strength-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    font-size: 12px;

    .strength-text {
      &.weak {
        color: #ff4d4f;
      }
      &.medium {
        color: #faad14;
      }
      &.strong {
        color: #52c41a;
      }
    }
  }
`;

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password
}) => {
  const { t } = useTranslation();

  if (!password) {
    return null;
  }

  const strength = getPasswordStrength(password);

  const getStrengthConfig = () => {
    switch (strength) {
      case 'weak':
        return {
          percent: 33,
          status: 'exception' as const,
          color: '#ff4d4f',
          text: t('dmsAccount.passwordComplexity.strengthWeak')
        };
      case 'medium':
        return {
          percent: 66,
          status: 'active' as const,
          color: '#faad14',
          text: t('dmsAccount.passwordComplexity.strengthMedium')
        };
      case 'strong':
        return {
          percent: 100,
          status: 'success' as const,
          color: '#52c41a',
          text: t('dmsAccount.passwordComplexity.strengthStrong')
        };
      default:
        return {
          percent: 0,
          status: 'exception' as const,
          color: '#ff4d4f',
          text: ''
        };
    }
  };

  const config = getStrengthConfig();

  return (
    <PasswordStrengthWrapper>
      <div className="strength-label">
        <span>{t('dmsAccount.passwordComplexity.strengthLabel')}:</span>
        <span className={`strength-text ${strength}`}>{config.text}</span>
      </div>
      <Progress
        percent={config.percent}
        status={config.status}
        strokeColor={config.color}
        showInfo={false}
        size="small"
      />
    </PasswordStrengthWrapper>
  );
};

export default PasswordStrengthIndicator;
