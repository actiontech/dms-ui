import { Tooltip, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';

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

  return {
    tableColumnFactory
  };
};

export default useBackendTable;
