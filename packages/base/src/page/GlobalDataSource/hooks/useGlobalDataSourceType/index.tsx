import React, { useMemo, useState } from 'react';
import { useBoolean } from 'ahooks';
import { useDbServiceDriver } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/dms-kit';
import { DatabaseTypeLogo } from '@actiontech/dms-kit';
import DBService from '@actiontech/shared/lib/api/base/service/DBService';
const useGlobalDataSourceType = () => {
  const [dbTypeList, setDBTypeList] = useState<string[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();
  const { getLogoUrlByDbType } = useDbServiceDriver();
  const updateDbTypeList = React.useCallback(() => {
    setTrue();
    DBService.ListGlobalDBServicesTips()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setDBTypeList(res.data?.data?.db_type ?? []);
        }
      })
      .catch(() => {
        setDBTypeList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);
  const dbTypeOptions = useMemo(() => {
    return dbTypeList.map((item) => ({
      value: item,
      text: item,
      label: (
        <DatabaseTypeLogo dbType={item} logoUrl={getLogoUrlByDbType(item)} />
      )
    }));
  }, [dbTypeList, getLogoUrlByDbType]);
  return {
    updateDbTypeList,
    loading,
    dbTypeList,
    dbTypeOptions
  };
};
export default useGlobalDataSourceType;
