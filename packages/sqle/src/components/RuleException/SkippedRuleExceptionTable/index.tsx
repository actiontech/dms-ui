import { useEffect } from 'react';
import { Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoHexagonFilled,
  WarningFilled
} from '@actiontech/icons';
import { BasicButton } from '@actiontech/shared';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { ISkippedByRuleExceptionItem } from '@actiontech/shared/lib/api/sqle/service/common';
import { getAuditResultDisplayText } from '../../AuditResultMessage/getAuditResultDisplayText';
import { PASS_AUDIT_LEVELS } from '../../AuditResultMessage/auditLevelUtils';
import useRuleExceptionActions from '../useRuleExceptionActions';
import useRuleTips from '../../../hooks/useRuleTips';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ISqlManageRuleExceptionContext } from '../../../page/RuleException/index.data';

const SkippedRuleLevelCell: React.FC<{ level?: string }> = ({ level }) => {
  const { t } = useTranslation();

  const renderIcon = () => {
    if (
      !level ||
      PASS_AUDIT_LEVELS.includes(level as (typeof PASS_AUDIT_LEVELS)[number])
    ) {
      return <CheckCircleFilled width={20} height={20} />;
    }
    if (level === 'notice') {
      return <InfoHexagonFilled width={20} height={20} />;
    }
    if (level === 'warn') {
      return <WarningFilled width={20} height={20} />;
    }
    if (level === 'error') {
      return <CloseCircleFilled width={20} height={20} />;
    }
    return null;
  };

  const renderLabel = () => {
    if (
      !level ||
      PASS_AUDIT_LEVELS.includes(level as (typeof PASS_AUDIT_LEVELS)[number])
    ) {
      return t('rule.ruleLevelIcon.normal');
    }
    if (level === 'notice') {
      return t('rule.ruleLevelIcon.notice');
    }
    if (level === 'warn') {
      return t('rule.ruleLevelIcon.warn');
    }
    if (level === 'error') {
      return t('rule.ruleLevelIcon.error');
    }
    return level;
  };

  return (
    <Space size={8} align="center">
      {renderIcon()}
      <Typography.Text>{renderLabel()}</Typography.Text>
    </Space>
  );
};

const getSkippedRuleLabel = (
  record: ISkippedByRuleExceptionItem,
  ruleNameDescMap: Map<string, string>,
  t: ReturnType<typeof useTranslation>['t'],
  i18n: ReturnType<typeof useTranslation>['i18n']
) => {
  const ruleName = record.rule_name;
  if (!ruleName) {
    return '-';
  }

  const ruleTipsLabel = ruleNameDescMap.get(ruleName);
  if (ruleTipsLabel) {
    return ruleTipsLabel;
  }

  const auditResultLabel = getAuditResultDisplayText(record, t, {
    i18nInstance: i18n
  });
  if (auditResultLabel) {
    return auditResultLabel;
  }

  return ruleName;
};

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
  const { t, i18n } = useTranslation();
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
      render: (_, record) => (
        <Typography.Text>
          {getSkippedRuleLabel(record, ruleNameDescMap, t, i18n)}
        </Typography.Text>
      )
    },
    {
      dataIndex: 'level',
      title: t('ruleException.skippedSection.level'),
      render: (_, record) => <SkippedRuleLevelCell level={record.level} />
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
