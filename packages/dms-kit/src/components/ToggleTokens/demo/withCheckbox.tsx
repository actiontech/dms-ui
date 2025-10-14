import React, { useState } from 'react';
import { Card, Space, Tag, Divider } from 'antd';
import { ToggleTokens, ConfigProvider } from '@actiontech/dms-kit';

const WithCheckboxDemo: React.FC = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'search',
    'filter'
  ]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'read',
    'write'
  ]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>复选框样式</h3>

        <Card title="功能特性选择" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            {selectedFeatures.length > 0 ? (
              selectedFeatures.map((feature) => (
                <Tag key={feature} color="blue" style={{ marginBottom: '4px' }}>
                  {feature}
                </Tag>
              ))
            ) : (
              <Tag color="default">无选择</Tag>
            )}
          </div>
          <ToggleTokens
            value={selectedFeatures}
            onChange={setSelectedFeatures}
            options={[
              { label: '搜索功能', value: 'search' },
              { label: '筛选功能', value: 'filter' },
              { label: '排序功能', value: 'sort' },
              { label: '导出功能', value: 'export' },
              { label: '批量操作', value: 'batch' }
            ]}
            multiple={true}
            withCheckbox={true}
          />

          <Divider />

          <div>
            <h4>复选框样式特点:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>选中的令牌会显示复选框图标</li>
              <li>提供更直观的选中状态反馈</li>
              <li>适合需要明确选中状态的场景</li>
              <li>图标和文字组合显示</li>
            </ul>
          </div>
        </Card>

        <Card title="权限选择" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            {selectedPermissions.length > 0 ? (
              selectedPermissions.map((permission) => (
                <Tag
                  key={permission}
                  color="green"
                  style={{ marginBottom: '4px' }}
                >
                  {permission}
                </Tag>
              ))
            ) : (
              <Tag color="default">无选择</Tag>
            )}
          </div>
          <ToggleTokens
            value={selectedPermissions}
            onChange={setSelectedPermissions}
            options={[
              { label: '读取权限', value: 'read' },
              { label: '写入权限', value: 'write' },
              { label: '删除权限', value: 'delete' },
              { label: '管理权限', value: 'admin' }
            ]}
            multiple={true}
            withCheckbox={true}
          />
        </Card>

        <Card title="模块选择">
          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginRight: '8px' }}>当前选中:</span>
            {selectedModules.length > 0 ? (
              selectedModules.map((module) => (
                <Tag
                  key={module}
                  color="orange"
                  style={{ marginBottom: '4px' }}
                >
                  {module}
                </Tag>
              ))
            ) : (
              <Tag color="default">无选择</Tag>
            )}
          </div>
          <ToggleTokens
            value={selectedModules}
            onChange={setSelectedModules}
            options={[
              { label: '用户管理', value: 'user' },
              { label: '角色管理', value: 'role' },
              { label: '权限管理', value: 'permission' },
              { label: '系统设置', value: 'setting' },
              { label: '日志管理', value: 'log' }
            ]}
            multiple={true}
            withCheckbox={true}
          />

          <Divider />

          <div>
            <h4>配置说明:</h4>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px'
              }}
            >
              {`withCheckbox={true} // 启用复选框样式

// 需要同时设置 multiple={true}
// 选中的令牌会显示复选框图标
// 提供更直观的视觉反馈`}
            </pre>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default WithCheckboxDemo;
