import { ListDBServicesFilterLastConnectionTestStatusEnum } from '@actiontech/shared/lib/api/base/service/DBService/index.enum';
import { SelectProps } from 'antd';
import { useMemo } from 'react';
import { databaseTestConnectionStatusDictionary } from './index.data';

const useStaticTips = () => {
  const generateDatabaseTestConnectionStatusSelectOptions: SelectProps['options'] =
    useMemo(() => {
      return Object.values(
        ListDBServicesFilterLastConnectionTestStatusEnum
      ).map((v) => ({
        label: databaseTestConnectionStatusDictionary[v],
        value: v
      }));
    }, []);

  return {
    generateDatabaseTestConnectionStatusSelectOptions
  };
};

export default useStaticTips;
