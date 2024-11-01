import {
  IGetComparisonStatementsReqV1,
  IDatabaseComparisonStatementsResV1,
  IGetDatabaseComparisonReqV1,
  IDatabaseComparisonResV1,
  IGenModifylSQLReqV1,
  IGenModifySQLResV1
} from '../common.d';

export interface IGetComparisonStatementV1Params
  extends IGetComparisonStatementsReqV1 {
  project_name: string;
}

export interface IGetComparisonStatementV1Return
  extends IDatabaseComparisonStatementsResV1 {}

export interface IExecuteDatabaseComparisonV1Params
  extends IGetDatabaseComparisonReqV1 {
  project_name: string;
}

export interface IExecuteDatabaseComparisonV1Return
  extends IDatabaseComparisonResV1 {}

export interface IGenDatabaseDiffModifySQLsV1Params
  extends IGenModifylSQLReqV1 {
  project_name: string;
}

export interface IGenDatabaseDiffModifySQLsV1Return
  extends IGenModifySQLResV1 {}
