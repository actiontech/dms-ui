import React from 'react';
import { DatabaseTypeLogo } from '@actiontech/shared';
import { Select } from 'antd5';
import { useDbServiceDriver } from '@actiontech/shared/lib/global';

const useDatabaseType = () => {
  const { driverMeta, driverNameList, loading, getDriverMeta } =
    useDbServiceDriver();

  const generateDriverSelectOptions = React.useCallback(() => {
    return driverMeta.map((v) => {
      return (
        <Select.Option key={v.db_type} value={v.db_type}>
          <DatabaseTypeLogo
            dbType={v.db_type ?? ''}
            logoUrl={v.logo_path ?? ''}
          />
        </Select.Option>
      );
    });
  }, [driverMeta]);

  return {
    driverNameList,
    loading,
    getDriverMeta,
    generateDriverSelectOptions,
    driverMeta
  };
};
export default useDatabaseType;
