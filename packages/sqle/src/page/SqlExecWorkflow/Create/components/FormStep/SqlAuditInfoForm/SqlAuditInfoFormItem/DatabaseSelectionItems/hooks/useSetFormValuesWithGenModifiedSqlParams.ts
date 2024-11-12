import { useRequest } from 'ahooks';
import databaseCompareService from '@actiontech/shared/lib/api/sqle/service/database_comparison';
import { IGenDatabaseDiffModifySQLsV1Params } from '@actiontech/shared/lib/api/sqle/service/database_comparison/index.d';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { jsonParse } from '@actiontech/shared/lib/utils/Common';
import { IDatabaseDiffModifySQL } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { FormInstance } from 'antd';
import {
  SqlAuditInfoFormFields,
  SqlStatementFields
} from '../../../../../../index.type';
import { SAME_SQL_MODE_DEFAULT_FIELD_KEY } from '../../../../../../../Common/SqlStatementFormController/SqlStatementFormItem/index.data';
import { useTypedQuery } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { useMemo } from 'react';

type Params = {
  form: FormInstance<SqlAuditInfoFormFields>;
  handleInstanceNameChange?: (name: string) => void;
  handleInstanceChange: (key: string, instanceName?: string) => void;
  handleInstanceSchemaChange: (key: string, schemaName?: string) => void;
  setGetModifiedSQLsPending: (val: boolean) => void;
};

const useSetFormValuesWithGenModifiedSqlParams = ({
  form,
  handleInstanceChange,
  handleInstanceSchemaChange,
  handleInstanceNameChange,
  setGetModifiedSQLsPending
}: Params) => {
  const extraQueries = useTypedQuery();

  const searchParams = useMemo(() => {
    return extraQueries(ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create);
  }, [extraQueries]);

  const getExistSchemaName = (schemaList: string[], schemaName?: string) => {
    if (schemaName && schemaList.includes(schemaName)) {
      return schemaName;
    }

    return undefined;
  };

  const setFormValues = async (
    comparisonInstanceName: string,
    dbExistingSchemas: string[],
    databaseDiffModifiedSqlInfos: IDatabaseDiffModifySQL[]
  ) => {
    handleInstanceNameChange?.(comparisonInstanceName);

    form.setFieldsValue({
      isSameSqlForAll: databaseDiffModifiedSqlInfos.length === 0,
      databaseInfo: databaseDiffModifiedSqlInfos.map((item) => {
        return {
          instanceName: comparisonInstanceName,
          instanceSchema: item.schema_name
        };
      })
    });

    if (databaseDiffModifiedSqlInfos.length === 1) {
      const schemaName = getExistSchemaName(
        dbExistingSchemas,
        databaseDiffModifiedSqlInfos[0].schema_name
      );

      await handleInstanceChange(
        SAME_SQL_MODE_DEFAULT_FIELD_KEY,
        comparisonInstanceName
      );
      handleInstanceSchemaChange(SAME_SQL_MODE_DEFAULT_FIELD_KEY, schemaName);
      form.setFieldsValue({
        isSameSqlForAll: true,
        databaseInfo: [
          {
            instanceName: comparisonInstanceName,
            instanceSchema: schemaName
          }
        ],
        [SAME_SQL_MODE_DEFAULT_FIELD_KEY]: {
          form_data: databaseDiffModifiedSqlInfos[0].modify_sqls
            ?.flatMap((v) => v.sql_statement)
            ?.join('\n')
        } as SqlStatementFields
      });
    } else {
      for (
        let index = 0;
        index < databaseDiffModifiedSqlInfos.length;
        index++
      ) {
        handleInstanceChange(index.toString(), comparisonInstanceName);

        handleInstanceSchemaChange(
          index.toString(),
          getExistSchemaName(
            dbExistingSchemas,
            databaseDiffModifiedSqlInfos[index].schema_name
          )
        );
      }
      const sqlParams = databaseDiffModifiedSqlInfos.reduce<
        Record<string, SqlStatementFields>
      >((acc, curr, index) => {
        return {
          ...acc,
          [index]: {
            form_data: curr.modify_sqls
              ?.flatMap((v) => v.sql_statement)
              ?.join('\n')
          }
        };
      }, {} as Record<string, SqlStatementFields>);
      form.setFieldsValue({
        isSameSqlForAll: false,
        databaseInfo: databaseDiffModifiedSqlInfos.map((item) => {
          return {
            instanceName: comparisonInstanceName,
            instanceSchema: getExistSchemaName(
              dbExistingSchemas,
              item.schema_name
            )
          };
        }),
        ...sqlParams
      });
    }
  };

  useRequest(
    () => {
      const params = jsonParse<
        IGenDatabaseDiffModifySQLsV1Params & {
          comparisonInstanceName: string;
          dbExistingSchemas: string[];
        }
      >(
        decompressFromEncodedURIComponent(
          searchParams?.gen_modified_sql_params!
        )
      );
      const { comparisonInstanceName, dbExistingSchemas, ...apiParams } =
        params;
      setGetModifiedSQLsPending(true);
      return databaseCompareService
        .genDatabaseDiffModifySQLsV1(apiParams)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setFormValues(
              comparisonInstanceName,
              dbExistingSchemas,
              res.data.data ?? []
            );
          }
        })
        .finally(() => {
          setGetModifiedSQLsPending(false);
        });
    },
    {
      ready: !!searchParams && !!searchParams?.gen_modified_sql_params
    }
  );
};

export default useSetFormValuesWithGenModifiedSqlParams;
