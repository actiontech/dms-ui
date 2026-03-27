import SqlRewrittenDrawer from 'sqle/src/components/SqlRewrittenDrawer';
import { IRewriteSQLData } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  sqlRewrittenExampleOriginalSql,
  sqlRewrittenExampleResult
} from './data';
import { useTranslation } from 'react-i18next';
import { Space, Typography } from 'antd';

interface SqlRewrittenExampleDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SqlRewrittenExampleDrawer: React.FC<SqlRewrittenExampleDrawerProps> = ({
  open,
  onClose
}) => {
  const { t } = useTranslation();
  return (
    <SqlRewrittenDrawer
      open={open}
      onClose={onClose}
      taskID="mock-sql-rewritten-example"
      originSqlInfo={{
        sql: sqlRewrittenExampleOriginalSql,
        number: 1
      }}
      mockData={sqlRewrittenExampleResult as IRewriteSQLData}
      title={
        <Space direction="vertical">
          {t('dmsHome.aiBanner.aiBannerExampleDrawerTitle')}
          <Typography.Text type="secondary">
            {t('dmsHome.aiBanner.aiBannerExampleDrawerDescription')}
          </Typography.Text>
        </Space>
      }
    />
  );
};

export default SqlRewrittenExampleDrawer;
