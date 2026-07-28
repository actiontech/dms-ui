import {
  normalizeMongoParams,
  normalizeMongoRequestParams,
  normalizeMongoSeedHosts,
  turnCommonToDataSourceParams,
  turnDataSourceAsyncFormToCommon,
  validateMongoSeedHosts
} from '.';

describe('datasource tool', () => {
  it('should turn data source async params to common', () => {
    expect(
      turnDataSourceAsyncFormToCommon([
        {
          description: '234',
          name: '124',
          type: 'int',
          value: '123'
        }
      ])
    ).toEqual([
      {
        desc: '234',
        key: '124',
        type: 'int',
        value: '123'
      }
    ]);
  });

  it('should turn async form value to data source params', () => {
    expect(
      turnCommonToDataSourceParams([
        {
          key: '124',
          value: '123'
        }
      ])
    ).toEqual([
      {
        name: '124',
        value: '123'
      }
    ]);
  });

  it('should normalize mongodb seed hosts dynamic param', () => {
    expect(normalizeMongoSeedHosts('192.0.2.10:27017,27018,27019')).toBe(
      '192.0.2.10:27017,192.0.2.10:27018,192.0.2.10:27019'
    );
    expect(
      normalizeMongoParams({
        seed_hosts: '192.0.2.10:27017\n192.0.2.11:27017',
        replica_set: 'rs0'
      })
    ).toEqual({
      seed_hosts: '192.0.2.10:27017,192.0.2.11:27017',
      replica_set: 'rs0'
    });
  });

  it('should validate mongodb seed hosts format', () => {
    expect(validateMongoSeedHosts('192.0.2.10:27017,27018,27019')).toBeTruthy();
    expect(validateMongoSeedHosts('192.0.2.10')).toBeFalsy();
    expect(validateMongoSeedHosts('192.0.2.10:70000')).toBeFalsy();
  });

  it('should omit empty mongodb seed hosts from request params', () => {
    expect(
      normalizeMongoRequestParams([
        { name: 'auth_source', value: 'admin' },
        { name: 'seed_hosts', value: '' }
      ])
    ).toEqual([{ name: 'auth_source', value: 'admin' }]);
    expect(
      normalizeMongoRequestParams([{ name: 'seed_hosts', value: 'h:27017' }])
    ).toEqual([{ name: 'seed_hosts', value: 'h:27017' }]);
  });
});
