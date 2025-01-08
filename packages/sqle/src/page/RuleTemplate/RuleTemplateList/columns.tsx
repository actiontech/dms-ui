import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetProjectRuleTemplateListV1Params } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.d';
import { IProjectRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../locale';
import { Space } from 'antd';
import {
  BasicTypographyEllipsis,
  DatabaseTypeLogo,
  TypedLink
} from '@actiontech/shared';
import { ProfileSquareFilled } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export type RuleTemplateTableParamType =
  PageInfoWithoutIndexAndSize<IGetProjectRuleTemplateListV1Params>;

export const RuleTemplateTableColumn: (
  projectID: string,
  getLogoUrlByDbType: (dbType: string) => string,
  isGlobal?: boolean
) => ActiontechTableColumn<
  IProjectRuleTemplateResV1,
  RuleTemplateTableParamType
> = (projectID, getLogoUrlByDbType, isGlobal) => {
  return [
    {
      dataIndex: 'rule_template_name',
      title: () => t('ruleTemplate.ruleTemplateList.table.templateName'),
      render(name, record) {
        if (!name) {
          return '';
        }

        const path = isGlobal
          ? ROUTE_PATHS.SQLE.RULE_MANAGEMENT.detail
          : ROUTE_PATHS.SQLE.RULE_TEMPLATE.detail;
        return (
          <TypedLink
            to={path}
            params={{
              templateName: name,
              projectID,
              dbType: record.db_type ?? ''
            }}
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
      title: () => t('ruleTemplate.ruleTemplateList.table.desc'),
      className: 'ellipsis-column-width',
      render: (desc) => {
        if (!desc) return '-';
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
          <DatabaseTypeLogo dbType={type} logoUrl={getLogoUrlByDbType(type)} />
        );
      }
    }
  ];
};
