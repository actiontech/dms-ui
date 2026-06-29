import { useEffect } from 'react';
import { Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { BasicButton } from '@actiontech/shared';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { ISkippedByRuleExceptionItem } from '@actiontech/shared/lib/api/sqle/service/common';
import AuditResultMessage from '../../AuditResultMessage';
import useRuleExceptionActions from '../useRuleExceptionActions';
import useRuleTips from '../../../hooks/useRuleTips';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ISqlManageRuleExceptionContext } from '../../../page/RuleException/index.data';

type SkippedRuleExceptionTableProps = {
  dataSource?: ISkippedByRuleExceptionItem[];
  sqlManageContext?: ISqlManageRuleExceptionContext;
  onRefresh?: () => void;
};

const SkippedRuleExceptionTable: React.FC<SkippedRuleExceptionTableProps> = ({
  dataSource = [],
  sqlManageContext,
  onRefresh
}) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const {
    canWrite,
    removeRuleException,
    navigateToExceptionDetail,
    submitting
  } = useRuleExceptionActions({
    sqlManageContext,
    onSuccess: onRefresh
  });
  const { updateRuleTips, ruleNameDescMap } = useRuleTips();

  useEffect(() => {
    updateRuleTips(projectName);
  }, [projectName, updateRuleTips]);

  const columns: ColumnsType<ISkippedByRuleExceptionItem> = [
    {
      dataIndex: 'rule_name',
      title: t('ruleException.skippedSection.rule'),
      render: (_, record) => {
        const desc = record.rule_name
          ? ruleNameDescMap.get(record.rule_name)
          : undefined;
        return (
          <Space direction="vertical" size={4}>
            <Typography.Text>{record.rule_name}</Typography.Text>
            {desc ? (
              <Typography.Text type="secondary">{desc}</Typography.Text>
            ) : null}
          </Space>
        );
      }
    },
    {
      dataIndex: 'level',
      title: t('ruleException.skippedSection.level'),
      render: (_, record) => <AuditResultMessage auditResult={record} />
    },
    {
      dataIndex: 'created_by',
      title: t('ruleException.skippedSection.createdBy'),
      render: (value: string | undefined) => value || '-'
    },
    {
      dataIndex: 'created_at',
      title: t('ruleException.skippedSection.createdAt'),
      render: (value: string | undefined) => formatTime(value, '-')
    },
    {
      dataIndex: 'desc',
      title: t('ruleException.skippedSection.reason'),
      render: (value: string | undefined) => value || '-'
    },
    {
      key: 'action',
      title: t('ruleException.skippedSection.action'),
      render: (_, record) => (
        <Space>
          <BasicButton
            type="link"
            size="small"
            onClick={() => navigateToExceptionDetail(record.exception_id)}
          >
            {t('ruleException.skippedSection.viewDetail')}
          </BasicButton>
          {canWrite ? (
            <BasicButton
              type="link"
              size="small"
              danger
              disabled={!record.exception_id || submitting}
              onClick={() => {
                if (record.exception_id) {
                  removeRuleException(record.exception_id);
                }
              }}
            >
              {t('ruleException.cancel.title')}
            </BasicButton>
          ) : null}
        </Space>
      )
    }
  ];

  if (!dataSource.length) {
    return null;
  }

  return (
    <section>
      <Typography.Title level={5}>
        {t('ruleException.skippedSection.title')}
      </Typography.Title>
      <Table
        rowKey={(record) =>
          `${record.rule_name ?? ''}-${record.exception_id ?? ''}`
        }
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size="small"
      />
    </section>
  );
};

export default SkippedRuleExceptionTable;
