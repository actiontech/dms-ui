import { Space } from 'antd5';
import { cloneDeep } from 'lodash';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TableSchemaItem, UseTableSchemaOption } from '.';
import { ResponseCode } from '../../../data/common';
import useBackendTable from '../../../hooks/useBackendTable/useBackendTable1';
import HighlightCode from '../../../utils/HighlightCode';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { EmptyBox, BasicTable, BasicResult } from '@actiontech/shared';
import Icon from '@ant-design/icons/lib/components/Icon';
import { IconError } from '@actiontech/shared/lib/Icon';

const useTableSchema = (options?: UseTableSchemaOption) => {
  const { t } = useTranslation();
  const { schemaName, dataSourceName } = options ?? {};

  const idFactory = useCallback(
    (tableName: string) => {
      return `${tableName}-${schemaName}-${dataSourceName}`;
    },
    [dataSourceName, schemaName]
  );

  const [tableSchemas, setTableSchemas] = useState<TableSchemaItem[]>([]);

  const getTableSchemas = useCallback(
    async (tableName: string, projectName: string) => {
      if (!schemaName || !dataSourceName) {
        setTableSchemas([]);
        return;
      }
      const oldItemIndex = tableSchemas.findIndex(
        (v) => v.id === idFactory(tableName)
      );
      const newTableSchemas = cloneDeep(tableSchemas);
      const res = await instance.getTableMetadata({
        instance_name: dataSourceName,
        schema_name: schemaName,
        table_name: tableName,
        project_name: projectName
      });
      if (oldItemIndex !== -1) {
        newTableSchemas.splice(oldItemIndex, 1);
      }
      const item = {
        id: idFactory(tableName),
        tableMeta: res.data.data ?? {},
        errorMessage: ''
      };
      if (res.data.code !== ResponseCode.SUCCESS) {
        item.errorMessage = res.data.message ?? '';
      }
      newTableSchemas.push(item);
      setTableSchemas(newTableSchemas);
    },
    [dataSourceName, idFactory, schemaName, tableSchemas]
  );

  const closeTableSchema = (id: string) => {
    setTableSchemas(tableSchemas.filter((v) => v.id !== id));
  };

  const { tableColumnFactory } = useBackendTable();

  const generateTableSchemaContent = <
    T extends Pick<TableSchemaItem, 'errorMessage' | 'tableMeta'> & {
      isShow?: boolean;
    }
  >(
    item: T
  ) => {
    const renderTableColumnTable = () => {
      return (
        <>
          <h3 className="header-title">
            {t('sqlQuery.databaseTables.columns')}
          </h3>
          <BasicTable
            columns={tableColumnFactory(item.tableMeta.columns?.head ?? [])}
            dataSource={item.tableMeta.columns?.rows}
            pagination={false}
          />
        </>
      );
    };

    const renderTableIndexTable = () => {
      return (
        <>
          <h3 className="header-title">{t('sqlQuery.databaseTables.index')}</h3>
          <BasicTable
            columns={tableColumnFactory(item.tableMeta.indexes?.head ?? [])}
            dataSource={item.tableMeta.indexes?.rows}
            pagination={false}
          />
        </>
      );
    };

    const renderCreateTableSql = () => {
      return (
        <>
          <h3 className="header-title">
            {t('sqlQuery.databaseTables.createdTableSql')}
          </h3>
          <section className="basic-cont-wrapper sql-cont">
            <pre
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(
                  item.tableMeta.create_table_sql ?? ''
                )
              }}
            />
          </section>
        </>
      );
    };
    const renderErrorMessage = () => {
      if (!!item.tableMeta.message) {
        return (
          <BasicResult
            status="error"
            title={item.tableMeta.message}
            icon={<Icon component={IconError} />}
          />
        );
      }
      if (!!item.errorMessage) {
        return (
          <BasicResult
            status="error"
            title={t('common.request.noticeFailTitle')}
            subTitle={item.errorMessage}
          />
        );
      }
      return undefined;
    };

    const hasError = !!item.errorMessage || !!item.tableMeta.message;

    return (
      <EmptyBox if={!hasError} defaultNode={renderErrorMessage()}>
        <Space
          size={0}
          direction="vertical"
          className="full-width-element"
          hidden={typeof item.isShow === 'boolean' ? !item.isShow : false}
        >
          {renderTableColumnTable()}
          {renderTableIndexTable()}
          {renderCreateTableSql()}
        </Space>
      </EmptyBox>
    );
  };

  return {
    tableSchemas,
    closeTableSchema,
    getTableSchemas,
    generateTableSchemaContent
  };
};

export default useTableSchema;
