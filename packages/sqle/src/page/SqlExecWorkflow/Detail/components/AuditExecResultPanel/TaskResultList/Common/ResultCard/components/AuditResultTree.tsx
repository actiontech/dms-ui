import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { IconArrowDown } from '@actiontech/shared/lib/Icon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template/index';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import AuditResultMessage from '../../../../../../../../../components/AuditResultMessage';
import { TaskAuditResultTreeStyleWrapper } from './style';

export interface AuditResultTreeProps {
  auditResult?: IAuditResult[];
}

const AuditResultTree: React.FC<AuditResultTreeProps> = ({ auditResult }) => {
  const { t } = useTranslation();

  const [treeData, setTreeData] = useState<DataNode[]>([
    {
      title: (
        <span className="audit-result-tree-title">
          {t('execWorkflow.audit.table.auditResult')}
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
  ]);

  const onLoadData: TreeProps['loadData'] = (node) => {
    if (!auditResult?.length) {
      return Promise.resolve();
    }

    const filterRuleNames = (
      auditResult?.map((v) => v.rule_name ?? '') ?? []
    ).filter((v) => !!v);

    if (!filterRuleNames?.length) {
      return new Promise<void>((res) => {
        if (auditResult) {
          setTreeData([
            {
              ...node,
              children: auditResult.map((item, index) => {
                return {
                  title: (
                    <AuditResultMessage
                      key={`${item.rule_name ?? ''}${
                        item.message ?? ''
                      }-${index}`}
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
          ]);
        }
        res();
      });
    }

    return rule_template
      .getRuleListV1({
        filter_rule_names: filterRuleNames.join(',')
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const { data } = res.data;
          const newResult = auditResult?.map((item) => {
            return {
              annotation:
                data?.find(
                  (i) =>
                    i.rule_name === item.rule_name && i.db_type === item.db_type
                )?.annotation ?? '',
              ...item
            };
          });
          if (newResult) {
            setTreeData([
              {
                ...node,
                children: newResult.map((item, index) => {
                  return {
                    title: (
                      <AuditResultMessage
                        key={`${item.rule_name ?? ''}${
                          item.message ?? ''
                        }-${index}`}
                        auditResult={{
                          level: item?.level ?? '',
                          message: item?.message ?? '',
                          annotation: item.annotation ?? ''
                        }}
                        showAnnotation
                        moreBtnLink={
                          item?.rule_name
                            ? `/sqle/rule/knowledge/${item?.rule_name}/${item.db_type}`
                            : ''
                        }
                      />
                    ),
                    key: index,
                    isLeaf: true
                  };
                })
              }
            ]);
          }
        }
      });
  };

  return (
    <TaskAuditResultTreeStyleWrapper
      showLine
      switcherIcon={<IconArrowDown width={16} height={16} color="#C3C6CD" />}
      treeData={treeData}
      selectable={false}
      loadData={onLoadData}
    />
  );
};

export default AuditResultTree;
