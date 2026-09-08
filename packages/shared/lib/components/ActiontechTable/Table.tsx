import { Result, ConfigProvider } from 'antd';
import { ActiontechTableProps } from './index.type';
import ToolBar from './components/Toolbar';
import FilterContainer from './components/FilterContainer';
import { useTranslation } from 'react-i18next';
import { ActiontechTableStyleWrapper, tableToken } from './style';
import useTableAction, {
  ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX
} from './hooks/useTableAction';
import classnames from 'classnames';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import useTableSettings from './hooks/useTableSettings';

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
  disableRowHover = false,
  enableBodyScrollY = false,
  scroll,
  ...props
}: ActiontechTableProps<T, F, OtherColumnKeys>) => {
  const { t } = useTranslation();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [bodyScrollY, setBodyScrollY] = useState<number>();
  const hasPagination = !!props.pagination;

  const setting = props.setting ?? (toolbar && toolbar.setting);
  const { tableName = '', username = '' } = setting || {};

  const { renderActionInTable } = useTableAction();
  const { catchDefaultColumnsInfo, localColumns } = useTableSettings<
    T,
    F,
    OtherColumnKeys | typeof ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX
  >(tableName, username);

  const mergerColumns = useMemo(() => {
    const operatorColumn = renderActionInTable<T>(props.actions);

    return operatorColumn ? [...columns, operatorColumn] : columns;
  }, [columns, props.actions, renderActionInTable]);

  const innerColumns = useMemo(() => {
    if (!props.setting) {
      return mergerColumns;
    }
    return mergerColumns
      .filter((v) => localColumns?.[v.dataIndex]?.show ?? true)
      .map((v, index) => ({
        ...v,
        fixed: localColumns?.[v.dataIndex]
          ? localColumns[v.dataIndex].fixed
          : v.fixed,
        // 尚未写入 localStorage 的动态列沿用 mergerColumns 下标，避免 order 为 0 被排到最前
        order: localColumns?.[v.dataIndex]?.order ?? index + 1
      }))
      .sort((prev, current) => prev.order - current.order);
  }, [localColumns, mergerColumns, props.setting]);

  useEffect(() => {
    if (tableName && username) {
      catchDefaultColumnsInfo(mergerColumns);
    }
  }, [catchDefaultColumnsInfo, mergerColumns, tableName, username]);

  const measureBodyScrollY = useCallback(() => {
    if (!enableBodyScrollY || !tableContainerRef.current) {
      setBodyScrollY(undefined);
      return;
    }
    const container = tableContainerRef.current;
    const tableHeader = container.querySelector('.ant-table-thead');
    const pagination = container.querySelector('.ant-table-pagination');
    const containerTop = container.getBoundingClientRect().top;
    const headerHeight = tableHeader?.getBoundingClientRect().height ?? 40;
    const paginationHeight =
      hasPagination && isPaginationFixed
        ? pagination?.getBoundingClientRect().height ?? 60
        : 0;
    const nextBodyScrollY = Math.max(
      120,
      Math.floor(
        window.innerHeight - containerTop - headerHeight - paginationHeight
      )
    );
    setBodyScrollY((previous) =>
      previous === nextBodyScrollY ? previous : nextBodyScrollY
    );
  }, [enableBodyScrollY, hasPagination, isPaginationFixed]);

  useLayoutEffect(() => {
    measureBodyScrollY();
  });

  useEffect(() => {
    if (!enableBodyScrollY || !tableContainerRef.current) {
      return;
    }
    const observedElements: Element[] = [];
    let element: Element | null = tableContainerRef.current;
    while (element && observedElements.length < 4) {
      observedElements.push(element);
      element = element.parentElement;
    }
    window.addEventListener('resize', measureBodyScrollY);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(measureBodyScrollY)
        : null;
    if (resizeObserver) {
      observedElements.forEach((item) => resizeObserver.observe(item));
    }
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measureBodyScrollY);
    };
  }, [enableBodyScrollY, measureBodyScrollY]);

  const tableNode = (
    <ActiontechTableStyleWrapper
      className={classnames('actiontech-table-namespace', className, {
        'disable-row-hover': disableRowHover
      })}
      locale={{
        emptyText: errorMessage ? (
          <Result
            status="error"
            title={t('common.request.noticeFailTitle')}
            subTitle={errorMessage}
          />
        ) : undefined
      }}
      {...props}
      scroll={{
        x: 'max-content',
        ...scroll,
        ...(enableBodyScrollY && bodyScrollY ? { y: bodyScrollY } : {})
      }}
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
  );

  return (
    <>
      {toolbar && (
        <ToolBar {...toolbar} setting={setting}>
          {toolbar.children}
        </ToolBar>
      )}

      {!!filterContainerProps && <FilterContainer {...filterContainerProps} />}

      <ConfigProvider theme={tableToken}>
        {enableBodyScrollY ? (
          <div ref={tableContainerRef}>{tableNode}</div>
        ) : (
          tableNode
        )}
      </ConfigProvider>
    </>
  );
};

export default ActiontechTable;
