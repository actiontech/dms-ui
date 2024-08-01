import {
  IFilterMeta,
  IFilterTip
} from '@actiontech/shared/lib/api/sqle/service/common';
import { FilterMetaFilterOpTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { FilterMetaFilterInputTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import {
  ActiontechTableFilterMeta,
  TableFilterContainerProps,
  TypeFilterElement
} from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { Tooltip, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { groupBy } from 'lodash';

const useBackendTable = () => {
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

  const tableColumnFactory = <
    DataSourceItem extends { [key in string]: string },
    T extends Array<{
      desc?: string;
      field_name?: string;
      type?: string;
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
  ): ColumnType<DataSourceItem>[] => {
    return head.map((item) => {
      const renderMethod = (text: string, record: DataSourceItem) => {
        if (options?.customRender) {
          return options?.customRender?.(
            text,
            record,
            item.field_name ?? '',
            item.type
          );
        }
        return tableCellRenderWithEllipsisAndTooltipAndCopyable(text);
      };

      const cls =
        typeof options?.columnClassName === 'function'
          ? options.columnClassName(item.type)
          : options?.columnClassName;

      return {
        dataIndex: item.field_name ?? '',
        title: (item.desc || item.field_name) ?? '',
        render: renderMethod,
        className: cls
      };
    });
  };

  const sortableTableColumnFactory = <
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
  ): ActiontechTableColumn<DataSourceItem> => {
    return head.map<ActiontechTableColumn<DataSourceItem>[0]>((cell) => {
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
        dataIndex: cell.field_name ?? '',
        title: (cell.desc || cell.field_name) ?? '',
        render: renderMethod,
        className: cls,
        sorter: !!cell.sortable
      };
    });
  };

  const tableFilterMetaFactory = (
    filterMetaList: IFilterMeta[]
  ): [
    ActiontechTableFilterMeta,
    TableFilterContainerProps['filterCustomProps']
  ] => {
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
    const genFilterKey = (
      filter_name: string,
      filterOpType?: FilterMetaFilterOpTypeEnum
    ): string | string[] => {
      if (filterOpType === FilterMetaFilterOpTypeEnum.between) {
        return [`${filter_name}_form`, `${filter_name}_to`];
      }
      return filter_name;
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
                  options: tips.map((v) => ({ label: v.desc, value: v.value }))
                };
              }
              return tips.map((v) => ({ label: v.desc, value: v.value }));
            })
            .flat()
        };
      }

      if (filterInputType === FilterMetaFilterInputTypeEnum.date_time) {
        return {
          time: true
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
          filterKey: genFilterKey(meta.filter_name, meta.filter_op_type),
          filterLabel: meta.desc,
          checked: false
        });
      }
    });
    return [tableFilterMeta, filterCustomProps];
  };

  return {
    tableColumnFactory,
    sortableTableColumnFactory,
    tableFilterMetaFactory
  };
};

export default useBackendTable;
