import { Link } from 'react-router-dom';
import { t } from '../../../locale';
import { Space } from 'antd';
import { BasicTag } from '@actiontech/shared';
import { ModalName } from '~/data/enum';
import { IListDataPermissionTemplate } from '@actiontech/shared/lib/api/provision/service/common';
import {
  ActiontechTableColumn,
  ActiontechTableProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BriefcaseFilled } from '@actiontech/icons';

export const AuthTemplateListTableColumns: (
  projectID: string
) => ActiontechTableColumn<IListDataPermissionTemplate> = (projectID) => [
  {
    title: t('auth.template.columns.name'),
    dataIndex: 'name',
    render: (name) => {
      return (
        <TableColumnWithIconStyleWrapper>
          <BriefcaseFilled width={14} height={14} />
          <span>{name ?? '-'}</span>
        </TableColumnWithIconStyleWrapper>
      );
    }
  },
  {
    title: t('auth.template.columns.authorization_purpose'),
    dataIndex: 'authorization_purpose',
    render: (purpose) => {
      return (
        purpose?.map((item) => (
          <Space key={item}>
            <BasicTag>
              <Link to={`/provision/project/${projectID}/auth/list/${item}`}>
                {item}
              </Link>
            </BasicTag>
          </Space>
        )) ?? '-'
      );
    }
  }
];

export const AuthTemplateListActions = (
  onNavigateUpdateTemplate: (record: IListDataPermissionTemplate) => void,
  onRemoveTemplate: (record: IListDataPermissionTemplate) => void,
  onNavigateToAuthList: (record: IListDataPermissionTemplate) => void,
  onOpenModal: (name: ModalName, record?: IListDataPermissionTemplate) => void
): ActiontechTableProps<IListDataPermissionTemplate>['actions'] => {
  return {
    buttons: [
      {
        key: 'edit-AuthTemplate',
        text: t('common.edit'),
        buttonProps: (record) => ({
          onClick: onNavigateUpdateTemplate.bind(null, record ?? {})
        })
      },
      {
        key: 'remove-AuthTemplate',
        text: t('common.delete'),
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('auth.removeTemplate.deleteTips', {
            name: record?.name
          }),
          onConfirm: onRemoveTemplate.bind(null, record ?? {})
        })
      }
    ],
    moreButtons: [
      {
        key: 'jumpAuth',
        text: t('auth.button.addAuth'),
        onClick: (record) => onNavigateToAuthList(record ?? {})
      },
      {
        key: 'copy-AuthTemplate',
        text: t('auth.button.copyTemplate'),
        onClick: (record) => onOpenModal(ModalName.CopyTemplate, record)
      }
    ]
  };
};
