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

export const MONGODB_SEED_HOSTS_PARAM = 'seed_hosts';

const splitMongoSeedHosts = (value?: string) =>
  (value ?? '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const isValidMongoPort = (value: string) => {
  if (!/^\d+$/.test(value)) {
    return false;
  }
  const port = Number(value);
  return port > 0 && port <= 65535;
};

export const normalizeMongoSeedHosts = (value?: string) => {
  let latestHost = '';
  return splitMongoSeedHosts(value)
    .map((item) => {
      if (/^\d+$/.test(item) && latestHost) {
        return `${latestHost}:${item}`;
      }

      const splitIndex = item.lastIndexOf(':');
      if (splitIndex > 0) {
        latestHost = item.slice(0, splitIndex).trim();
      }

      return item;
    })
    .join(',');
};

export const validateMongoSeedHosts = (value?: string) => {
  const normalizedValue = normalizeMongoSeedHosts(value);
  const seedHosts = splitMongoSeedHosts(normalizedValue);

  if (seedHosts.length === 0) {
    return false;
  }

  return seedHosts.every((item) => {
    const splitIndex = item.lastIndexOf(':');
    if (splitIndex <= 0 || splitIndex === item.length - 1) {
      return false;
    }

    const host = item.slice(0, splitIndex).trim();
    const port = item.slice(splitIndex + 1).trim();
    return !!host && isValidMongoPort(port);
  });
};

export const normalizeMongoParams = <T extends Record<string, unknown>>(
  params?: T
) => {
  if (
    !params ||
    typeof params[MONGODB_SEED_HOSTS_PARAM] !== 'string' ||
    !params[MONGODB_SEED_HOSTS_PARAM]
  ) {
    return params;
  }

  return {
    ...params,
    [MONGODB_SEED_HOSTS_PARAM]: normalizeMongoSeedHosts(
      params[MONGODB_SEED_HOSTS_PARAM] as string
    )
  };
};

export const normalizeMongoRequestParams = <
  T extends { name?: string; value?: string }
>(
  params: T[]
) => {
  return params.filter(
    (item) => item.name !== MONGODB_SEED_HOSTS_PARAM || !!item.value
  );
};
