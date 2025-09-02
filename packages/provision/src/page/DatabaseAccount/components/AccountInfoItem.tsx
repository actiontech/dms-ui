import { AccountInfoItemStyleWrapper } from '../style';
import { EmptyBox } from '@actiontech/shared';
import { Space } from 'antd';

export const AccountInfoItem: React.FC<{
  label?: string;
  children?: React.ReactNode;
  value?: string;
}> = ({ label, value, children }) => {
  return (
    <AccountInfoItemStyleWrapper>
      <EmptyBox if={!!label}>
        <div className="audit-info-item-label">{label}</div>
      </EmptyBox>

      <Space wrap align="center" className="audit-info-item-value">
        {children || value || '-'}
      </Space>
    </AccountInfoItemStyleWrapper>
  );
};

export default AccountInfoItem;
