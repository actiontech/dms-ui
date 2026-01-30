import { t } from '../../../locale';
import { IRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { Space } from 'antd';
import { DatabaseTypeLogo } from '@actiontech/dms-kit';
import { BasicTypographyEllipsis, TypedLink } from '@actiontech/shared';
import { useDbServiceDriver } from '@actiontech/shared/lib/features';
import { ProfileSquareFilled } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
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
              params={{
                templateName: name,
                dbType: row?.db_type ?? ''
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
