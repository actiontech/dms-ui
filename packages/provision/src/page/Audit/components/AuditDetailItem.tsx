import { AuthAuditDetailItemStyleWrapper } from './style';
import { AvatarCom, EmptyBox } from '@actiontech/shared';
import { IconTimeLine } from '@actiontech/shared/lib/Icon/common';
import { Space } from 'antd';
import AuditActionIcon from './AuditActionIcon';
import { AuditDetailItemProps } from './AuditDetailItem.d';

export const AuditDetailItem: React.FC<AuditDetailItemProps> = ({
  label,
  value,
  type,
  children
}) => {
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
      <EmptyBox if={!!label}>
        <div className="audit-info-item-label">{label}</div>
      </EmptyBox>

      <Space wrap align="center" className="audit-info-item-value">
        {iconRender()}
        {children || value || '-'}
      </Space>
    </AuthAuditDetailItemStyleWrapper>
  );
};

export default AuditDetailItem;
