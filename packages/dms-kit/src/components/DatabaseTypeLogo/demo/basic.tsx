import React from 'react';
import { Space, Card, Divider } from 'antd';
import { DatabaseTypeLogo } from '@actiontech/dms-kit';

/**
 * ## 基础使用
 *
 * 演示 DatabaseTypeLogo 的基本功能：
 * - 显示数据库类型的图标和名称
 * - 图标宽度固定为 16px，名称跟随其后
 * - 鼠标悬停显示完整的数据库类型名称
 */
const BasicDemo: React.FC = () => {
  // 模拟数据库类型列表
  const databaseTypes = [
    {
      dbType: 'MySQL',
      logoUrl:
        'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
    },
    {
      dbType: 'Oracle',
      logoUrl:
        'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
    }
  ];

  return (
    <Space direction="vertical" size="middle">
      {databaseTypes.map((db) => (
        <DatabaseTypeLogo
          key={db.dbType}
          dbType={db.dbType}
          logoUrl={db.logoUrl}
        />
      ))}
    </Space>
  );
};

export default BasicDemo;
