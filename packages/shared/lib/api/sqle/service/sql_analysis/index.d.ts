import {
  IDirectGetSQLAnalysisResV1,
  ISQLLineageAnalyzeReqV1,
  ISQLLineageAnalyzeResV1
} from '../common.d';

export interface IDirectGetSQLAnalysisV1Params {
  project_name: string;

  instance_name: string;

  schema_name?: string;

  sql?: string;
}

export interface IDirectGetSQLAnalysisV1Return
  extends IDirectGetSQLAnalysisResV1 {}

export interface ISqlLineageAnalyzeV1Params extends ISQLLineageAnalyzeReqV1 {}

export interface ISqlLineageAnalyzeV1Return extends ISQLLineageAnalyzeResV1 {}
