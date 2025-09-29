import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { t } from '../../../../locale';
import { formatTime } from '@actiontech/dms-kit';
import { IInstanceAuditPlanInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { SensitiveDisplay, BasicToolTip } from '@actiontech/dms-kit';
import { TypedLink } from '@actiontech/shared';
import {
  InstanceAuditPlanInfoLastCollectionStatusEnum,
  InstanceAuditPlanInfoActiveStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { TableColumnWithIconStyleWrapper } from '@actiontech/dms-kit';
import {
  CheckCircleOutlined,
  CloseHexagonOutlined,
  InfoHexagonOutlined,
  InfoCircleOutlined
} from '@actiontech/icons';
import { Typography } from 'antd';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
export const confDetailOverviewColumns: (
  projectID: string,
  isPerformanceCollectScanType: (scanType?: string) => boolean
) => ActiontechTableColumn<IInstanceAuditPlanInfo> = (
  projectID,
  isPerformanceCollectScanType
) => {
  return [
    {
      dataIndex: 'audit_plan_type',
      title: () => t('managementConf.detail.overview.column.auditPlanType'),
      filterCustomType: 'select',
      filterKey: 'filter_audit_plan_type',
      render: (data, record) => {
        if (isPerformanceCollectScanType(record.audit_plan_type?.type)) {
          return (
            <BasicToolTip
              title={t(
                'managementConf.detail.overview.column.performanceCollectTips'
              )}
            >
              {data?.desc}
            </BasicToolTip>
          );
        }
        return data?.desc ? (
          <Typography.Link>{data.desc}</Typography.Link>
        ) : (
          '-'
        );
      }
    },
    {
      dataIndex: 'audit_plan_rule_template',
      title: () => t('managementConf.detail.overview.column.auditRuleTemplate'),
      render: (ruleTemplate, record) => {
        if (
          !ruleTemplate?.name ||
          isPerformanceCollectScanType(record.audit_plan_type?.type)
        ) {
          return '-';
        }
        const path = ruleTemplate.is_global_rule_template
          ? ROUTE_PATHS.SQLE.RULE_MANAGEMENT.detail
          : ROUTE_PATHS.SQLE.RULE_TEMPLATE.detail;
        return (
          <TypedLink
            onClick={(e) => {
              e.stopPropagation();
            }}
            target="_blank"
            to={path}
            params={{
              projectID,
              dbType: record.audit_plan_db_type ?? '',
              templateName: ruleTemplate.name
            }}
          >
            {ruleTemplate.name}
          </TypedLink>
        );
      }
    },
    {
      dataIndex: 'active_status',
      title: () => t('managementConf.detail.overview.column.status'),
      render: (status, record) => {
        if (status === InstanceAuditPlanInfoActiveStatusEnum.disabled) {
          return (
            <TableColumnWithIconStyleWrapper>
              <CloseHexagonOutlined />
              <span>
                {t('managementConf.detail.overview.column.taskStatus.disabled')}
              </span>
            </TableColumnWithIconStyleWrapper>
          );
        }
        if (
          status === InstanceAuditPlanInfoActiveStatusEnum.normal &&
          record.last_collection_status ===
            InstanceAuditPlanInfoLastCollectionStatusEnum.abnormal
        ) {
          return (
            <TableColumnWithIconStyleWrapper>
              <BasicToolTip
                prefixIcon={<InfoCircleOutlined />}
                title={t('managementConf.detail.overview.column.abnormalTips')}
              />
              <span>
                {t('managementConf.detail.overview.column.taskStatus.abnormal')}
              </span>
            </TableColumnWithIconStyleWrapper>
          );
        }
        if (status === InstanceAuditPlanInfoActiveStatusEnum.normal) {
          return (
            <TableColumnWithIconStyleWrapper>
              <CheckCircleOutlined />
              <span>
                {t('managementConf.detail.overview.column.taskStatus.normal')}
              </span>
            </TableColumnWithIconStyleWrapper>
          );
        }
        return (
          <TableColumnWithIconStyleWrapper>
            <InfoHexagonOutlined />
            <span>{t('common.unknownStatus')}</span>
          </TableColumnWithIconStyleWrapper>
        );
      }
    },
    {
      dataIndex: 'exec_cmd',
      title: () => t('managementConf.detail.overview.column.connectionInfo'),
      render: (text) => {
        if (!text) return '-';
        return <SensitiveDisplay text={text} />;
      }
    },
    {
      dataIndex: 'total_sql_nums',
      title: () => t('managementConf.detail.overview.column.collectedSqlCount'),
      render: (text, record) => {
        if (isPerformanceCollectScanType(record.audit_plan_type?.type)) {
          return '-';
        }
        return text;
      }
    },
    // #if [ee]
    {
      dataIndex: 'unsolved_sql_nums',
      title: () =>
        t('managementConf.detail.overview.column.problematicSqlCount'),
      render: (text, record) => {
        if (isPerformanceCollectScanType(record.audit_plan_type?.type)) {
          return '-';
        }
        return text;
      }
    },
    // #endif
    {
      dataIndex: 'last_collection_time',
      title: () =>
        t('managementConf.detail.overview.column.lastCollectionTime'),
      render: (time) => formatTime(time, '-')
    }
  ];
};
