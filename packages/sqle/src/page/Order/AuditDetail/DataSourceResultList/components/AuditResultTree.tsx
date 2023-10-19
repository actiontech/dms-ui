import { DataSourceAuditResultTreeStyleWrapper } from '../../style';
import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import type { DataNode } from 'antd/es/tree';
import { IconArrowDown } from '@actiontech/shared/lib/Icon';
import { useMemo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconOrderAuditResultNotice,
  IconOrderAuditResultWarning,
  IconOrderAuditResultError,
  IconOrderAuditResultSuccess
} from '../../../../../icon/Order';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const auditStatusMap: {
  [key in RuleResV1LevelEnum]: ReactNode;
} = {
  [RuleResV1LevelEnum.error]: <IconOrderAuditResultError />,
  [RuleResV1LevelEnum.notice]: <IconOrderAuditResultNotice />,
  [RuleResV1LevelEnum.warn]: <IconOrderAuditResultWarning />,
  [RuleResV1LevelEnum.normal]: <IconOrderAuditResultSuccess />
};

const AuditResultTree: React.FC<{ auditResult?: IAuditResult[] }> = ({
  auditResult
}) => {
  const { t } = useTranslation();

  const treeData: DataNode[] = useMemo(() => {
    return [
      {
        title: (
          <span className="audit-result-tree-title">
            {t('audit.table.auditResult')}
          </span>
        ),
        key: 'audit_tree_title',
        children: auditResult?.map((result, index) => {
          return {
            title: (
              <span>
                {auditStatusMap[result.level as RuleResV1LevelEnum]}{' '}
                <span className="audit-result-text-describe">
                  {result.message}
                </span>
              </span>
            ),
            key: index
          };
        }) || [
          {
            title: '-',
            key: 'empty_tree'
          }
        ]
      }
    ];
  }, [auditResult, t]);

  return (
    <DataSourceAuditResultTreeStyleWrapper
      showLine
      switcherIcon={<IconArrowDown width={16} height={16} color="#C3C6CD" />}
      treeData={treeData}
      selectable={false}
    ></DataSourceAuditResultTreeStyleWrapper>
  );
};

export default AuditResultTree;
