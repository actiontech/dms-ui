import {
  getOperationSetsParamsSerializer,
  generateDataPermissionValueByDataPermission
} from '../index.utils';

describe('provision/DatabaseAccount/utils', () => {
  it('should `getOperationSetsParamsSerializer` return params string', async () => {
    expect(
      getOperationSetsParamsSerializer({
        data_object_uids: ['123', '456'],
        page_index: 1,
        page_size: 9999
      })
    ).toEqual(
      'data_object_uids=123&data_object_uids=456&page_index=1&page_size=9999'
    );
  });

  it('should `generateDataPermissionValueByDataPermission` return permissions', async () => {
    expect(
      generateDataPermissionValueByDataPermission(
        [
          {
            data_objects: [
              {
                table_uid: '',
                database_uid: '',
                name: '*.*'
              }
            ],
            data_operations: [
              {
                uid: '601000',
                name: '全部'
              }
            ],
            data_permission_different: {
              original_data_permission: ''
            }
          },
          {
            data_objects: [
              {
                table_uid: '1797453400250519552',
                database_uid: '1797453400233742336',
                name: 'mysql.columns_priv'
              }
            ],
            data_operations: [
              {
                uid: '601001',
                name: '读取'
              },
              {
                uid: '601005',
                name: '授权'
              }
            ],
            data_permission_different: {
              original_data_permission: ''
            }
          },
          {
            data_objects: [
              {
                table_uid: '',
                database_uid: '1797453400233742336',
                name: 'mysql.*'
              },
              {
                table_uid: '',
                database_uid: '1797453400485400576',
                name: 'sys.*'
              }
            ],
            data_operations: [
              {
                uid: '601000',
                name: '全部'
              }
            ],
            data_permission_different: {
              original_data_permission: ''
            }
          },
          {
            data_objects: [
              {
                table_uid: '',
                database_uid: '1797453400233742336',
                name: 'mysql.*'
              },
              {
                table_uid: '',
                database_uid: '1797453400485400576',
                name: 'sys.*'
              },
              {
                table_uid: '',
                database_uid: '1797453400485400576',
                name: 'sys.columns_priv'
              },
              {
                table_uid: '1797453400233742336',
                database_uid: '1797453400485400576',
                name: 'sys.columns_priv2'
              }
            ],
            data_operations: [
              {
                uid: '601000',
                name: '全部'
              }
            ],
            data_permission_different: {
              original_data_permission: ''
            }
          }
        ],
        '123456'
      )
    ).toEqual([
      {
        id: '601000',
        objectsLabel: ['*.*'],
        objectsParams: ['123456'],
        objectsValue: [{ database: undefined, tables: undefined }],
        operationsLabel: ['全部'],
        operationsValue: ['601000']
      },
      {
        id: '17974534002337423361797453400250519552601001601005',
        objectsLabel: ['mysql.columns_priv'],
        objectsParams: ['1797453400250519552'],
        objectsValue: [
          { database: '1797453400233742336', tables: ['1797453400250519552'] }
        ],
        operationsLabel: ['读取', '授权'],
        operationsValue: ['601001', '601005']
      },
      {
        id: '17974534002337423361797453400485400576601000',
        objectsLabel: ['mysql.*', 'sys.*'],
        objectsParams: ['1797453400233742336', '1797453400485400576'],
        objectsValue: [
          { database: '1797453400233742336', tables: undefined },
          { database: '1797453400485400576', tables: undefined }
        ],
        operationsLabel: ['全部'],
        operationsValue: ['601000']
      },
      {
        id: '179745340023374233617974534004854005761797453400233742336601000',
        objectsLabel: [
          'mysql.*',
          'sys.*',
          'sys.columns_priv',
          'sys.columns_priv2'
        ],
        objectsParams: ['1797453400233742336', '1797453400233742336'],
        objectsValue: [
          { database: '1797453400233742336', tables: undefined },
          { database: '1797453400485400576', tables: ['1797453400233742336'] }
        ],
        operationsLabel: ['全部'],
        operationsValue: ['601000']
      }
    ]);
  });
});
