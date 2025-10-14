import React, { useState } from 'react';
import { BasicTreeSelect, ConfigProvider } from '@actiontech/dms-kit';
import { TreeSelectProps } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';

const CustomIconTreeSelectDemo = () => {
  const [value, setValue] = useState<string>();

  const treeData: TreeSelectProps['treeData'] = [
    {
      title: '项目结构',
      value: 'project',
      icon: <FolderOutlined />,
      children: [
        {
          title: '源代码',
          value: 'src',
          icon: <FolderOutlined />,
          children: [
            {
              title: '组件',
              value: 'components',
              icon: <FolderOutlined />
            },
            {
              title: '页面',
              value: 'pages',
              icon: <FolderOutlined />
            },
            {
              title: '工具函数',
              value: 'utils',
              icon: <FileOutlined />
            }
          ]
        },
        {
          title: '配置文件',
          value: 'config',
          icon: <FileOutlined />
        },
        {
          title: '文档',
          value: 'docs',
          icon: <FolderOutlined />
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
        placeholder="请选择项目结构"
        treeData={treeData}
        treeDefaultExpandAll
        onChange={onChange}
        // showIcon
      />
    </ConfigProvider>
  );
};

export default CustomIconTreeSelectDemo;
