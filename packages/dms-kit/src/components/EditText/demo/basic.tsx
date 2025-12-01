import React, { useState } from 'react';
import { Space, Divider, Button, message } from 'antd';
import { EditText, ConfigProvider } from '@actiontech/dms-kit';

/**
 * 基础使用
 * - 点击编辑
 * - 自动保存
 * - 受控模式
 * - 空值编辑
 */
const BasicDemo: React.FC = () => {
  const [text1, setText1] = useState('点击此处编辑文本');
  const [text2, setText2] = useState('带字符限制的文本（最多20字）');
  const [text3, setText3] = useState('多行文本\n支持换行编辑');

  // 受控模式
  const [controlledText, setControlledText] = useState('受控模式的文本');
  const [editing, setEditing] = useState(false);

  // 空值编辑
  const [emptyText1, setEmptyText1] = useState('');
  const [emptyText2, setEmptyText2] = useState('');

  const handleControlledEdit = (value: string) => {
    setControlledText(value);
    setEditing(false);
    message.success('保存成功');
  };

  return (
    <ConfigProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 基础编辑 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          基础编辑（点击文本进入编辑，回车或失焦保存）：
        </div>
        <EditText
          value={text1}
          editable={{
            onChange: setText1
          }}
        />

        <Divider />

        {/* 字符限制 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          字符长度限制（最多 20 字符）：
        </div>
        <EditText
          value={text2}
          editable={{
            onChange: setText2,
            maxLength: 20
          }}
        />

        <Divider />

        {/* 多行文本 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>多行文本编辑：</div>
        <EditText
          value={text3}
          editable={{
            onChange: setText3,
            autoSize: { minRows: 2, maxRows: 6 }
          }}
        />

        <Divider />

        {/* 受控模式 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          受控模式（外部控制编辑状态）：
        </div>
        <Space>
          <div style={{ width: '300px' }}>
            <EditText
              value={controlledText}
              editable={{
                editing: editing,
                onChange: setControlledText,
                onStart: () => setEditing(true),
                onEnd: handleControlledEdit,
                onCancel: () => setEditing(false)
              }}
            />
          </div>
          <Button
            type="primary"
            size="small"
            onClick={() => setEditing(true)}
            disabled={editing}
          >
            进入编辑
          </Button>
          <Button
            size="small"
            onClick={() => setEditing(false)}
            disabled={!editing}
          >
            取消
          </Button>
        </Space>

        <Divider />

        {/* 空值编辑 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          空值编辑（默认按钮）：
        </div>
        <EditText
          value={emptyText1}
          editable={{
            onChange: setEmptyText1
          }}
        />

        <Divider />

        {/* 自定义编辑按钮 */}
        <div style={{ color: '#666', marginBottom: '8px' }}>
          空值编辑（自定义按钮文字）：
        </div>
        <EditText
          value={emptyText2}
          editable={{
            onChange: setEmptyText2
          }}
          editButtonProps={{
            children: '点击添加描述'
          }}
        />
      </Space>
    </ConfigProvider>
  );
};

export default BasicDemo;
