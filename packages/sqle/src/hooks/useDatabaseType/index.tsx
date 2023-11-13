import { useCallback, useMemo, useState } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import { Select, SelectProps } from 'antd';
import { IDriverMeta } from '@actiontech/shared/lib/api/sqle/service/common';
import { DatabaseTypeLogo } from '@actiontech/shared';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';

const useDatabaseType = () => {
  const [driverNameList, setDriverNameList] = useState<string[]>([]);
  const [driverMeta, setDriverMeta] = useState<IDriverMeta[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();
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
          {/* todo： 临时拼接前缀，使图标显示 */}
          <DatabaseTypeLogo
            dbType={v.driver_name ?? ''}
            logoUrl={`/sqle${v.logo_url}`}
          />
        </Select.Option>
      );
    });
  }, [driverMeta]);

  const dbTypeOptions: SelectProps['options'] = useMemo(() => {
    return driverMeta.map((item) => ({
      label: (
        <DatabaseTypeLogo
          dbType={item.driver_name ?? ''}
          logoUrl={`/sqle${item.logo_url}`}
        />
      ),
      value: item.driver_name
    }));
  }, [driverMeta]);

  return {
    driverNameList,
    loading,
    updateDriverNameList,
    generateDriverSelectOptions,
    driverMeta,
    dbTypeOptions
  };
};
export default useDatabaseType;
