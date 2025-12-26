import React, { useMemo, useState } from 'react';
import { ActiontechTable, ConfigProvider } from '@actiontech/dms-kit';
import type { ActiontechTableColumn } from '@actiontech/dms-kit';
import { Space, Switch, Tag, Typography, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined
} from '@ant-design/icons';

interface RecordItem {
  id: number;
  name: string;
  status: 'enabled' | 'disabled';
}

const mockData: RecordItem[] = [
  { id: 1, name: '示例数据 A', status: 'enabled' },
  { id: 2, name: '示例数据 B', status: 'disabled' },
  { id: 3, name: '示例数据 C', status: 'enabled' }
];

const EnableOnlyRenderMoreButtonsDemo: React.FC = () => {
  const [enableOnlyRenderMoreButtons, setEnableOnlyRenderMoreButtons] =
    useState(false);

  const columns: ActiontechTableColumn<
    RecordItem,
    Record<string, any>
  > = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id', width: 80 },
      { title: '名称', dataIndex: 'name', width: 200 },
      {
        title: '状态',
        dataIndex: 'status',
        width: 120,
        render: (status) => (
          <Tag color={status === 'enabled' ? 'green' : 'default'}>
            {status === 'enabled' ? '启用' : '禁用'}
          </Tag>
        )
      }
    ],
    []
  );

  return (
    <ConfigProvider>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space align="center">
          <Typography.Text strong>enableOnlyRenderMoreButtons</Typography.Text>
          <Switch
            checked={enableOnlyRenderMoreButtons}
            onChange={setEnableOnlyRenderMoreButtons}
          />
          <Typography.Text type="secondary">
            {enableOnlyRenderMoreButtons
              ? '所有操作都在“更多”里（不自动外露按钮）'
              : '当 buttons 为空时，会从 moreButtons 自动外露最多 2 个按钮'}
          </Typography.Text>
        </Space>

        <ActiontechTable<RecordItem, Record<string, any>>
          rowKey="id"
          dataSource={mockData}
          columns={columns}
          pagination={false}
          enableOnlyRenderMoreButtons={enableOnlyRenderMoreButtons}
          actions={{
            title: '操作',
            width: 220,
            fixed: 'right',
            // 关键点：buttons 为空数组
            buttons: [],
            moreButtons: (record) => [
              {
                key: 'view',
                text: '查看',
                icon: <EyeOutlined />,
                onClick: () => message.info(`查看：${record.name}`)
              },
              {
                key: 'edit',
                text: '编辑',
                icon: <EditOutlined />,
                onClick: () => message.info(`编辑：${record.name}`)
              },
              {
                key: 'more',
                text: '更多信息',
                icon: <MoreOutlined />,
                onClick: () => message.info(`更多信息：${record.name}`)
              },
              {
                key: 'delete',
                text: '删除',
                icon: <DeleteOutlined />,
                confirm: () => ({
                  title: `确定删除 "${record.name}" 吗？`,
                  onConfirm: () => message.success(`已删除：${record.name}`)
                })
              }
            ]
          }}
        />
      </Space>
    </ConfigProvider>
  );
};

export default EnableOnlyRenderMoreButtonsDemo;
