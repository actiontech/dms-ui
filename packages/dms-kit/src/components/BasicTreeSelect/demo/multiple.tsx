import React, { useState } from 'react';
import { BasicTreeSelect, ConfigProvider } from '@actiontech/dms-kit';
import { TreeSelectProps } from 'antd';

const MultipleTreeSelectDemo = () => {
  const [value, setValue] = useState<string>();

  const treeData: TreeSelectProps['treeData'] = [
    {
      title: '数据库',
      value: 'database',
      children: [
        {
          title: 'MySQL',
          value: 'mysql'
        },
        {
          title: 'PostgreSQL',
          value: 'postgresql'
        },
        {
          title: 'MongoDB',
          value: 'mongodb'
        }
      ]
    },
    {
      title: '缓存',
      value: 'cache',
      children: [
        {
          title: 'Redis',
          value: 'redis'
        },
        {
          title: 'Memcached',
          value: 'memcached'
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
        placeholder="请选择数据库技术（可多选）"
        treeData={treeData}
        treeCheckable
        multiple={true}
        onChange={onChange}
      />
    </ConfigProvider>
  );
};

export default MultipleTreeSelectDemo;
