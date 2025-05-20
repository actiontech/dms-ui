import { act, renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import useSetFormValuesWithGenModifiedSqlParams from '../hooks/useSetFormValuesWithGenModifiedSqlParams';
import DatabaseComparisonMockService from '@actiontech/shared/lib/testUtil/mockApi/sqle/database_comparison';
import { compressToEncodedURIComponent } from 'lz-string';
import { DatabaseObjectObjectTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SAME_SQL_MODE_DEFAULT_FIELD_KEY } from '../../../../../../../Common/SqlStatementFormController/SqlStatementFormItem/index.data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { genDatabaseDiffModifySQLsMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/database_comparison/data';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn()
  };
});

describe('useSetFormValuesWithGenModifiedSqlParams', () => {
  const useSearchParamsSpy: jest.Mock = useSearchParams as jest.Mock;
  const setFieldsValueSpy = jest.fn();
  const handleInstanceChangeSpy = jest.fn();
  const handleInstanceSchemaChangeSpy = jest.fn();
  const handleInstanceNameChangeSpy = jest.fn();
  const setGetModifiedSQLsPendingSpy = jest.fn();
  let genDatabaseDiffModifySQLsSpy: jest.SpyInstance;
  const apiParams = {
    project_name: 'default',
    base_instance_id: '1861344168081625088',
    comparison_instance_id: '1861344168081625088',
    database_schema_objects: [
      {
        base_schema_name: 'dms',
        comparison_schema_name: 'sqle',
        database_objects: [
          {
            object_name: 'audit_files',
            object_type: DatabaseObjectObjectTypeEnum.TABLE
          },
          {
            object_name: 'audit_plan_report_sqls_v2',
            object_type: DatabaseObjectObjectTypeEnum.TABLE
          }
        ]
      }
    ]
  };
  const dbExistingSchemas = ['schema'];
  const comparisonInstanceName = 'test-instance-name';

  const customRender = () => {
    return renderHook(() =>
      useSetFormValuesWithGenModifiedSqlParams({
        form: { setFieldsValue: setFieldsValueSpy } as any,
        handleInstanceChange: handleInstanceChangeSpy,
        handleInstanceSchemaChange: handleInstanceSchemaChangeSpy,
        handleInstanceNameChange: handleInstanceNameChangeSpy,
        setGetModifiedSQLsPending: setGetModifiedSQLsPendingSpy
      })
    );
  };

  beforeEach(() => {
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        gen_modified_sql_params: compressToEncodedURIComponent(
          JSON.stringify({
            ...apiParams,
            comparisonInstanceName,
            dbExistingSchemas
          })
        )
      })
    ]);
    jest.useFakeTimers();
    genDatabaseDiffModifySQLsSpy =
      DatabaseComparisonMockService.mockGenDatabaseDiffModifySQLsV1();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should call the API and set form values correctly with one result', async () => {
    genDatabaseDiffModifySQLsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [genDatabaseDiffModifySQLsMockData[0]] })
    );

    customRender();

    expect(genDatabaseDiffModifySQLsSpy).toHaveBeenCalledTimes(1);
    expect(genDatabaseDiffModifySQLsSpy).toHaveBeenCalledWith(apiParams);

    expect(setGetModifiedSQLsPendingSpy).toHaveBeenCalledTimes(1);
    expect(setGetModifiedSQLsPendingSpy).toHaveBeenNthCalledWith(1, true);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(setGetModifiedSQLsPendingSpy).toHaveBeenCalledTimes(2);
    expect(setGetModifiedSQLsPendingSpy).toHaveBeenNthCalledWith(2, false);
    expect(handleInstanceNameChangeSpy).toHaveBeenCalledWith(
      'test-instance-name'
    );
    expect(handleInstanceChangeSpy).toHaveBeenCalledWith(
      SAME_SQL_MODE_DEFAULT_FIELD_KEY,
      'test-instance-name'
    );
    expect(handleInstanceSchemaChangeSpy).toHaveBeenCalledWith(
      SAME_SQL_MODE_DEFAULT_FIELD_KEY,
      undefined
    );
    expect(setFieldsValueSpy).toHaveBeenCalledTimes(2);

    expect(setFieldsValueSpy).toHaveBeenNthCalledWith(1, {
      databaseInfo: [
        {
          instanceName: 'test-instance-name',
          instanceSchema: 'test'
        }
      ],
      isSameSqlForAll: false
    });

    expect(setFieldsValueSpy).toHaveBeenNthCalledWith(2, {
      [SAME_SQL_MODE_DEFAULT_FIELD_KEY]: {
        form_data: genDatabaseDiffModifySQLsMockData[0].modify_sqls
          ?.map((v) => v.sql_statement)
          .join('\n')
      },
      databaseInfo: [
        {
          instanceName: 'test-instance-name',
          instanceSchema: undefined
        }
      ],
      isSameSqlForAll: true
    });
  });

  it('should call the API and set form values correctly with multiple results', async () => {
    customRender();

    expect(genDatabaseDiffModifySQLsSpy).toHaveBeenCalledTimes(1);
    expect(genDatabaseDiffModifySQLsSpy).toHaveBeenCalledWith(apiParams);

    expect(setGetModifiedSQLsPendingSpy).toHaveBeenCalledTimes(1);
    expect(setGetModifiedSQLsPendingSpy).toHaveBeenNthCalledWith(1, true);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(setGetModifiedSQLsPendingSpy).toHaveBeenCalledTimes(2);
    expect(setGetModifiedSQLsPendingSpy).toHaveBeenNthCalledWith(2, false);
    expect(handleInstanceNameChangeSpy).toHaveBeenCalledWith(
      'test-instance-name'
    );
    expect(handleInstanceChangeSpy).toHaveBeenCalledWith(
      SAME_SQL_MODE_DEFAULT_FIELD_KEY,
      'test-instance-name'
    );
    expect(handleInstanceSchemaChangeSpy).toHaveBeenCalledWith(
      SAME_SQL_MODE_DEFAULT_FIELD_KEY,
      undefined
    );
    expect(setFieldsValueSpy).toHaveBeenCalledTimes(2);

    expect(setFieldsValueSpy).toHaveBeenNthCalledWith(1, {
      databaseInfo: [
        {
          instanceName: 'test-instance-name',
          instanceSchema: 'test'
        },
        {
          instanceName: 'test-instance-name',
          instanceSchema: 'test2'
        },
        {
          instanceName: 'test-instance-name',
          instanceSchema: 'test3'
        }
      ],
      isSameSqlForAll: false
    });

    expect(setFieldsValueSpy).toHaveBeenNthCalledWith(2, {
      '0': {
        form_data: genDatabaseDiffModifySQLsMockData[0].modify_sqls
          ?.map((v) => v.sql_statement)
          .join('\n')
      },
      '1': {
        form_data: genDatabaseDiffModifySQLsMockData[1].modify_sqls
          ?.map((v) => v.sql_statement)
          .join('\n')
      },
      '2': {
        form_data: genDatabaseDiffModifySQLsMockData[2].modify_sqls
          ?.map((v) => v.sql_statement)
          .join('\n')
      },
      databaseInfo: [
        {
          instanceName: 'test-instance-name'
        },
        {
          instanceName: 'test-instance-name'
        },
        {
          instanceName: 'test-instance-name'
        }
      ],
      isSameSqlForAll: false
    });
  });

  it('should not call the API if searchParams or gen_modified_sql_params is missing', () => {
    useSearchParamsSpy.mockReturnValue([new URLSearchParams({})]);
    customRender();
    expect(genDatabaseDiffModifySQLsSpy).not.toHaveBeenCalled();
  });
});
