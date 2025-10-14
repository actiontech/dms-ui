import React, { useState } from 'react';
import {
  EditableSelect,
  ConfigProvider,
  EditableSelectOption,
  EditableSelectValue
} from '@actiontech/dms-kit';
import { message } from 'antd';

const EditableSelectAsyncDemo = () => {
  const [value, setValue] = useState<EditableSelectValue>('');
  const [options, setOptions] = useState<EditableSelectOption[]>([
    { value: 'tag1', label: '前端开发' },
    { value: 'tag2', label: '后端开发' },
    { value: 'tag3', label: '数据库管理' }
  ]);
  const [loading, setLoading] = useState(false);

  // 模拟异步添加
  const handleAsyncAdd = async (label: string) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 模拟验证重复
      if (options.some((opt) => opt.label === label)) {
        message.error('标签名称已存在');
        return;
      }

      const newOption: EditableSelectOption = {
        value: `tag_${Date.now()}`,
        label: label
      };

      setOptions((prev) => [...prev, newOption]);
      setValue(newOption.value as string);
      message.success(`成功添加标签: ${label}`);
    } catch (error) {
      message.error('添加失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 模拟异步更新
  const handleAsyncUpdate = async (updatedOption: EditableSelectOption) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOptions((prev) =>
        prev.map((opt) =>
          opt.value === updatedOption.value
            ? { ...opt, label: updatedOption.label }
            : opt
        )
      );
      message.success(`成功更新标签: ${updatedOption.label}`);
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 模拟异步删除（带确认）
  const handleAsyncDelete = async (
    optionToDelete: EditableSelectOption
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 模拟删除验证
      if (optionToDelete.value === 'tag1') {
        message.error('系统标签不可删除');
        return false;
      }

      setOptions((prev) =>
        prev.filter((opt) => opt.value !== optionToDelete.value)
      );
      if (value === optionToDelete.value) {
        setValue('');
      }
      message.success(`成功删除标签: ${optionToDelete.label}`);
      return true;
    } catch (error) {
      message.error('删除失败，请重试');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider>
      <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
        <h3>异步操作演示</h3>
        <p style={{ color: '#666', marginBottom: 24 }}>
          演示与后端API交互的场景，包括异步的添加、更新和删除操作
        </p>

        <EditableSelect
          value={value}
          onChange={(val) => setValue(val)}
          options={options}
          onAdd={handleAsyncAdd}
          onUpdate={handleAsyncUpdate}
          onDelete={handleAsyncDelete}
          loading={loading}
          placeholder="选择或添加技能标签"
          addButtonText="添加技能标签"
          deletionConfirmTitle="确定要删除这个技能标签吗？"
        />

        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: '#f6f8fa',
            borderRadius: 6,
            fontSize: 14
          }}
        >
          <h4 style={{ margin: '0 0 8px 0' }}>操作说明：</h4>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>添加操作会验证名称重复，有 1.5 秒延迟</li>
            <li>更新操作有 1 秒延迟模拟网络请求</li>
            <li>删除操作有 0.8 秒延迟，"前端开发"标签无法删除</li>
            <li>所有操作都有加载状态和错误处理</li>
          </ul>
        </div>

        <div style={{ marginTop: 16, color: '#666' }}>
          <p>
            当前选择:{' '}
            {value ? options.find((opt) => opt.value === value)?.label : '无'}
          </p>
          <p>可用标签: {options.map((opt) => opt.label).join(', ')}</p>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default EditableSelectAsyncDemo;
