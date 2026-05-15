import { useBoolean } from 'ahooks';
import { SqlRewrittenDrawerProps } from '../index.type';
import { useCallback, useState } from 'react';

const useSqlRewrittenDrawerState = () => {
  const [
    sqlRewrittenOpen,
    { setTrue: handleOpenSqlRewrittenDrawer, setFalse }
  ] = useBoolean(false);

  const [originSqlInfo, handleChangeOriginInfo] =
    useState<SqlRewrittenDrawerProps['originSqlInfo']>();

  const handleCloseSqlRewrittenDrawer = useCallback(() => {
    setFalse();
    handleChangeOriginInfo(undefined);
  }, [setFalse]);

  return {
    sqlRewrittenOpen,
    handleOpenSqlRewrittenDrawer,
    handleCloseSqlRewrittenDrawer,
    originSqlInfo,
    handleChangeOriginInfo
  };
};

export default useSqlRewrittenDrawerState;
