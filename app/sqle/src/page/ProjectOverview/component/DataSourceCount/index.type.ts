import { DBHealthEnum } from './index.enum';

export type DataSourceCountDataType = {
  type: string;
  value: number;
  category: DBHealthEnum;
  instanceNames: string;
};
