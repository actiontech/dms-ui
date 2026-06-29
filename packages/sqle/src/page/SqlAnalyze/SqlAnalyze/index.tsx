import { ResultStatusType } from 'antd/es/result';
import SqlAnalyze from './SqlAnalyze';
import {
  IPerformanceStatistics,
  ISqlManageRemediation,
  ISQLExplain,
  ITableMeta,
  ITableMetas
} from '@actiontech/shared/lib/api/sqle/service/common';
import { ISqlManageRuleExceptionContext } from '../../RuleException/index.data';
import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type SqlAnalyzeProps = {
  errorMessage: string;
  errorType?: ResultStatusType;
  tableMetas?: ITableMetas;
  sqlExplain?: ISQLExplain;
  performanceStatistics?: IPerformanceStatistics;
  remediationCompare?: ISqlManageRemediation;
  remediationLoadFailed?: boolean;
  sqlManageId?: string;
  sqlManageContext?: ISqlManageRuleExceptionContext;
  status?: SqlManageStatusEnum | string;
  onRemediationRefresh?: () => void;
  loading?: boolean;
};

export type UseTableSchemaOption = {
  schemaName?: string;
  dataSourceName?: string;
};

export type TableSchemaItem = {
  tableMeta: ITableMeta;
  id: string;
  errorMessage: string;
};

export default SqlAnalyze;
