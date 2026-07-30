import { createContext } from 'react';
import useCheckConnectable from '../hooks/useCheckConnectable';
import useCheckPrivileges from '../hooks/useCheckPrivileges';

type DataSourceFormContextType = ReturnType<typeof useCheckConnectable> &
  ReturnType<typeof useCheckPrivileges> & {
    submitLoading: boolean;
  };

const DataSourceFormContext = createContext<DataSourceFormContextType | null>(
  null
);

DataSourceFormContext.displayName = 'DataSourceFormContext';

const DataSourceFormContextProvide = DataSourceFormContext.Provider;

export { DataSourceFormContext, DataSourceFormContextProvide };

export type { DataSourceFormContextType };
