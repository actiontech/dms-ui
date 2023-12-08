import { Result, ConfigProvider } from 'antd';
import { ActiontechTableProps } from './index.type';
import ToolBar from './components/Toolbar';
import FilterContainer from './components/FilterContainer';
import { useTranslation } from 'react-i18next';
import { ActiontechTableStyleWrapper, tableToken } from './style';
import useTableAction from './hooks/useTableAction';
import classnames from 'classnames';
import { useEffect, useMemo } from 'react';
import useTableSettings from './hooks/useTableSettings';
import { setClassNameForColumns } from './utils';

const ActiontechTable = <
  T extends Record<string, any>,
  F extends Record<string, any>,
  OtherColumnKeys extends string = ''
>({
  className,
  toolbar,
  errorMessage,
  filterContainerProps,
  columns = [],
  isPaginationFixed = true,
  ...props
}: ActiontechTableProps<T, F, OtherColumnKeys>) => {
  const { t } = useTranslation();

  const setting = props.setting ?? (toolbar && toolbar.setting);
  const { tableName = '', username = '' } = setting || {};

  const { renderActionInTable } = useTableAction();
  const { catchDefaultColumnsInfo, localColumns } = useTableSettings<
    T,
    F,
    OtherColumnKeys
  >(tableName, username);

  const mergerColumns = useMemo(() => {
    const operatorColumn = renderActionInTable<T>(props.actions);

    return operatorColumn ? [...columns, operatorColumn] : columns;
  }, [columns, props.actions, renderActionInTable]);

  const innerColumns = useMemo(() => {
    let temp = mergerColumns;
    if (props.setting) {
      temp = temp
        .filter((v) => localColumns?.[v.dataIndex]?.show)
        .map((v) => ({
          ...v,
          fixed: localColumns?.[v.dataIndex]?.fixed,
          order: localColumns?.[v.dataIndex]?.order
        }))
        .sort((prev, current) => prev.order - current.order);
    }
    return setClassNameForColumns(temp);
  }, [localColumns, mergerColumns, props.setting]);

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

      <ConfigProvider theme={tableToken}>
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
      </ConfigProvider>
    </>
  );
};

export default ActiontechTable;
