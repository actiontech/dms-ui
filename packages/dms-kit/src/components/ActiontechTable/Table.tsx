import { Result } from 'antd';
import { ActiontechTableColumn, ActiontechTableProps } from './index.type';
import ToolBar from './components/Toolbar';
import FilterContainer from './components/FilterContainer';
import { useTranslation } from 'react-i18next';
import { ActiontechTableStyleWrapper } from './style';
import useTableAction from './hooks/useTableAction';
import classnames from 'classnames';
import { useEffect, useMemo, useContext } from 'react';
import useTableSettings from './hooks/useTableSettings';
import { ActiontechTableContext } from './context';

const ActiontechTable = <
  T extends Record<string, any>,
  F extends Record<string, any>,
  OtherColumnKeys extends string = never
>({
  className,
  errorMessage,
  columns = [],
  isPaginationFixed = true,
  toolbar,
  filterContainerProps,
  enableOnlyRenderMoreButtons = false,
  ...props
}: ActiontechTableProps<T, F, OtherColumnKeys>) => {
  const { t } = useTranslation();

  const tableContextValue = useContext(ActiontechTableContext);

  const tableSetting = tableContextValue?.setting ?? props.setting;

  const setting = tableSetting ?? (toolbar && toolbar.setting);
  const { tableName = '', username = '' } = setting || {};

  const { renderActionInTable } = useTableAction();
  const { catchDefaultColumnsInfo, localColumns } = useTableSettings<
    T,
    F,
    OtherColumnKeys
  >(tableName, username);

  const mergerColumns = useMemo(() => {
    const operatorColumn = renderActionInTable<T>(
      props.actions,
      enableOnlyRenderMoreButtons
    );

    return (
      operatorColumn ? [...columns, operatorColumn] : columns
    ) as ActiontechTableColumn<T, F, OtherColumnKeys>;
  }, [
    columns,
    props.actions,
    renderActionInTable,
    enableOnlyRenderMoreButtons
  ]);

  const innerColumns = useMemo(() => {
    if (!tableSetting) {
      return mergerColumns;
    }
    return mergerColumns
      .filter((v) => localColumns?.[v.dataIndex]?.show)
      .map((v) => ({
        ...v,
        fixed: localColumns?.[v.dataIndex]?.fixed,
        order: localColumns?.[v.dataIndex]?.order
      }))
      .sort((prev, current) => prev.order - current.order);
  }, [localColumns, mergerColumns, tableSetting]);

  useEffect(() => {
    if (tableName && username) {
      catchDefaultColumnsInfo(mergerColumns);
    }
  }, [catchDefaultColumnsInfo, mergerColumns, tableName, username]);

  return (
    <>
      {toolbar && (
        <ToolBar {...toolbar} setting={setting}>
          {toolbar.children}
        </ToolBar>
      )}

      {!!filterContainerProps && <FilterContainer {...filterContainerProps} />}

      <ActiontechTableStyleWrapper
        className={classnames('actiontech-table-namespace', className)}
        locale={{
          emptyText: errorMessage ? (
            <Result
              status="error"
              title={t('common.request.noticeFailTitle')}
              subTitle={errorMessage}
            />
          ) : undefined
        }}
        scroll={{
          x: 'max-content'
        }}
        {...props}
        columns={innerColumns}
        pagination={
          !props.pagination
            ? false
            : {
                defaultPageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => (
                  <span>
                    {t('common.actiontechTable.pagination.total', {
                      total
                    })}
                  </span>
                ),
                className: classnames('actiontech-table-pagination', {
                  'actiontech-table-pagination-fixed': isPaginationFixed
                }),
                ...props.pagination
              }
        }
      />
    </>
  );
};

export default ActiontechTable;
