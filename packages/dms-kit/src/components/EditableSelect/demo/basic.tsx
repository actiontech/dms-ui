import React, { useState } from 'react';
import {
  EditableSelect,
  ConfigProvider,
  EditableSelectOption
} from '@actiontech/dms-kit';
import { message } from 'antd';

const EditableSelectBasicDemo = () => {
  const [value, setValue] = useState<string>('option1');
  const [options, setOptions] = useState<EditableSelectOption[]>([
    { value: 'option1', label: '选项 1' },
    { value: 'option2', label: '选项 2' },
    { value: 'option3', label: '选项 3' }
  ]);

  const handleChange = (newValue: string | number) => {
    setValue(newValue as string);
    message.success(
      `选择了: ${options.find((opt) => opt.value === newValue)?.label}`
    );
  };

  const handleAdd = (label: string) => {
    const newOption: EditableSelectOption = {
      value: `option_${Date.now()}`,
      label: label
    };
    setOptions((prev) => [...prev, newOption]);
    message.success(`添加成功: ${label}`);
  };

  const handleUpdate = (updatedOption: EditableSelectOption) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.value === updatedOption.value
          ? { ...opt, label: updatedOption.label }
          : opt
      )
    );
    message.success(`更新成功: ${updatedOption.label}`);
  };

  const handleDelete = (optionToDelete: EditableSelectOption) => {
    setOptions((prev) =>
      prev.filter((opt) => opt.value !== optionToDelete.value)
    );
    if (value === optionToDelete.value) {
      setValue('');
    }
    message.success(`删除成功: ${optionToDelete.label}`);
  };

  return (
    <ConfigProvider>
      <div style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
        <h3>基础可编辑选择器</h3>
        <EditableSelect
          value={value}
          onChange={handleChange}
          options={options}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          placeholder="请选择一个选项"
          addButtonText="添加新选项"
        />

        <div style={{ marginTop: 16, color: '#666' }}>
          <p>当前选择的值: {value || '无'}</p>
          <p>支持的操作:</p>
          <ul>
            <li>点击选择选项</li>
            <li>点击 + 号添加新选项</li>
            <li>点击编辑图标修改选项名称</li>
            <li>点击删除图标移除选项</li>
          </ul>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default EditableSelectBasicDemo;
