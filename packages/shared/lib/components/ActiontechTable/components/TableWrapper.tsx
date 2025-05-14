import React from 'react';
import {
  ActiontechTableContextProvide,
  ActiontechTableContextType
} from '../context';
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
      {typeof loading === 'boolean' ? (
        <Spin spinning={loading}>{children}</Spin>
      ) : (
        children
      )}
    </ActiontechTableContextProvide>
  );
};

export default TableWrapper;
