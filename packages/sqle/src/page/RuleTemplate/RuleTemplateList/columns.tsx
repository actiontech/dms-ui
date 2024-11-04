import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetProjectRuleTemplateListV1Params } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.d';
import { IProjectRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { t } from '../../../locale';
import { Link } from 'react-router-dom';
import { Space } from 'antd';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';
import { DatabaseTypeLogo } from '@actiontech/shared';
import { ProfileSquareFilled } from '@actiontech/icons';

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
        const skipUrl = isGlobal
          ? `/sqle/rule-manager/global-detail/${name}/${record?.db_type ?? ''}`
          : `/sqle/project/${projectID}/rule/template/detail/${name}/${
              record?.db_type ?? ''
            }`;
        return (
          <Link to={skipUrl}>
            <Space size={12}>
              <ProfileSquareFilled />
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
