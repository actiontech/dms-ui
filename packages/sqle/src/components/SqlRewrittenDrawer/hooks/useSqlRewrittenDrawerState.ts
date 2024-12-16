import { useBoolean } from 'ahooks';
import { SqlRewrittenDrawerProps } from '../index.type';
import { useCallback, useState } from 'react';

const useSqlRewrittenDrawerState = () => {
  const [sqlRewrittenOpen, { setTrue, setFalse }] = useBoolean(false);

  const [originSqlInfo, setOriginInfo] =
    useState<SqlRewrittenDrawerProps['originSqlInfo']>();

  const handleOpenSqlRewrittenDrawer = useCallback(() => {
    setTrue();
  }, [setTrue]);

  const handleCloseSqlRewrittenDrawer = useCallback(() => {
    setFalse();
    setOriginInfo(undefined);
  }, [setFalse]);

  return {
    sqlRewrittenOpen,
    handleOpenSqlRewrittenDrawer,
    handleCloseSqlRewrittenDrawer,
    originSqlInfo,
    setOriginInfo
  };
};

export default useSqlRewrittenDrawerState;
