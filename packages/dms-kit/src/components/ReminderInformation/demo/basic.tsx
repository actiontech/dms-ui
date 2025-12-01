import { Space } from 'antd';
import { ReminderInformation } from '@actiontech/dms-kit';

const BasicDemo: React.FC = () => {
  return (
    <Space direction="vertical">
      <ReminderInformation
        status="success"
        message="操作已成功完成！数据已保存到系统中。"
      />
      <ReminderInformation
        status="error"
        message="操作失败！请检查输入信息后重试。"
      />
    </Space>
  );
};

export default BasicDemo;
