import React from 'react';
import {
  ActiontechTableContextProvide,
  ActiontechTableContextType
} from '../common/context';
import { Spin } from 'antd';

interface TableWrapperProps extends ActiontechTableContextType {
  loading?: boolean;
  children: React.ReactNode;
}

const TableWrapper: React.FC<TableWrapperProps> = ({
  loading,
  children,
  ...restProps
}) => {
  return (
    <ActiontechTableContextProvide value={restProps}>
      <Spin spinning={loading}>{children}</Spin>
    </ActiontechTableContextProvide>
  );
};

export default TableWrapper;
