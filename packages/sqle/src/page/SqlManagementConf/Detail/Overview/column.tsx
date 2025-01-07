import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { IInstanceAuditPlanInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { SensitiveDisplay, TypedLink } from '@actiontech/shared';
import { InstanceAuditPlanInfoActiveStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  CheckCircleOutlined,
  CloseHexagonOutlined,
  InfoHexagonOutlined
} from '@actiontech/icons';
import { Typography } from 'antd';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const ConfDetailOverviewColumns: (
  projectID: string
) => ActiontechTableColumn<IInstanceAuditPlanInfo> = (projectID) => {
  return [
    {
      dataIndex: 'audit_plan_type',
      title: () => t('managementConf.detail.overview.column.auditPlanType'),
      filterCustomType: 'select',
      filterKey: 'filter_audit_plan_type',
      render: (data) => {
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
        if (!ruleTemplate?.name) {
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
      render: (status) => {
        if (status === InstanceAuditPlanInfoActiveStatusEnum.disabled) {
          return (
            <TableColumnWithIconStyleWrapper>
              <CloseHexagonOutlined />
              <span>
                {t('managementConf.list.table.column.taskStatus.disabled')}
              </span>
            </TableColumnWithIconStyleWrapper>
          );
        }
        if (status === InstanceAuditPlanInfoActiveStatusEnum.normal) {
          return (
            <TableColumnWithIconStyleWrapper>
              <CheckCircleOutlined />
              <span>
                {t('managementConf.list.table.column.taskStatus.normal')}
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
      title: () => t('managementConf.detail.overview.column.collectedSqlCount')
    },
    // #if [ee]
    {
      dataIndex: 'unsolved_sql_nums',
      title: () =>
        t('managementConf.detail.overview.column.problematicSqlCount')
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
