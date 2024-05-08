import { useTranslation } from 'react-i18next';
import { Result, ConfigProvider, TableProps } from 'antd';
import classnames from 'classnames';

import {
  tableToken,
  ActiontechTableStyleWrapper
} from '../ActiontechTable/style';

export interface IBasicTable<T = Record<string, any>> extends TableProps<T> {
  errorMessage?: string;
  isPaginationFixed?: boolean;
}

const BasicTable = <T extends Record<string, any>>({
  className,
  errorMessage,
  isPaginationFixed,
  ...props
}: IBasicTable<T>) => {
  const { t } = useTranslation();

  return (
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
  );
};

export default BasicTable;
