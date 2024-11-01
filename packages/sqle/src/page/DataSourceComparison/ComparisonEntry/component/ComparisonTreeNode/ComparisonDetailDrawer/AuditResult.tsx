import { useMemo } from 'react';
import { IAuditResultItem } from '../../../../../../components/ReportDrawer/index.type';
import AuditResultMessage from '../../../../../../components/AuditResultMessage';
import { SqlAuditResultStyleWrapper } from './style';

type Props = {
  results: IAuditResultItem[];
};

const AuditResult: React.FC<Props> = ({ results }) => {
  const resultDataIsEmpty = useMemo(() => {
    return (Array.isArray(results) && !results.length) || !results;
  }, [results]);

  return (
    <SqlAuditResultStyleWrapper>
      {resultDataIsEmpty ? (
        <AuditResultMessage styleClass="result-item" />
      ) : (
        (results ?? [])?.map((item: IAuditResultItem, index: number) => {
          if (item.isRuleDeleted) {
            return (
              <AuditResultMessage
                styleClass="result-item"
                key={`${item.rule_name ?? ''}${item.message ?? ''}-${index}`}
                auditResult={{
                  level: item?.level ?? '',
                  message: item?.message ?? ''
                }}
                isRuleDeleted={item.isRuleDeleted}
              />
            );
          }
          return (
            <AuditResultMessage
              styleClass="result-item"
              key={`${item.rule_name ?? ''}${item.message ?? ''}-${index}`}
              auditResult={{
                level: item?.level ?? '',
                message: item?.message ?? '',
                annotation: item.annotation ?? ''
              }}
              showAnnotation
              moreBtnLink={
                item?.rule_name && item?.db_type
                  ? `/sqle/rule/knowledge/${item?.rule_name}/${item?.db_type}`
                  : ''
              }
            />
          );
        })
      )}
    </SqlAuditResultStyleWrapper>
  );
};

export default AuditResult;
