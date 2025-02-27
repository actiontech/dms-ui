import {
  IGetDatabaseDriverLogosResV1,
  IGetDatabaseDriverOptionsResV1,
  IGetInstanceTipsResV1,
  IBatchCheckInstanceConnectionsReqV1,
  IBatchGetInstanceConnectionsResV1,
  IGetInstanceConnectableResV1,
  IGetRulesResV1,
  IGetInstanceSchemaResV1,
  IListTableBySchemaResV1,
  IGetTableMetadataResV1,
  IGetInstanceResV2
} from '../common.d';

import { getInstanceTipListV1FunctionalModuleEnum } from './index.enum';

export interface IGetDatabaseDriverLogosParams {
  db_types: string[];
}

export interface IGetDatabaseDriverLogosReturn
  extends IGetDatabaseDriverLogosResV1 {}

export interface IGetDatabaseDriverOptionsReturn
  extends IGetDatabaseDriverOptionsResV1 {}

export interface IGetInstanceTipListV1Params {
  project_name: string;

  filter_db_type?: string;

  filter_by_business?: string;

  filter_workflow_template_id?: string;

  functional_module?: getInstanceTipListV1FunctionalModuleEnum;
}

export interface IGetInstanceTipListV1Return extends IGetInstanceTipsResV1 {}

export interface IBatchCheckInstanceIsConnectableByNameParams
  extends IBatchCheckInstanceConnectionsReqV1 {
  project_name: string;
}

export interface IBatchCheckInstanceIsConnectableByNameReturn
  extends IBatchGetInstanceConnectionsResV1 {}

export interface ICheckInstanceIsConnectableByNameV1Params {
  project_name: string;

  instance_name: string;
}

export interface ICheckInstanceIsConnectableByNameV1Return
  extends IGetInstanceConnectableResV1 {}

export interface IGetInstanceRuleListV1Params {
  project_name: string;

  instance_name: string;
}

export interface IGetInstanceRuleListV1Return extends IGetRulesResV1 {}

export interface IGetInstanceSchemasV1Params {
  project_name: string;

  instance_name: string;
}

export interface IGetInstanceSchemasV1Return extends IGetInstanceSchemaResV1 {}

export interface IListTableBySchemaParams {
  project_name: string;

  instance_name: string;

  schema_name: string;
}

export interface IListTableBySchemaReturn extends IListTableBySchemaResV1 {}

export interface IGetTableMetadataParams {
  project_name: string;

  instance_name: string;

  schema_name: string;

  table_name: string;
}

export interface IGetTableMetadataReturn extends IGetTableMetadataResV1 {}

export interface IGetInstanceV2Params {
  project_name: string;

  instance_name: string;
}

export interface IGetInstanceV2Return extends IGetInstanceResV2 {}
