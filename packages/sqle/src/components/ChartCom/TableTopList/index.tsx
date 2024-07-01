import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { Table, ConfigProvider, TableProps } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import useThemeStyleData from '../../../hooks/useThemeStyleData';
import { TableTopListStyleWrapper } from './style';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

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
    hideTop3Style
  } = props;
  const { sqleTheme } = useThemeStyleData();
  const dataLength = dataSource?.length ?? 0;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorFillQuaternary:
            sqleTheme.reportStatistics.TableTopList.colorFillQuaternary
        }
      }}
    >
      <TableTopListStyleWrapper className="report-base-table-wrapper">
        <Table
          className={classNames('report-base-table', {
            'has-table-cont-style':
              typeof hideTop3Style === 'boolean'
                ? !hideTop3Style
                : !!dataLength,
            'no-table-data-style': !dataLength
          })}
          rowKey={rowKey}
          dataSource={dataSource}
          loading={{
            spinning: apiLoading,
            indicator: (
              <Icon
                component={() => (
                  <CommonIconStyleWrapper className="custom-icon-spin-dot">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="30px"
                      viewBox="0 0 24 30"
                      fill="currentColor"
                    >
                      <rect
                        x="0"
                        y="10"
                        width="4"
                        height="10"
                        fill="currentColor"
                        opacity="0.2"
                      >
                        <animate
                          attributeName="opacity"
                          attributeType="XML"
                          values="0.2; 1; .2"
                          begin="0s"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="height"
                          attributeType="XML"
                          values="10; 20; 10"
                          begin="0s"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="y"
                          attributeType="XML"
                          values="10; 5; 10"
                          begin="0s"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                      </rect>
                      <rect
                        x="8"
                        y="10"
                        width="4"
                        height="10"
                        fill="currentColor"
                        opacity="0.2"
                      >
                        <animate
                          attributeName="opacity"
                          attributeType="XML"
                          values="0.2; 1; .2"
                          begin="0.15s"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="height"
                          attributeType="XML"
                          values="10; 20; 10"
                          begin="0.15s"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="y"
                          attributeType="XML"
                          values="10; 5; 10"
                          begin="0.15s"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                      </rect>
                      <rect
                        x="16"
                        y="10"
                        width="4"
                        height="10"
                        fill="currentColor"
                        opacity="0.2"
                      >
                        <animate
                          attributeName="opacity"
                          attributeType="XML"
                          values="0.2; 1; .2"
                          begin="0.3s"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="height"
                          attributeType="XML"
                          values="10; 20; 10"
                          begin="0.3s"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="y"
                          attributeType="XML"
                          values="10; 5; 10"
                          begin="0.3s"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                      </rect>
                    </svg>
                  </CommonIconStyleWrapper>
                )}
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
        />
        <div
          hidden={dataLength === 0 || dataLength === 10}
          className="data-bottom-tip"
        >
          {t('reportStatistics.tableTopList.noMoreData')}
        </div>
      </TableTopListStyleWrapper>
    </ConfigProvider>
  );
};

export default TableTopList;
