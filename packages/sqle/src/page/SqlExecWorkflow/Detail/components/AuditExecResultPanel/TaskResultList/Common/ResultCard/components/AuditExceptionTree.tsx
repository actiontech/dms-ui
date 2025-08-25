import { CommonIconStyleWrapper } from '@actiontech/dms-kit';
import { TaskAuditResultTreeStyleWrapper } from './style';
import { useMemo } from 'react';
import { DataNode } from 'antd/es/tree';
import { useTranslation } from 'react-i18next';
import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import AuditExceptionItem from '../../../../../../../../../components/AuditResultMessage/AuditExceptionItem';
import { DownOutlined } from '@actiontech/icons';

type Props = {
  auditExceptionResults: IAuditResult[];
};

const AuditExceptionTree: React.FC<Props> = ({ auditExceptionResults }) => {
  const { t } = useTranslation();

  const treeData = useMemo<DataNode[]>(() => {
    return [
      {
        title: (
          <span className="audit-result-tree-title">
            {t('auditPlan.report.drawer.subTitle.exception')}
          </span>
        ),
        key: 'audit_tree_title',
        children: auditExceptionResults.map((item, index) => ({
          title: <AuditExceptionItem auditExceptionResult={item} />,
          key: item.rule_name || index,
          isLeaf: true
        }))
      }
    ];
  }, [auditExceptionResults, t]);

  return (
    <TaskAuditResultTreeStyleWrapper
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

export default AuditExceptionTree;
