import { IDatabaseComparisonObject } from '@actiontech/shared/lib/api/sqle/service/common';

export const INSTANCE_SCHEMA_SEPARATOR = '_INSTANCE_SCHEMA_SEPARATOR_';

export const parse2DatabaseCompareObject = (
  value?: string
): IDatabaseComparisonObject => {
  if (!value) {
    return {};
  }
  if (value.includes(INSTANCE_SCHEMA_SEPARATOR)) {
    const [instanceId, schemaName] = value.split(INSTANCE_SCHEMA_SEPARATOR);
    return {
      instance_id: instanceId,
      schema_name: schemaName
    };
  }
  return {
    instance_id: value
  };
};
