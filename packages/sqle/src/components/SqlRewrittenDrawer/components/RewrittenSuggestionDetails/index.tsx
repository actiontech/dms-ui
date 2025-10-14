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
  instanceName?: string;
  schema?: string;
};

const RewrittenSuggestionDetails: React.FC<Props> = ({
  dataSource,
  originalSql,
  taskID,
  sqlNumber,
  instanceName,
  schema
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
            instanceName={instanceName}
            schema={schema}
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
