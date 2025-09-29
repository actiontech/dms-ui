import React from 'react';
import { BasicInputNumber, ConfigProvider } from '@actiontech/dms-kit';

const FormatterDemo = () => {
  return (
    <ConfigProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInputNumber
          placeholder="百分比格式"
          formatter={(value) => `${value}%`}
          parser={(value) => value!.replace('%', '')}
        />
        <BasicInputNumber
          placeholder="货币格式"
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        />
        <BasicInputNumber
          placeholder="千分位格式"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value!.replace(/,/g, '')}
        />
      </div>
    </ConfigProvider>
  );
};

export default FormatterDemo;
