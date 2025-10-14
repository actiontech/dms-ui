import React, { useState } from 'react';
import { BasicTreeSelect, ConfigProvider } from '@actiontech/dms-kit';
import { TreeSelectProps } from 'antd';

const SearchTreeSelectDemo = () => {
  const [value, setValue] = useState<string>();

  const treeData: TreeSelectProps['treeData'] = [
    {
      title: '开发工具',
      value: 'devtools',
      children: [
        {
          title: '代码编辑器',
          value: 'editor',
          children: [
            {
              title: 'VS Code',
              value: 'vscode'
            },
            {
              title: 'WebStorm',
              value: 'webstorm'
            },
            {
              title: 'Sublime Text',
              value: 'sublime'
            }
          ]
        },
        {
          title: '版本控制',
          value: 'vcs',
          children: [
            {
              title: 'Git',
              value: 'git'
            },
            {
              title: 'SVN',
              value: 'svn'
            }
          ]
        }
      ]
    },
    {
      title: '部署工具',
      value: 'deploy',
      children: [
        {
          title: 'Docker',
          value: 'docker'
        },
        {
          title: 'Kubernetes',
          value: 'kubernetes'
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
        placeholder="请选择开发工具（支持搜索）"
        treeData={treeData}
        showSearch
        treeDefaultExpandAll
        onChange={onChange}
        filterTreeNode={(inputValue, treeNode) => {
          return (
            (treeNode?.title
              ?.toString()
              ?.toLowerCase()
              ?.indexOf(inputValue.toLowerCase()) ?? 0) > 0
          );
        }}
      />
    </ConfigProvider>
  );
};

export default SearchTreeSelectDemo;
