import { ModeSwitcher, ConfigProvider } from '@actiontech/dms-kit';

const BasicDemo: React.FC = () => {
  const viewOptions = [
    {
      label: '网格视图',
      value: 'grid'
    },
    {
      label: '列表视图',
      value: 'list'
    },
    {
      label: '表格视图',
      value: 'table'
    }
  ];

  return (
    <ConfigProvider>
      <ModeSwitcher options={viewOptions} />
    </ConfigProvider>
  );
};

export default BasicDemo;
