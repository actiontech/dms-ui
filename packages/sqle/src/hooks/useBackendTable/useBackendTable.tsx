import {
  IFilterMeta,
  IFilterTip
} from '@actiontech/shared/lib/api/sqle/service/common';
import { FilterMetaFilterInputTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import {
  ActiontechTableFilterMeta,
  TableFilterContainerProps,
  TypeFilterElement
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { ExcludeSymbol } from '@actiontech/shared/lib/types/common.type';
import { Tooltip, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { groupBy } from 'lodash';
import { useCallback } from 'react';

const useBackendTable = () => {
  const tableColumnFactory = useCallback(
    <
      DataSourceItem extends { [key in string]: string },
      T extends Array<{
        desc?: string;
        field_name?: string;
        type?: string;
      }>
    >(
      head: T,
      options?: {
        customRender?: (
          text: string,
          record: DataSourceItem,
          index: number,
          fieldName: string
        ) => React.ReactNode;
      }
    ): ColumnType<DataSourceItem>[] => {
      const tableCellRenderWithEllipsisAndTooltipAndCopyable = (
        text: string
      ): React.ReactNode => {
        return text ? (
          <div style={{ minWidth: 40 }}>
            <Typography.Paragraph>
              <Tooltip title={text}>
                <Typography.Text style={{ maxWidth: 300 }} ellipsis={true}>
                  {text}
                </Typography.Text>
              </Tooltip>
            </Typography.Paragraph>
          </div>
        ) : (
          '-'
        );
      };
      return head.map((item) => {
        const renderMethod = (
          text: string,
          record: DataSourceItem,
          index: number,
          fieldName: string
        ) => {
          if (options?.customRender) {
            return options?.customRender?.(text, record, index, fieldName);
          }
          return tableCellRenderWithEllipsisAndTooltipAndCopyable(text);
        };

        return {
          dataIndex: item.field_name ?? '',
          title: (item.desc || item.field_name) ?? '',
          render: (...rest) => renderMethod(...rest, item.field_name ?? '')
        };
      });
    },
    []
  );

  const sortableTableColumnFactory = useCallback(
    <
      DataSourceItem extends { [key in string]: string },
      T extends Array<{
        desc?: string;
        field_name?: string;
        type?: string;
        sortable?: boolean;
      }>
    >(
      head: T,
      options?: {
        columnClassName?: string | ((type?: string) => string | undefined);
        customRender?: (
          text: string,
          record: DataSourceItem,
          fieldName: string,
          type?: string
        ) => React.ReactNode;
      }
    ): ActiontechTableColumn<DataSourceItem, Record<string, any>, string> => {
      return head.map<
        ActiontechTableColumn<DataSourceItem, Record<string, any>, string>[0]
      >((cell) => {
        const renderMethod = (text: string, record: DataSourceItem) => {
          if (options?.customRender) {
            return options?.customRender?.(
              text,
              record,
              cell.field_name ?? '',
              cell.type
            );
          }
          return text;
        };

        const cls =
          typeof options?.columnClassName === 'function'
            ? options.columnClassName(cell.type)
            : options?.columnClassName;
        return {
          dataIndex: cell.field_name as ExcludeSymbol<keyof DataSourceItem> &
            string,
          title: (cell.desc || cell.field_name) ?? '',
          render: renderMethod,
          className: cls,
          sorter: !!cell.sortable
        };
      });
    },
    []
  );

  const tableFilterMetaFactory = useCallback(
    (
      filterMetaList: IFilterMeta[],
      autoSelectAllFilters?: boolean
    ): {
      extraTableFilterMeta: ActiontechTableFilterMeta;
      tableFilterCustomProps: TableFilterContainerProps['filterCustomProps'];
    } => {
      const genFilterCustomType = (
        filterInputType: FilterMetaFilterInputTypeEnum,
        filterTips?: IFilterTip[]
      ): TypeFilterElement => {
        if (filterTips?.length) {
          return 'select';
        }
        if (filterInputType === FilterMetaFilterInputTypeEnum.date_time) {
          return 'date-range';
        }

        return 'input';
      };
      const genFilterCustomProps = (
        filterInputType: FilterMetaFilterInputTypeEnum,
        filterTips?: IFilterTip[]
      ) => {
        if (filterTips?.length) {
          const filterTipsGroupDictionary = groupBy(filterTips, 'group');

          return {
            options: Object.keys(filterTipsGroupDictionary)
              .map((group) => {
                const tips = filterTipsGroupDictionary[group];
                if (group) {
                  return {
                    label: group,
                    options: tips.map((v) => ({
                      label: v.desc,
                      value: v.value
                    }))
                  };
                }
                return tips.map((v) => ({ label: v.desc, value: v.value }));
              })
              .flat()
          };
        }

        if (filterInputType === FilterMetaFilterInputTypeEnum.date_time) {
          return {
            showTime: true
          };
        }
      };
      const filterCustomProps = new Map();
      const tableFilterMeta: ActiontechTableFilterMeta = new Map();
      filterMetaList.forEach((meta) => {
        if (meta.filter_name && meta.filter_input_type) {
          filterCustomProps.set(
            meta.filter_name,
            genFilterCustomProps(meta.filter_input_type, meta.filter_tip_list)
          );
          tableFilterMeta.set(meta.filter_name, {
            filterCustomType: genFilterCustomType(
              meta.filter_input_type,
              meta.filter_tip_list
            ),
            filterKey: meta.filter_name,
            filterLabel: meta.desc,
            checked: !!autoSelectAllFilters
          });
        }
      });
      return {
        extraTableFilterMeta: tableFilterMeta,
        tableFilterCustomProps: filterCustomProps
      };
    },
    []
  );

  return {
    tableColumnFactory,
    sortableTableColumnFactory,
    tableFilterMetaFactory
  };
};

export default useBackendTable;
