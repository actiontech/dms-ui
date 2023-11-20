import { useCallback, useMemo, useState } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import { Select, SelectProps } from 'antd5';
import { IDriverMeta } from '@actiontech/shared/lib/api/sqle/service/common';
import { DatabaseTypeLogo } from '@actiontech/shared';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../store';

const useDatabaseType = () => {
  const [driverNameList, setDriverNameList] = useState<string[]>([]);
  const [driverMeta, setDriverMeta] = useState<IDriverMeta[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();
  const dbServiceDrivers = useSelector(
    (state: IReduxState) => state.database.driverMeta
  );

  const getLogoUrlByDbType = useCallback(
    (dbType: string) => {
      if (!dbType) return '';

      return (
        dbServiceDrivers.find((v) => v.db_type === dbType)?.logo_path ?? ''
      );
    },
    [dbServiceDrivers]
  );

  const updateDriverNameList = useCallback(() => {
    setTrue();
    configuration
      .getDriversV2()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setDriverMeta(res.data.data ?? []);
          setDriverNameList(
            res.data.data?.map((v) => v.driver_name ?? '') ?? []
          );
        } else {
          setDriverNameList([]);
          setDriverMeta([]);
        }
      })
      .catch(() => {
        setDriverMeta([]);
        setDriverNameList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateDriverSelectOptions = useCallback(() => {
    return driverMeta.map((v) => {
      return (
        <Select.Option key={v.driver_name} value={v.driver_name}>
          <DatabaseTypeLogo
            dbType={v.driver_name ?? ''}
            logoUrl={getLogoUrlByDbType(v.driver_name ?? '')}
          />
        </Select.Option>
      );
    });
  }, [driverMeta, getLogoUrlByDbType]);

  const dbTypeOptions: SelectProps['options'] = useMemo(() => {
    return driverMeta.map((item) => ({
      label: (
        <DatabaseTypeLogo
          dbType={item.driver_name ?? ''}
          logoUrl={getLogoUrlByDbType(item.driver_name ?? '')}
        />
      ),
      value: item.driver_name
    }));
  }, [driverMeta, getLogoUrlByDbType]);

  return {
    driverNameList,
    loading,
    updateDriverNameList,
    generateDriverSelectOptions,
    getLogoUrlByDbType,
    driverMeta,
    dbTypeOptions
  };
};
export default useDatabaseType;
