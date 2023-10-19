import React from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';
import DatabaseTypeLogo from '../../components/DatabaseTypeLogo';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import { IDriverMeta } from '@actiontech/shared/lib/api/sqle/service/common';

const useDatabaseType = () => {
  const [driverNameList, setDriverNameList] = React.useState<string[]>([]);
  const [driverMeta, setDriverMeta] = React.useState<IDriverMeta[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();
  const updateDriverNameList = React.useCallback(() => {
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

  const generateDriverSelectOptions = React.useCallback(() => {
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

  return {
    driverNameList,
    loading,
    updateDriverNameList,
    generateDriverSelectOptions,
    driverMeta
  };
};
export default useDatabaseType;
