import { IListRole } from '@actiontech/shared/lib/api/base/service/common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { ListRoleStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { orderBy } from 'lodash';
import { t } from '../../../../locale';
import generateTag from '../../utils/generateTag';
import { Space, Popover, Typography } from 'antd';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { CheckHexagonOutlined, CloseHexagonOutlined } from '@actiontech/icons';
import { groupBy } from 'lodash';

export const roleListColumns: () => ActiontechTableColumn<IListRole> = () => [
  {
    dataIndex: 'name',
    title: () => t('dmsUserCenter.role.roleForm.name')
  },
  {
    dataIndex: 'desc',
    title: () => t('dmsUserCenter.role.roleForm.desc'),
    className: 'ellipsis-column-width',
    ellipsis: true,
    render: (desc) => {
      return desc ? <BasicTypographyEllipsis textCont={desc} /> : '-';
    }
  },
  {
    dataIndex: 'stat',
    title: () => t('common.status'),
    render: (stat) => {
      return (
        <TableColumnWithIconStyleWrapper>
          {stat === ListRoleStatEnum.被禁用 ? (
            <CloseHexagonOutlined />
          ) : (
            <CheckHexagonOutlined />
          )}
          <span>{stat}</span>
        </TableColumnWithIconStyleWrapper>
      );
    }
  },
  {
    dataIndex: 'op_permissions',
    title: () => t('dmsUserCenter.role.roleForm.opPermissions'),
    render: (list) => {
      if (!Array.isArray(list)) {
        return '-';
      }
      const sortedList = orderBy(list, ['name'], ['asc']);
      const displayList = sortedList.slice(0, 3);

      const groupedPermissions = groupBy(list, 'module');
      const allPermissionsContent = Object.keys(groupedPermissions).map(
        (key, index) => {
          return (
            <Space direction="vertical" key={index}>
              {`${key}:`}
              <Space wrap>{generateTag(groupedPermissions[key])}</Space>
            </Space>
          );
        }
      );

      return (
        <Space wrap>
          {generateTag(displayList)}
          <Popover
            content={
              <Space direction="vertical">{allPermissionsContent}</Space>
            }
            placement="top"
            overlayStyle={{ maxWidth: 450 }}
            trigger="click"
          >
            <Typography.Link>
              {t('dmsUserCenter.role.roleForm.viewAll')}
            </Typography.Link>
          </Popover>
        </Space>
      );
    }
  }
];
