export const turnDataSourceAsyncFormToCommon = <
  T extends {
    description?: string;
    name?: string;
    type?: string;
    value?: string;
  }[]
>(
  data: T
): Array<{
  desc?: string;
  key?: string;
  type?: string;
  value?: string;
}> => {
  return data.map((item) => ({
    desc: item.description,
    key: item.name,
    type: item.type,
    value: item.value
  }));
};

export const turnCommonToDataSourceParams = <
  T extends {
    key?: string;
    value?: string;
  }[]
>(
  data: T
): Array<{
  name?: string;
  value?: string;
}> => {
  return data.map((item) => ({
    name: item.key,
    value: item.value
  }));
};

export const REDIS_CONNECTION_MODE_PARAM_NAME = 'connection_mode';

export type RedisConnectionMode = 'standalone' | 'cluster';

export const DEFAULT_REDIS_CONNECTION_MODE: RedisConnectionMode = 'standalone';

export const isRedisDbType = (dbType?: string): boolean => {
  return dbType?.toLowerCase() === 'redis';
};

export const getRedisConnectionModeFromParams = <
  T extends {
    name?: string;
    key?: string;
    value?: string;
  }[]
>(
  params?: T
): RedisConnectionMode => {
  const value = params?.find(
    (item) =>
      item.name === REDIS_CONNECTION_MODE_PARAM_NAME ||
      item.key === REDIS_CONNECTION_MODE_PARAM_NAME
  )?.value;

  return value === 'cluster' ? 'cluster' : DEFAULT_REDIS_CONNECTION_MODE;
};

export const filterRedisConnectionModeParam = <
  T extends {
    name?: string;
    key?: string;
  }[]
>(
  params: T
): T => {
  return params.filter(
    (item) =>
      item.name !== REDIS_CONNECTION_MODE_PARAM_NAME &&
      item.key !== REDIS_CONNECTION_MODE_PARAM_NAME
  ) as T;
};

export const mergeRedisConnectionModeIntoParams = <
  T extends {
    name?: string;
    value?: string;
  }[]
>(
  params: T | undefined,
  dbType?: string,
  connectionMode?: RedisConnectionMode
): T => {
  const nextParams = filterRedisConnectionModeParam(params ?? []) as T;

  if (!isRedisDbType(dbType)) {
    return nextParams;
  }

  return [
    ...nextParams,
    {
      name: REDIS_CONNECTION_MODE_PARAM_NAME,
      value: connectionMode ?? DEFAULT_REDIS_CONNECTION_MODE
    }
  ] as T;
};
