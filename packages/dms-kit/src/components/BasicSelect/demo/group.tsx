import React from 'react';
import { BasicSelect, ConfigProvider } from '@actiontech/dms-kit';

const GroupDemo = () => {
  const options = [
    {
      label: '水果',
      options: [
        { label: '苹果', value: 'apple' },
        { label: '香蕉', value: 'banana' },
        { label: '橙子', value: 'orange' },
      ],
    },
    {
      label: '蔬菜',
      options: [
        { label: '胡萝卜', value: 'carrot' },
        { label: '白菜', value: 'cabbage' },
        { label: '土豆', value: 'potato' },
      ],
    },
    {
      label: '肉类',
      options: [
        { label: '猪肉', value: 'pork' },
        { label: '牛肉', value: 'beef' },
        { label: '鸡肉', value: 'chicken' },
      ],
    },
  ];

  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicSelect 
          placeholder="请选择食物分类" 
          options={options}
        />
        <BasicSelect 
          mode="multiple"
          placeholder="请选择多个食物" 
          options={options}
        />
      </div>
    </ConfigProvider>
  );
};

export default GroupDemo;
