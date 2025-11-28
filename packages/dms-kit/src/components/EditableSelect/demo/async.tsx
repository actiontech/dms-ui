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
      </div>
    </ConfigProvider>
  );
};

export default EditableSelectAsyncDemo;
