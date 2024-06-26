import {
  ActiontechTableColumn,
  ActiontechTableActionMeta,
  PageInfoWithoutIndexAndSize,
  InlineActiontechTableMoreActionsButtonMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetAuditPlansV2Params } from '@actiontech/shared/lib/api/sqle/service/audit_plan/index.d';
import {
  IAuditPlanResV2,
  IAuditPlanMetaV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { Link } from 'react-router-dom';
import { t } from '../../../locale';
import { ModalName } from '../../../data/ModalName';
import { BasicToolTips, DatabaseTypeLogo, TokenCom } from '@actiontech/shared';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BriefcaseFilled, InfoCircleOutlined } from '@actiontech/icons';

export type PlanListTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetAuditPlansV2Params,
  'project_name'
>;

export const PlanListAction = ({
  onDeletePlan,
  onEditPlan,
  openModal,
  projectArchive,
  isAdmin,
  isProjectManager,
  userID
}: {
  onEditPlan: (record: IAuditPlanResV2) => void;
  onDeletePlan: (name: string) => void;
  openModal: (name: ModalName, row?: IAuditPlanResV2) => void;
  projectArchive: boolean;
  isAdmin: boolean;
  isProjectManager: boolean;
  userID: string;
}): {
  buttons: ActiontechTableActionMeta<IAuditPlanResV2>[];
  moreButtons?: InlineActiontechTableMoreActionsButtonMeta<IAuditPlanResV2>[];
} => {
  return !projectArchive
    ? {
        buttons: [
          {
            text: t('common.edit'),
            key: 'edit-plan-task',
            buttonProps: (record) => {
              return {
                onClick: () => {
                  onEditPlan(record as IAuditPlanResV2);
                }
              };
            },
            permissions: (record) => {
              return (
                isAdmin || isProjectManager || record?.create_user_id === userID
              );
            }
          },
          {
            text: t('common.delete'),
            key: 'delete-plan-task',
            buttonProps: () => ({
              danger: true
            }),
            confirm: (record) => {
              return {
                title: t('auditPlan.remove.confirm', {
                  name: record?.audit_plan_name
                }),
                onConfirm: () => {
                  onDeletePlan(record?.audit_plan_name ?? '');
                }
              };
            },
            permissions: (record) => {
              return (
                isAdmin || isProjectManager || record?.create_user_id === userID
              );
            }
          }
        ],
        moreButtons: [
          {
            text: t('auditPlan.list.operator.notice'),
            key: 'subscribe',
            onClick: (record) => {
              openModal(ModalName.Subscribe_Notice, record);
            }
          }
        ]
      }
    : {
        buttons: [
          {
            text: t('auditPlan.list.operator.notice'),
            key: 'subscribe',
            buttonProps: (record) => {
              return {
                onClick: () => {
                  openModal(ModalName.Subscribe_Notice, record);
                }
              };
            }
          }
        ]
      };
};

const PlanListColumn: (
  projectID: string,
  getLogoUrlByDbType: (dbType: string) => string
) => ActiontechTableColumn<IAuditPlanResV2, PlanListTableFilterParamType> = (
  projectID,
  getLogoUrlByDbType
) => {
  return [
    {
      dataIndex: 'audit_plan_name',
      title: () => t('auditPlan.list.table.audit_plan_name'),
      fixed: 'left',
      render: (text: string) => {
        return (
          <TableColumnWithIconStyleWrapper>
            <BriefcaseFilled width={14} height={14} />
            <Link to={`/sqle/project/${projectID}/audit-plan/detail/${text}`}>
              <span>{text}</span>
            </Link>
          </TableColumnWithIconStyleWrapper>
        );
      }
    },
    {
      dataIndex: 'audit_plan_meta',
      title: () => t('auditPlan.list.table.audit_plan_type'),
      fixed: 'left',
      render: (meta: IAuditPlanMetaV1) => {
        return meta?.audit_plan_type_desc;
      }
    },
    {
      dataIndex: 'audit_plan_cron',
      title: () => t('auditPlan.list.table.audit_plan_cron')
    },
    {
      dataIndex: 'audit_plan_instance_name',
      title: () => t('auditPlan.list.table.audit_plan_instance_name')
    },
    {
      dataIndex: 'audit_plan_instance_database',
      title: () => t('auditPlan.list.table.audit_plan_instance_database')
    },
    {
      dataIndex: 'audit_plan_db_type',
      title: () => t('auditPlan.list.table.audit_plan_db_type'),
      render(type: string) {
        if (!type) {
          return '--';
        }

        return (
          <DatabaseTypeLogo dbType={type} logoUrl={getLogoUrlByDbType(type)} />
        );
      }
    },
    {
      dataIndex: 'rule_template',
      title: () => t('auditPlan.list.table.audit_rule_template'),
      render(ruleTemplate: IAuditPlanResV2['rule_template'], record) {
        if (!ruleTemplate?.name) {
          return '';
        }

        const path = ruleTemplate.is_global_rule_template
          ? `/sqle/rule-manager/global-detail/${ruleTemplate.name}/${record.audit_plan_db_type}`
          : `/sqle/project/${projectID}/rule/template/detail/${ruleTemplate.name}/${record.audit_plan_db_type}`;

        return <Link to={path}>{ruleTemplate.name}</Link>;
      }
    },
    {
      dataIndex: 'audit_plan_token',
      width: 210,
      title: () => (
        <>
          <BasicToolTips
            suffixIcon={<InfoCircleOutlined />}
            title={t('auditPlan.list.table.audit_plan_token_tips')}
          >
            {t('auditPlan.list.table.audit_plan_token')}
          </BasicToolTips>
        </>
      ),
      render: (text) => {
        if (!text) return '--';
        return <TokenCom text={text} />;
      }
    }
  ];
};

export default PlanListColumn;
