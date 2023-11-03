import { AuthAuditDetailItemStyleWrapper } from './style';
import { AvatarCom } from '@actiontech/shared';
import { IconTimeLine } from '@actiontech/shared/lib/Icon/common';
import { Space } from 'antd5';
import AuditActionIcon from './AuditActionIcon';

export const AuditDetailItem: React.FC<{
  label: string;
  children?: React.ReactNode;
  value?: string;
  type?: 'date' | 'user' | 'action';
}> = ({ label, value, type, children }) => {
  const iconRender = () => {
    switch (type) {
      case 'date':
        return <IconTimeLine />;
      case 'user':
        return <AvatarCom name={value} />;
      case 'action':
        return <AuditActionIcon value={value} />;
      default:
        return null;
    }
  };

  return (
    <AuthAuditDetailItemStyleWrapper>
      <div className="audit-info-item-label">{label}</div>
      <Space wrap align="center" className="audit-info-item-value">
        {iconRender()}
        {children || value || '-'}
      </Space>
    </AuthAuditDetailItemStyleWrapper>
  );
};

export default AuditDetailItem;
