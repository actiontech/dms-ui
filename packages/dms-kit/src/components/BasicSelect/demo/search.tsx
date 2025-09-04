import React from 'react';
import { BasicSelect, ConfigProvider } from '@actiontech/dms-kit';

const SearchDemo = () => {
  const options = [
    { label: '苹果', value: 'apple' },
    { label: '香蕉', value: 'banana' },
    { label: '橙子', value: 'orange' },
    { label: '葡萄', value: 'grape' },
    { label: '西瓜', value: 'watermelon' },
    { label: '草莓', value: 'strawberry' }
  ];

  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicSelect
          showSearch
          placeholder="请搜索并选择水果"
          options={options}
          filterOption={(input, option) =>
            `${option?.label ?? ''}`.toLowerCase().includes(input.toLowerCase())
          }
        />
        <BasicSelect
          showSearch
          placeholder="支持输入搜索"
          options={options}
          filterOption={false}
          onSearch={(value) => console.log('搜索:', value)}
        />
        <BasicSelect
          mode="tags"
          showSearch
          placeholder="请输入或搜索标签"
          options={options}
        />
      </div>
    </ConfigProvider>
  );
};

export default SearchDemo;
