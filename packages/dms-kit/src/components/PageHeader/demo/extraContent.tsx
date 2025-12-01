import { Space } from 'antd';
import { PageHeader, ConfigProvider } from '@actiontech/dms-kit';
import {
  PlusOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { BasicButton } from '@actiontech/dms-kit';

const ExtraContentDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <PageHeader
        title="用户管理"
        extra={
          <Space>
            <BasicButton icon={<PlusOutlined />} type="primary">
              添加用户
            </BasicButton>
            <BasicButton icon={<DownloadOutlined />}>导出数据</BasicButton>
            <BasicButton icon={<ReloadOutlined />}>刷新</BasicButton>
          </Space>
        }
      />
    </ConfigProvider>
  );
};

export default ExtraContentDemo;
