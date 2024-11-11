import { t } from '../../../locale';
import { IRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableActionMeta,
  ActiontechTableColumn,
  InlineActiontechTableMoreActionsButtonMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { Space } from 'antd';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';
import { DatabaseTypeLogo, TypedLink } from '@actiontech/shared';
import { useDbServiceDriver } from '@actiontech/shared/lib/global';
import {
  ProfileSquareFilled,
  LogoutBoxFilled,
  CheckboxMultipleBlankFilled
} from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const RuleTemplateColumns =
  (): ActiontechTableColumn<IRuleTemplateResV1> => {
    const { getLogoUrlByDbType } = useDbServiceDriver();
    return [
      {
        dataIndex: 'rule_template_name',
        title: () => t('ruleTemplate.ruleTemplateList.table.templateName'),
        render(name, row) {
          if (!name) {
            return '-';
          }

          return (
            <TypedLink
              to={ROUTE_PATHS.SQLE.RULE_MANAGEMENT.detail}
              params={{ templateName: name, dbType: row?.db_type ?? '' }}
            >
              <Space size={12}>
                <ProfileSquareFilled />
                {name}
              </Space>
            </TypedLink>
          );
        }
      },
      {
        dataIndex: 'desc',
        ellipsis: true,
        className: 'ellipsis-column-width',
        title: () => t('ruleTemplate.ruleTemplateList.table.desc'),
        render: (desc) => {
          if (!desc) return '';
          return <BasicTypographyEllipsis textCont={desc} />;
        }
      },
      {
        dataIndex: 'db_type',
        title: () => t('ruleTemplate.ruleTemplateList.table.dbType'),
        render(type) {
          if (!type) {
            return '-';
          }

          return (
            <DatabaseTypeLogo
              dbType={type}
              logoUrl={getLogoUrlByDbType(type)}
            />
          );
        }
      }
    ];
  };

export const RuleTemplateActions = (
  onNavigateUpdateRuleTemplate: (templateName: string) => void,
  onDelete: (name: string) => void,
  openCloneRuleTemplateModal: (rowData: IRuleTemplateResV1) => void,
  openExportRuleTemplateModal: (rowData: IRuleTemplateResV1) => void,
  canOperate: boolean
): {
  buttons: ActiontechTableActionMeta<IRuleTemplateResV1>[];
  moreButtons?: InlineActiontechTableMoreActionsButtonMeta<IRuleTemplateResV1>[];
  title?: ActiontechTableColumn<IRuleTemplateResV1>[0]['title'];
} => {
  if (!canOperate) {
    return { buttons: [] };
  }
  return {
    buttons: [
      {
        key: 'edit-rule-template',
        text: t('common.edit'),
        buttonProps: (record) => ({
          onClick: onNavigateUpdateRuleTemplate.bind(
            null,
            record?.rule_template_name ?? ''
          )
        })
      },
      {
        key: 'remove-rule-template',
        text: t('common.delete'),
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('ruleTemplate.deleteRuleTemplate.tips', {
            name: record?.rule_template_name
          }),
          onConfirm: onDelete.bind(null, record?.rule_template_name ?? '')
        })
      }
    ],
    moreButtons: [
      {
        key: 'clone-rule-template',
        text: t('ruleTemplate.cloneRuleTemplate.button'),
        onClick: (record) => openCloneRuleTemplateModal(record ?? {}),
        icon: <CheckboxMultipleBlankFilled />
      },
      {
        key: 'export-rule-template',
        text: t('ruleTemplate.exportRuleTemplate.button'),
        onClick: (record) => openExportRuleTemplateModal(record ?? {}),
        icon: <LogoutBoxFilled />
      }
    ]
  };
};
