import React, { useState } from 'react';
import { BasicTreeSelect, ConfigProvider } from '@actiontech/dms-kit';
import { TreeSelectProps } from 'antd';

const BasicTreeSelectDemo = () => {
  const [value, setValue] = useState<string>();

  const treeData: TreeSelectProps['treeData'] = [
    {
      title: '前端开发',
      value: 'frontend',
      children: [
        {
          title: 'React',
          value: 'react'
        },
        {
          title: 'Vue',
          value: 'vue'
        },
        {
          title: 'Angular',
          value: 'angular'
        }
      ]
    },
    {
      title: '后端开发',
      value: 'backend',
      children: [
        {
          title: 'Node.js',
          value: 'nodejs'
        },
        {
          title: 'Java',
          value: 'java'
        },
        {
          title: 'Python',
          value: 'python'
        }
      ]
    }
  ];

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <ConfigProvider>
      <BasicTreeSelect
        style={{ width: '100%' }}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择技术栈"
        treeData={treeData}
        treeDefaultExpandAll
        onChange={onChange}
      />
    </ConfigProvider>
  );
};

export default BasicTreeSelectDemo;

