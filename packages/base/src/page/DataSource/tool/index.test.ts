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
    expect(normalizeMongoSeedHosts('10.186.16.126:37018,37019,37020')).toBe(
      '10.186.16.126:37018,10.186.16.126:37019,10.186.16.126:37020'
    );
    expect(
      normalizeMongoParams({
        seed_hosts: '10.186.16.126:37018\n10.186.16.126:37019',
        replica_set: 'rs0'
      })
    ).toEqual({
      seed_hosts: '10.186.16.126:37018,10.186.16.126:37019',
      replica_set: 'rs0'
    });
  });

  it('should validate mongodb seed hosts format', () => {
    expect(
      validateMongoSeedHosts('10.186.16.126:37018,37019,37020')
    ).toBeTruthy();
    expect(validateMongoSeedHosts('10.186.16.126')).toBeFalsy();
    expect(validateMongoSeedHosts('10.186.16.126:70000')).toBeFalsy();
  });

  it('should omit empty mongodb seed hosts from request params', () => {
    expect(
      normalizeMongoRequestParams([
        { name: 'auth_source', value: 'admin' },
        { name: 'seed_hosts', value: '' },
        { name: 'direct_connection', value: 'false' }
      ])
    ).toEqual([
      { name: 'auth_source', value: 'admin' },
      { name: 'direct_connection', value: 'false' }
    ]);
    expect(
      normalizeMongoRequestParams([{ name: 'seed_hosts', value: 'h:27017' }])
    ).toEqual([{ name: 'seed_hosts', value: 'h:27017' }]);
  });
});
