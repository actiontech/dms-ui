import {
  ActiontechTableColumn,
  ActiontechTableActionMeta,
  PageInfoWithoutIndexAndSize,
  InlineActiontechTableMoreActionsButtonMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetProjectRuleTemplateListV1Params } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.d';
import { IProjectRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../locale';
import { Link } from 'react-router-dom';
import {
  IconCloneRule,
  IconExportRule,
  IconRuleItem
} from '../../../icon/Rule';
import { Space } from 'antd';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';
import { DatabaseTypeLogo } from '@actiontech/shared';

export type RuleTemplateTableParamType =
  PageInfoWithoutIndexAndSize<IGetProjectRuleTemplateListV1Params>;

export const RuleTemplateTableActions = (
  onAction: (
    record: IProjectRuleTemplateResV1 | undefined,
    type: string
  ) => void,
  isArchive: boolean
): {
  buttons: ActiontechTableActionMeta<IProjectRuleTemplateResV1>[];
  moreButtons?: InlineActiontechTableMoreActionsButtonMeta<IProjectRuleTemplateResV1>[];
} => {
  return !isArchive
    ? {
        buttons: [
          {
            text: t('common.edit'),
            key: 'edit-project-template',
            buttonProps: (record) => {
              return {
                onClick: () => {
                  onAction(record, 'edit');
                }
              };
            }
          },
          {
            text: t('common.delete'),
            key: 'delete-project-template',
            buttonProps: (record) => ({
              danger: true
            }),
            confirm: (record) => {
              return {
                title: t('ruleTemplate.deleteRuleTemplate.tips', {
                  name: record?.rule_template_name
                }),
                onConfirm: () => {
                  onAction(record, 'delete');
                }
              };
            }
          }
        ],
        moreButtons: [
          {
            key: 'clone-rule-template',
            text: t('ruleTemplate.cloneRuleTemplate.button'),
            onClick: (record) => onAction(record, 'clone'),
            icon: <IconCloneRule />
          },
          {
            key: 'export-rule-template',
            text: t('ruleTemplate.exportRuleTemplate.button'),
            onClick: (record) => onAction(record, 'export'),
            icon: <IconExportRule />
          }
        ]
      }
    : {
        buttons: [
          {
            key: 'clone-rule-template',
            text: t('ruleTemplate.ruleTemplateList.clone'),
            buttonProps: (record) => {
              return {
                onClick: () => {
                  onAction(record, 'clone');
                }
              };
            }
          },

          {
            key: 'export-rule-template',
            text: t('ruleTemplate.ruleTemplateList.export'),
            buttonProps: (record) => {
              return {
                onClick: () => {
                  onAction(record, 'export');
                }
              };
            }
          }
        ]
      };
};

export const RuleTemplateTableColumn: (
  projectID: string,
  isGlobal?: boolean
) => ActiontechTableColumn<
  IProjectRuleTemplateResV1,
  RuleTemplateTableParamType
> = (projectID, isGlobal) => {
  return [
    {
      dataIndex: 'rule_template_name',
      title: () => t('ruleTemplate.ruleTemplateList.table.templateName'),
      fixed: 'left',
      width: 300,
      render(name: string, record) {
        if (!name) {
          return '';
        }
        const skipUrl = isGlobal
          ? `/sqle/ruleManager/globalDetail/${name}/${record?.db_type ?? ''}`
          : `/sqle/project/${projectID}/rule/template/detail/${name}/${
              record?.db_type ?? ''
            }`;
        return (
          <Link to={skipUrl}>
            <Space size={12}>
              <IconRuleItem />
              {name}
            </Space>
          </Link>
        );
      }
    },
    {
      dataIndex: 'desc',
      title: () => t('ruleTemplate.ruleTemplateList.table.desc'),
      className: 'ellipsis-column-width',
      render: (desc: string) => {
        if (!desc) return '-';
        return <BasicTypographyEllipsis textCont={desc} />;
      }
    },
    {
      dataIndex: 'db_type',
      title: () => t('ruleTemplate.ruleTemplateList.table.dbType'),
      render(type: string) {
        if (!type) {
          return '-';
        }
        return (
          <DatabaseTypeLogo
            dbType={type}
            logoUrl={`/sqle/v1/static/instance_logo?instance_type=${type}`}
          />
        );
      }
    }
  ];
};
