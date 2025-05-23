import { createContext } from 'react';
import useCheckConnectable from '../hooks/useCheckConnectable';

type DataSourceFormContextType = ReturnType<typeof useCheckConnectable> & {
  submitLoading: boolean;
};

const DataSourceFormContext = createContext<DataSourceFormContextType | null>(
  null
);

DataSourceFormContext.displayName = 'DataSourceFormContext';

const DataSourceFormContextProvide = DataSourceFormContext.Provider;

export { DataSourceFormContext, DataSourceFormContextProvide };

export type { DataSourceFormContextType };
