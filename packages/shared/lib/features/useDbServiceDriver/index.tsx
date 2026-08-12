import React, { useCallback } from 'react';
import { useRequest } from 'ahooks';
import DBService from '../../api/base/service/DBService';
import { ResponseCode, DatabaseTypeLogo } from '@actiontech/dms-kit';
import { useDispatch } from 'react-redux';
import { updateDriverMeta } from '../../../../base/src/store/database';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../base/src/store';
import { Select } from 'antd';

/** Local near-square icon adapted from gbase.svg; overrides 1×1 API placeholder for GBase-8a only. */
const GBASE_8A_DB_TYPE = 'GBase-8a';
const GBASE_8A_LOGO_URL = '/db_type_logo/gbase-8a.svg';

const resolveLogoUrlByDbType = (
  dbType: string,
  apiLogoPath?: string | null
): string => {
  if (dbType === GBASE_8A_DB_TYPE) {
    return GBASE_8A_LOGO_URL;
  }
  return apiLogoPath ?? '';
};

const useDbServiceDriver = () => {
  const dispatch = useDispatch();
  const driverMeta = useSelector(
    (state: IReduxState) => state.database.driverMeta
  );
  const [driverNameList, setDriverNameList] = React.useState<string[]>([]);
  const [isDriverInfoFetched, setDriverInfoFetched] = React.useState(false);

  const {
    loading,
    run: updateDriverList,
    runAsync: updateDriverListAsync
  } = useRequest(() => DBService.ListDBServiceDriverOption(), {
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        dispatch(updateDriverMeta(res.data.data ?? []));
        setDriverNameList(res.data.data?.map((v) => v.db_type ?? '') ?? []);
      } else {
        dispatch(updateDriverMeta([]));
        setDriverNameList([]);
      }
    },
    onError: () => {
      dispatch(updateDriverMeta([]));
      setDriverNameList([]);
    },
    onFinally: () => {
      setDriverInfoFetched(true);
    }
  });

  const getLogoUrlByDbType = useCallback(
    (dbType: string) => {
      if (!dbType) return '';

      const apiLogoPath = driverMeta.find(
        (driver) => dbType === driver?.db_type
      )?.logo_path;
      return resolveLogoUrlByDbType(dbType, apiLogoPath);
    },
    [driverMeta]
  );

  const dbDriverOptions = driverNameList.map((item) => ({
    value: item,
    text: item,
    label: <DatabaseTypeLogo dbType={item} logoUrl={getLogoUrlByDbType(item)} />
  }));

  const generateDriverSelectOptions = React.useCallback(() => {
    return driverMeta.map((v) => {
      const dbType = v.db_type ?? '';
      return (
        <Select.Option key={v.db_type} value={v.db_type}>
          <DatabaseTypeLogo
            dbType={dbType}
            logoUrl={resolveLogoUrlByDbType(dbType, v.logo_path)}
          />
        </Select.Option>
      );
    });
  }, [driverMeta]);

  return {
    driverNameList,
    loading,
    driverMeta,
    dbDriverOptions,
    updateDriverList,
    updateDriverListAsync,
    getLogoUrlByDbType,
    generateDriverSelectOptions,
    isDriverInfoFetched,
    setDriverInfoFetched
  };
};
export default useDbServiceDriver;
