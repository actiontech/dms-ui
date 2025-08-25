import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { Table, TableProps } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import useThemeStyleData from '../../../hooks/useThemeStyleData';
import { TableTopListStyleWrapper } from './style';
import { BasicEmpty, SpinIndicator } from '@actiontech/dms-kit';
export interface ITableTopList<RecordType> extends TableProps<RecordType> {
  apiLoading: boolean;
  emptyCont?: string | ReactNode;
  errorCont?: string | ReactNode;
  onRefresh?: () => void;
  hideTop3Style?: boolean; // 默认为 true, 需要展示前 3 的背景颜色
}
const TableTopList = <T extends Record<string, any>>(
  props: ITableTopList<T>
) => {
  const { t } = useTranslation();
  const {
    apiLoading,
    rowKey,
    emptyCont,
    onRefresh,
    columns,
    dataSource,
    errorCont,
    hideTop3Style,
    scroll
  } = props;
  const { sqleTheme } = useThemeStyleData();
  const dataLength = dataSource?.length ?? 0;
  return (
    <TableTopListStyleWrapper className="report-base-table-wrapper">
      <Table
        className={classNames('report-base-table', {
          'has-table-cont-style':
            typeof hideTop3Style === 'boolean' ? !hideTop3Style : !!dataLength,
          'no-table-data-style': !dataLength
        })}
        rowKey={rowKey}
        dataSource={dataSource}
        loading={{
          spinning: apiLoading,
          indicator: (
            <Icon
              component={() => <SpinIndicator />}
              style={{
                color: sqleTheme.reportStatistics.loadingColor
              }}
            />
          )
        }}
        pagination={false}
        locale={{
          emptyText: () => (
            <BasicEmpty
              loading={apiLoading}
              emptyCont={emptyCont}
              errorInfo={errorCont}
              dataLength={dataLength}
              onRefresh={onRefresh}
            />
          )
        }}
        columns={columns}
        scroll={scroll}
      />
      <div
        hidden={dataLength === 0 || dataLength === 10}
        className="data-bottom-tip"
      >
        {t('reportStatistics.tableTopList.noMoreData')}
      </div>
    </TableTopListStyleWrapper>
  );
};
export default TableTopList;
