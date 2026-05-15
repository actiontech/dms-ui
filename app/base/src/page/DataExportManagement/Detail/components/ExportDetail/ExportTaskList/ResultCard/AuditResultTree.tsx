import type { DataNode } from 'antd/es/tree';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IAuditSQLResult } from '@actiontech/shared/lib/api/base/service/common';
import AuditResultMessage from 'sqle/src/components/AuditResultMessage';
import { ExportResultTreeStyleWrapper } from '../../style';
import { DownOutlined } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/dms-kit';

const AuditResultTree: React.FC<{ auditResult?: IAuditSQLResult[] }> = ({
  auditResult
}) => {
  const { t } = useTranslation();

  const treeData: DataNode[] = useMemo(() => {
    const defaultTreeData: DataNode[] = [
      {
        title: (
          <span className="audit-result-tree-title">
            {t('dmsDataExport.detail.exportResult.taskDetail.auditResult')}
          </span>
        ),
        key: 'audit_tree_title',
        children: [
          {
            title: '-',
            key: 'empty_tree',
            isLeaf: true
          }
        ]
      }
    ];
    if (!auditResult || !auditResult?.length) {
      return defaultTreeData;
    }

    return [
      {
        title: (
          <span className="audit-result-tree-title">
            {t('dmsDataExport.detail.exportResult.taskDetail.auditResult')}
          </span>
        ),
        key: 'audit_tree_title',
        children: auditResult.map((item, index) => {
          return {
            title: (
              <AuditResultMessage
                key={`${item.rule_name ?? ''}${item.message ?? ''}-${index}`}
                auditResult={{
                  level: item?.level ?? '',
                  message: item?.message ?? ''
                }}
              />
            ),
            key: index,
            isLeaf: true
          };
        })
      }
    ];
  }, [auditResult, t]);

  return (
    <ExportResultTreeStyleWrapper
      showLine
      switcherIcon={
        <CommonIconStyleWrapper className="custom-icon custom-icon-arrow-down">
          <DownOutlined width={16} height={16} />
        </CommonIconStyleWrapper>
      }
      treeData={treeData}
      selectable={false}
    />
  );
};

export default AuditResultTree;
