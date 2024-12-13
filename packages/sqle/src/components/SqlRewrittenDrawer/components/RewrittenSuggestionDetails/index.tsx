import { List } from 'antd';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import RewrittenSuggestionItem from './RewrittenSuggestionItem';
import { useTranslation } from 'react-i18next';
import EmptyContent from '../Common/EmptyContent';

type Props = {
  dataSource: IRewriteSuggestion[];
  originalSql: string;
  taskID: string;
  sqlNumber: number;
};

const RewrittenSuggestionDetails: React.FC<Props> = ({
  dataSource,
  originalSql,
  taskID,
  sqlNumber
}) => {
  const { t } = useTranslation();
  const generateOverallRewrittenSql = (sql?: string, ddl?: string): string => {
    if (!sql && !ddl) {
      return '-';
    }

    if (!ddl && sql) {
      return sql;
    }

    return `${ddl}\n\n${sql}`;
  };
  return (
    <List
      dataSource={dataSource}
      renderItem={(item, index) => {
        return (
          <RewrittenSuggestionItem
            dataSource={item}
            taskID={taskID}
            sqlNumber={sqlNumber}
            originalSql={
              index === 0
                ? originalSql
                : generateOverallRewrittenSql(
                    dataSource[index - 1].rewritten_sql,
                    dataSource[index - 1].ddl_dcl
                  )
            }
          />
        );
      }}
      locale={{
        emptyText: (
          <EmptyContent
            text={t('sqlRewrite.noOptimizationSpaceForCurrentSql')}
          />
        )
      }}
    />
  );
};

export default RewrittenSuggestionDetails;
