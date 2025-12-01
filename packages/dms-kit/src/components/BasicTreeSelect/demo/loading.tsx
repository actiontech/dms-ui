import { useState } from 'react';
import { BasicTreeSelect, ConfigProvider } from '@actiontech/dms-kit';
import { Button, Space } from 'antd';

const LoadingTreeSelectDemo = () => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<any[]>([]);

  const loadData = () => {
    setLoading(true);
    // 模拟异步加载数据
    setTimeout(() => {
      setTreeData([
        {
          title: '加载完成的数据',
          value: 'loaded',
          children: [
            {
              title: '子项 1',
              value: 'child1'
            },
            {
              title: '子项 2',
              value: 'child2'
            }
          ]
        }
      ]);
      setLoading(false);
    }, 2000);
  };

  const clearData = () => {
    setTreeData([]);
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Button onClick={loadData} type="primary">
            加载数据
          </Button>
          <Button onClick={clearData}>清空数据</Button>
        </Space>

        <BasicTreeSelect
          style={{ width: '100%' }}
          placeholder="请选择（支持加载状态）"
          treeData={treeData}
          loading={loading}
          allowClear
        />
      </Space>
    </ConfigProvider>
  );
};

export default LoadingTreeSelectDemo;
